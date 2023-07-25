import { Role } from "../../common/middleware/common.permissionflag.enum";
import adminService from "../../service/admin";
import lawEnforcementService from "../../service/lawEnforcement";

/**
 * Returns user permission value, otherwise null
 * @param email 
 * @param role 
 * @returns 
 */
export async function extractUserPermission(email: string, role: Role) {
    let userPermission;
    if (!role) return null
    try {
        if (Role.ADMIN === role) {
            const admin = await adminService.getAdminByEmail(email);
            userPermission = admin?.permissionFlags;
            return userPermission ? userPermission : null;
        }
        if (role === Role.LAW_ENFORCEMENT) {
            const lawEnforcement: Record<string, any> = lawEnforcementService.getLawEnforcementByEmail(email);
            userPermission = lawEnforcement.permissionFlags;
            return userPermission ? userPermission : null;
        }
        if (role === Role.LOCAL) {
            return userPermission;
        }
        if (role === Role.GUEST) {
            return userPermission
        }
    } catch (error) {
        // if not found return null
        return null
    }


}