import AuditLog from '../models/audit-log.model';

export class AuditService {
    /**
     * Log an administrative action
     */
    public static async logAction(
        adminId: string,
        action: string,
        targetType: string,
        targetId?: string,
        metadata?: any
    ) {
        try {
            await AuditLog.create({
                adminId,
                action,
                targetType,
                targetId,
                metadata,
                timestamp: new Date()
            });
        } catch (error) {
            // We do NOT block the main action if logging fails, 
            // but we do log the failure to server console.
            console.error('[AuditService] Failed to create audit log:', error);
        }
    }
}
