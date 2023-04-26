import { CreateLawEnforcementVerificationHistoryDto } from "./createLawEnforcementVerificationHistory";

export interface CreateLawEnforcementUnverificationHistoryDto extends CreateLawEnforcementVerificationHistoryDto {
    type: string;
    reason: string;
}