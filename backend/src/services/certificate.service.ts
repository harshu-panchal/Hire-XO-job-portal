import Certificate from '../models/certificate.model';

export class CertificateService {
    // Create a new certificate
    public async createCertificate(
        userId: string,
        name: string,
        issueDate: Date,
        expiryDate: Date,
        successRate: number
    ) {
        if (successRate < 0 || successRate > 100) {
            throw new Error('Success rate must be between 0 and 100');
        }

        if (new Date(expiryDate) <= new Date(issueDate)) {
            throw new Error('Expiry date must be after issue date');
        }

        const status = new Date() < new Date(expiryDate) ? 'Active' : 'Expired';

        const certificate = await Certificate.create({
            userId,
            name,
            issueDate,
            expiryDate,
            successRate,
            status
        });

        return certificate;
    }

    // Get all certificates for a user
    public async getUserCertificates(userId: string) {
        const certificates = await Certificate.find({ userId }).sort({ issueDate: -1 });

        // Update status for all certificates
        for (const cert of certificates) {
            const currentStatus = new Date() < cert.expiryDate ? 'Active' : 'Expired';
            if (cert.status !== currentStatus) {
                cert.status = currentStatus;
                await cert.save();
            }
        }

        return certificates;
    }

    // Get active certificates only
    public async getActiveCertificates(userId: string) {
        const certificates = await Certificate.find({
            userId,
            expiryDate: { $gt: new Date() }
        }).sort({ issueDate: -1 });

        return certificates;
    }

    // Get a specific certificate
    public async getCertificateById(certificateId: string, userId: string) {
        const certificate = await Certificate.findOne({ _id: certificateId, userId });

        if (!certificate) {
            throw new Error('Certificate not found');
        }

        // Update status if needed
        const currentStatus = new Date() < certificate.expiryDate ? 'Active' : 'Expired';
        if (certificate.status !== currentStatus) {
            certificate.status = currentStatus;
            await certificate.save();
        }

        return certificate;
    }

    // Update a certificate
    public async updateCertificate(
        certificateId: string,
        userId: string,
        updates: {
            name?: string;
            issueDate?: Date;
            expiryDate?: Date;
            successRate?: number;
        }
    ) {
        const certificate = await Certificate.findOne({ _id: certificateId, userId });

        if (!certificate) {
            throw new Error('Certificate not found');
        }

        if (updates.successRate !== undefined && (updates.successRate < 0 || updates.successRate > 100)) {
            throw new Error('Success rate must be between 0 and 100');
        }

        if (updates.name) certificate.name = updates.name;
        if (updates.issueDate) certificate.issueDate = updates.issueDate;
        if (updates.expiryDate) certificate.expiryDate = updates.expiryDate;
        if (updates.successRate !== undefined) certificate.successRate = updates.successRate;

        // Update status based on new expiry date
        certificate.status = new Date() < certificate.expiryDate ? 'Active' : 'Expired';

        await certificate.save();
        return certificate;
    }

    // Delete a certificate
    public async deleteCertificate(certificateId: string, userId: string) {
        const certificate = await Certificate.findOneAndDelete({ _id: certificateId, userId });

        if (!certificate) {
            throw new Error('Certificate not found');
        }

        return { message: 'Certificate deleted successfully' };
    }
}
