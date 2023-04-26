/**
 * userId - Is the user whose account is being changed
 * authorizedBy - Is the user who changes permissions on the other account
 */
export interface PutPermissionLogDto {
    userId: string;
    authorizedBy: string;
    permissionFlags: number;
    action: "granted" | "revoked";
}