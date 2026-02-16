import mongoose from 'mongoose';
import Certificate from '../models/certificate.model';
import CertificateRequest from '../models/certificate-request.model';
import SubscriptionPlan from '../models/subscription-plan.model';
import User from '../models/user.model';
import Notification from '../models/notification.model';
import { notificationEmitter } from '../utils/notificationEmitter';
import { EmailService } from './email.service';

type IssuePayload = {
    templateId?: string;
    certificateName?: string;
    editedHtml?: string;
    customText?: string;
    userEmail?: string;
    fieldPositions?: {
        category?: { x: number; y: number };
        username?: { x: number; y: number };
        certificateId?: { x: number; y: number };
        issueDate?: { x: number; y: number };
        validTill?: { x: number; y: number };
    };
    fieldValues?: {
        category?: string;
        username?: string;
        certificateId?: string;
        issueDate?: string;
        validTill?: string;
    };
    templateImageDataUrl?: string;
    templateWidth?: number;
    templateHeight?: number;
};

const DEFAULT_TEMPLATE_HTML = `
<div style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; border: 8px solid #0f172a; padding: 40px;">
    <h1 style="text-align:center; margin-bottom: 8px;">Certificate of Subscription</h1>
    <p style="text-align:center; color: #475569; margin-top: 0;">Issued by HireXO</p>
    <div style="margin: 32px 0; text-align:center;">
        <p style="font-size: 18px;">This certifies that</p>
        <h2 style="margin: 8px 0;">{{userName}}</h2>
        <p style="font-size: 16px;">({{userEmail}})</p>
        <p style="font-size: 18px; margin-top: 24px;">has successfully activated</p>
        <h3 style="margin: 8px 0;">{{planName}}</h3>
        <p>for role: <strong>{{role}}</strong></p>
        <p style="margin-top: 24px;">Issued On: <strong>{{issueDate}}</strong></p>
        <p>Valid Until: <strong>{{expiryDate}}</strong></p>
    </div>
    <p style="text-align:center; color:#64748b;">Certificate ID: {{certificateId}}</p>
</div>
`.trim();

export class CertificateRequestService {
    private emailService: EmailService;

    constructor() {
        this.emailService = new EmailService();
    }

    public async listRequests(params: {
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
    }) {
        const { status, search, page = 1, limit = 20 } = params;
        const query: any = {};

        if (status && ['pending', 'issued', 'rejected'].includes(status)) {
            query.status = status;
        }

        if (search) {
            const users = await User.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }).select('_id');
            query.userId = { $in: users.map((u) => u._id) };
        }

        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            CertificateRequest.find(query)
                .populate('userId', 'name email role profile')
                .populate('planId', 'name durationDays type')
                .populate('processedBy', 'name email')
                .sort({ requestedAt: -1 })
                .skip(skip)
                .limit(limit),
            CertificateRequest.countDocuments(query)
        ]);

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }

    public async rejectRequest(requestId: string, adminId: string, reason?: string) {
        const request = await CertificateRequest.findById(requestId);
        if (!request) {
            throw new Error('Certificate request not found');
        }
        if (request.status !== 'pending') {
            throw new Error('Only pending requests can be rejected');
        }

        request.status = 'rejected';
        request.processedAt = new Date();
        request.processedBy = new mongoose.Types.ObjectId(adminId);
        request.rejectionReason = reason;
        await request.save();
        return request;
    }

    public async issueRequest(requestId: string, adminId: string, payload: IssuePayload) {
        const { request, user, plan, now, expiryDate, finalHtml, renderWidth, renderHeight } = await this.prepareRenderData(requestId, payload, true);
        const certificateName = payload.certificateName || `${plan.name} Certificate`;
        const pdfUrl = await this.generatePdfDataUrlFromHtml(finalHtml, certificateName, renderWidth, renderHeight);

        const certificate = await Certificate.create({
            userId: user._id,
            name: certificateName,
            issueDate: now,
            expiryDate,
            successRate: user.interviewSuccessRate || 0,
            status: 'Active',
            verificationStatus: 'approved',
            verifiedBy: new mongoose.Types.ObjectId(adminId),
            verifiedAt: now,
            documentUrl: pdfUrl,
            subscriptionId: request.subscriptionId,
            planId: plan._id,
            issuedBy: new mongoose.Types.ObjectId(adminId),
            pdfUrl,
            fieldPositions: payload.fieldPositions
        });

        request.status = 'issued';
        request.processedAt = now;
        request.processedBy = new mongoose.Types.ObjectId(adminId);
        request.rejectionReason = undefined;
        await request.save();

        const userNotification = await Notification.create({
            userId: user._id,
            title: 'Certificate Issued',
            message: 'Your certificate has been issued and is ready for download.',
            type: 'success',
            relatedId: String(certificate._id),
            relatedType: 'certificate_issued',
            read: false
        });

        notificationEmitter.emit('new_notification', {
            userId: user._id,
            notification: userNotification
        });

        try {
            await this.emailService.sendCertificateIssuedEmail(user.email, {
                userName: user.name,
                planName: plan.name,
                expiryDate,
                downloadLink: pdfUrl
            });
        } catch (error) {
            // Email failure must not block issuance.
            console.error('Certificate email delivery failed:', error);
        }

        return { request, certificate };
    }

    public async previewRequest(requestId: string, payload: IssuePayload) {
        const { finalHtml, plan, expiryDate, now } = await this.prepareRenderData(requestId, payload, false);
        return {
            html: finalHtml,
            meta: {
                plan: plan.name,
                issueDate: now.toISOString(),
                expiryDate: expiryDate.toISOString()
            }
        };
    }

    private async prepareRenderData(requestId: string, payload: IssuePayload, enforcePending: boolean) {
        const request = await CertificateRequest.findById(requestId).populate('planId');
        if (!request) {
            throw new Error('Certificate request not found');
        }
        if (enforcePending && request.status !== 'pending') {
            throw new Error(`Request already ${request.status}`);
        }

        if (enforcePending) {
            const existingCertificate = await Certificate.findOne({ subscriptionId: request.subscriptionId });
            if (existingCertificate) {
                throw new Error('Certificate already issued for this subscription');
            }
        }

        const user = await User.findById(request.userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (payload.userEmail && payload.userEmail.toLowerCase() !== user.email.toLowerCase()) {
            throw new Error('Entered email does not match the subscription owner');
        }

        const plan = await SubscriptionPlan.findById(request.planId);
        if (!plan || !plan.isActive) {
            throw new Error('Subscription plan not found or inactive');
        }

        if (!user.activeSubscriptionId || String(user.activeSubscriptionId) !== String(plan._id)) {
            throw new Error('No valid active subscription found for this request');
        }

        const now = new Date();
        const expiryDate = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
        const certificateId = new mongoose.Types.ObjectId().toString();
        const renderWidth = payload.templateWidth || 1536;
        const renderHeight = payload.templateHeight || 1021;
        const templateValues = {
            userName: this.escapeHtml(user.name),
            userEmail: this.escapeHtml(user.email),
            role: this.escapeHtml(user.role),
            planName: this.escapeHtml(plan.name),
            issueDate: this.escapeHtml(now.toLocaleDateString()),
            expiryDate: this.escapeHtml(expiryDate.toLocaleDateString()),
            certificateId: this.escapeHtml(certificateId),
            category: this.escapeHtml(this.resolveResourceCategory(user)),
            adminNote: this.escapeHtml(payload.customText || '')
        };

        let finalHtml = '';
        if (payload.fieldPositions && payload.templateImageDataUrl) {
            finalHtml = this.buildPositionedTemplateHtml({
                templateImageDataUrl: payload.templateImageDataUrl,
                width: renderWidth,
                height: renderHeight,
                fieldPositions: payload.fieldPositions,
                fieldValues: payload.fieldValues || {},
                values: templateValues
            });
        } else {
            const baseTemplate = payload.editedHtml || DEFAULT_TEMPLATE_HTML;
            finalHtml = this.renderTemplate(baseTemplate, templateValues);
        }

        return { request, user, plan, now, expiryDate, finalHtml, renderWidth, renderHeight };
    }

    private buildPositionedTemplateHtml(args: {
        templateImageDataUrl: string;
        width: number;
        height: number;
        fieldPositions: NonNullable<IssuePayload['fieldPositions']>;
        fieldValues: NonNullable<IssuePayload['fieldValues']>;
        values: {
            userName: string;
            issueDate: string;
            expiryDate: string;
            certificateId: string;
            category: string;
        };
    }) {
        const { templateImageDataUrl, width, height, fieldPositions, fieldValues, values } = args;

        const username = this.escapeHtml(fieldValues.username || values.userName);
        const certificateId = this.escapeHtml(fieldValues.certificateId || values.certificateId);
        const issueDate = this.escapeHtml(fieldValues.issueDate || values.issueDate);
        const validTill = this.escapeHtml(fieldValues.validTill || values.expiryDate);
        const category = this.escapeHtml(fieldValues.category || values.category || '');

        const styleText =
            "position:absolute;font-family:'Segoe UI',Arial,sans-serif;color:#111827;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;";

        const usernameDiv = fieldPositions.username
            ? `<div style="${styleText}left:${fieldPositions.username.x}px;top:${fieldPositions.username.y}px;width:520px;font-size:44px;text-align:center;">${username}</div>`
            : '';
        const certIdDiv = fieldPositions.certificateId
            ? `<div style="${styleText}left:${fieldPositions.certificateId.x}px;top:${fieldPositions.certificateId.y}px;width:360px;font-size:22px;text-align:left;">${certificateId}</div>`
            : '';
        const issueDateDiv = fieldPositions.issueDate
            ? `<div style="${styleText}left:${fieldPositions.issueDate.x}px;top:${fieldPositions.issueDate.y}px;width:260px;font-size:28px;text-align:left;">${issueDate}</div>`
            : '';
        const validTillDiv = fieldPositions.validTill
            ? `<div style="${styleText}left:${fieldPositions.validTill.x}px;top:${fieldPositions.validTill.y}px;width:260px;font-size:28px;text-align:left;">${validTill}</div>`
            : '';
        const categoryDiv = fieldPositions.category
            ? `<div style="${styleText}left:${fieldPositions.category.x}px;top:${fieldPositions.category.y}px;width:420px;font-size:28px;text-align:left;">${category}</div>`
            : '';

        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #ffffff; }
    .page {
      width: ${width}px;
      height: ${height}px;
      position: relative;
      background-image: url('${templateImageDataUrl}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <div class="page">
    ${usernameDiv}
    ${certIdDiv}
    ${issueDateDiv}
    ${validTillDiv}
    ${categoryDiv}
  </div>
</body>
</html>`;
    }

    private renderTemplate(template: string, values: Record<string, string>) {
        let result = template;
        for (const [key, value] of Object.entries(values)) {
            const token = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            result = result.replace(token, value);
        }

        if (values.adminNote && !result.includes(values.adminNote)) {
            result = result.replace(
                '</div>',
                `<p style="margin-top: 20px; text-align:center;">${values.adminNote}</p></div>`
            );
        }
        return result;
    }

    private async generatePdfDataUrlFromHtml(
        html: string,
        certificateName: string,
        renderWidth: number = 1536,
        renderHeight: number = 1021
    ): Promise<string> {
        try {
            const renderedBuffer = await this.renderHtmlToPdfBuffer(html, renderWidth, renderHeight);
            return `data:application/pdf;base64,${renderedBuffer.toString('base64')}`;
        } catch (error) {
            console.error('HTML->PDF renderer failed, falling back to text PDF:', error);
        }

        // Fallback: legacy text-only PDF (kept for resilience)
        const textBody = this.stripHtml(html).trim();
        const lines = [
            certificateName,
            '',
            ...textBody.split('\n').map((line) => line.trim()).filter(Boolean)
        ].slice(0, 45);

        const streamLines: string[] = [];
        let started = false;
        for (const line of lines) {
            const safe = this.escapePdfText(line);
            if (!started) {
                streamLines.push(`50 790 Td (${safe}) Tj`);
                started = true;
            } else {
                streamLines.push(`0 -16 Td (${safe}) Tj`);
            }
        }
        if (!streamLines.length) {
            streamLines.push(`50 790 Td (${this.escapePdfText(certificateName)}) Tj`);
        }

        const stream = `BT\n/F1 12 Tf\n${streamLines.join('\n')}\nET`;
        const fallbackBuffer = this.buildPdfBuffer(stream);
        return `data:application/pdf;base64,${fallbackBuffer.toString('base64')}`;
    }

    private async renderHtmlToPdfBuffer(html: string, renderWidth: number, renderHeight: number): Promise<Buffer> {
        const puppeteer = require('puppeteer-core');
        const executablePath = this.resolveChromeExecutablePath();
        const browser = await puppeteer.launch({
            headless: true,
            executablePath,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const page = await browser.newPage();
            await page.setViewport({ width: renderWidth, height: renderHeight, deviceScaleFactor: 2 });
            await page.setContent(html, { waitUntil: 'networkidle0' });
            const pdf = await page.pdf({
                width: `${renderWidth}px`,
                height: `${renderHeight}px`,
                printBackground: true,
                margin: { top: '0', right: '0', bottom: '0', left: '0' }
            });
            return Buffer.from(pdf);
        } finally {
            await browser.close();
        }
    }

    private resolveChromeExecutablePath(): string {
        const fs = require('fs');
        const path = require('path');

        const candidatePaths = [
            process.env.PUPPETEER_EXECUTABLE_PATH,
            process.env.CHROME_PATH,
            process.env.GOOGLE_CHROME_BIN,
            path.join(
                process.env.LOCALAPPDATA || '',
                'Google',
                'Chrome',
                'Application',
                'chrome.exe'
            ),
            path.join(
                process.env['PROGRAMFILES'] || '',
                'Google',
                'Chrome',
                'Application',
                'chrome.exe'
            ),
            path.join(
                process.env['PROGRAMFILES(X86)'] || '',
                'Google',
                'Chrome',
                'Application',
                'chrome.exe'
            ),
            path.join(
                process.env.USERPROFILE || '',
                '.cache',
                'puppeteer',
                'chrome-headless-shell',
                'win64-145.0.7632.67',
                'chrome-headless-shell-win64',
                'chrome-headless-shell.exe'
            ),
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium'
        ].filter(Boolean);

        for (const candidate of candidatePaths) {
            if (candidate && fs.existsSync(candidate)) {
                return candidate;
            }
        }

        throw new Error(
            'No Chrome executable found. Set CHROME_PATH or PUPPETEER_EXECUTABLE_PATH in environment.'
        );
    }

    private buildPdfBuffer(contentStream: string): Buffer {
        const object1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
        const object2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
        const object3 = '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n';
        const object4 = `4 0 obj\n<< /Length ${Buffer.byteLength(contentStream, 'utf8')} >>\nstream\n${contentStream}\nendstream\nendobj\n`;
        const object5 = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';

        const header = '%PDF-1.4\n';
        const objects = [object1, object2, object3, object4, object5];
        let body = '';
        const offsets: number[] = [0];
        let current = Buffer.byteLength(header, 'utf8');

        for (const object of objects) {
            offsets.push(current);
            body += object;
            current += Buffer.byteLength(object, 'utf8');
        }

        const xrefStart = current;
        let xref = `xref\n0 ${objects.length + 1}\n`;
        xref += '0000000000 65535 f \n';
        for (let i = 1; i < offsets.length; i++) {
            xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
        }

        const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
        return Buffer.from(header + body + xref + trailer, 'utf8');
    }

    private escapePdfText(value: string): string {
        return value
            .replace(/\\/g, '\\\\')
            .replace(/\(/g, '\\(')
            .replace(/\)/g, '\\)')
            .replace(/[^\x20-\x7E]/g, '');
    }

    private stripHtml(html: string): string {
        const withBreaks = html
            .replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li)>/gi, '\n')
            .replace(/<br\s*\/?>/gi, '\n');
        return withBreaks
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/\n{3,}/g, '\n\n');
    }

    private escapeHtml(value: string) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    private resolveResourceCategory(user: any): string {
        return (
            user?.profile?.resourceCategory ||
            user?.profile?.category ||
            ''
        );
    }
}
