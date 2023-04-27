export interface PutPermissionChangeDto {
    userId: string;
    authorizedBy: string;
    permissionFlags: number;
    action?: "granted" | "revoked";
}