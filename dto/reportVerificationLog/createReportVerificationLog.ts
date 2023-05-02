export interface CreateReportVerificationLogDto {
    reportId: string;
    newVerifiedStatus: boolean;
    reason?: string;
    authorizedBy: string;
}