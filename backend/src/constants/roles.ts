export const USER_ROLES = {
    EMPLOYEE: 'employee',
    EMPLOYER: 'employer',
    RESOURCE: 'resource'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const ROLE_PERMISSIONS = {
    [USER_ROLES.EMPLOYEE]: [
        'apply_to_jobs',
        'view_jobs',
        'manage_profile',
        'upload_cv',
        'view_applications'
    ],
    [USER_ROLES.EMPLOYER]: [
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
