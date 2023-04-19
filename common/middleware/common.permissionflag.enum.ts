export enum PermissionFlag {
    FREE_PERMISSION = 1,
    PAID_PERMISSION = 2,
    ANOTHER_PAID_PERMISSION = 4,
    ADMIN_PERMISSION = 8,
    ADMIN_PERMISSION_NOT_ALL_PERMISSIONS = 7,
    LAW_ENFORCEMENT_ADMIN_PERMISSION = 5,
    LAW_ENFORCEMENT_PERMISSIONS = 3,
    ALL_PERMISSIONS = 2147483647,
}

export enum Crimes {
    DEFAULT = "n/a",
    COMPUTERCRIME = "computer crime",
    ROBBERY = "robbery",
    ARSON = "arson",
    KIDNAPPING = "kidnapping",
    HOMICIDE = "homicide",
    EMBEZZLEMENT = "embezzlement",
    THEFT = "theft",
    BRIBERY = "bribery",
    BURGLARY = "burglary",
    OTHER = "other"
}

export const CrimesList = [
    "n/a",
    "computer crime",
    "robbery",
    "arson",
    "kidnapping",
    "homicide",
    "embezzlement",
    "theft",
    "bribery",
    "burglary",
    "other"
]

