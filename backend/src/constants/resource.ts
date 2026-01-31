export const RESOURCE_TYPES = {
    INVESTOR: 'Investor',
    TENDER: 'Tender',
    EQUIPMENT: 'Equipment',
    MACHINERY: 'Machinery',
    PMC: 'PMC',
    CSM: 'CSM',
    LOGISTICS: 'Logistics',
    VEHICLE: 'Vehicle'
} as const;

export type ResourceType = typeof RESOURCE_TYPES[keyof typeof RESOURCE_TYPES];

export const RESOURCE_CATEGORIES = Object.values(RESOURCE_TYPES);

export const RESOURCE_SUB_TYPES = {
    INVESTOR: ['want-to-invest', 'want-investment'],
    TENDER: ['provide-tenders', 'apply-for-tenders'],
    EQUIPMENT: ['rent-out-equipment', 'rent-equipment'],
    MACHINERY: ['provide-machinery', 'need-machinery'],
    PMC: ['offer-pmc-services', 'hire-pmc'],
    CSM: ['offer-csm-services', 'hire-csm'],
    LOGISTICS: ['provide-logistics', 'need-logistics'],
    VEHICLE: ['rent-out-vehicles', 'rent-vehicles']
} as const;

export const LISTING_TYPES = {
    CONTRACT: 'Contract',
    TEMPORARY: 'Temporary',
    PROJECT_BASED: 'Project-based',
    RENTAL: 'Rental'
} as const;

export const URGENCY_LEVELS = {
    IMMEDIATE: 'Immediate',
    WITHIN_WEEK: 'Within Week',
    FLEXIBLE: 'Flexible'
} as const;
