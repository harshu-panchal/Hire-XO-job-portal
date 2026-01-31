export const USER_ROLES = {
    JOB_SEEKER: 'job-seeker',
    RECRUITER: 'recruiter',
    RESOURCE: 'resource'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const ROLE_PERMISSIONS = {
    [USER_ROLES.JOB_SEEKER]: [
        'apply_to_jobs',
        'view_jobs',
        'manage_profile',
        'upload_cv',
        'view_applications'
    ],
    [USER_ROLES.RECRUITER]: [
        'post_jobs',
        'view_jobs',
        'manage_profile',
        'view_applications',
        'manage_applications',
        'upload_company_logo'
    ],
    [USER_ROLES.RESOURCE]: [
        'post_resources',
        'view_resources',
        'manage_profile',
        'view_applications',
        'manage_applications'
    ]
};
