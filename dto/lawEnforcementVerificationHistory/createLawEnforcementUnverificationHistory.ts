export interface CreateLawEnforcementUnverificationHistoryDto {
    officerId: string;
    // status: Boolean;
    type: string;
    reason?: string;
    authorizedBy: string;
}
