export interface PutReportVerificationLogDto {
    reportId: string;
    newVerifiedStatus: boolean;
    reason?: string;
    authorizedBy: string;
}