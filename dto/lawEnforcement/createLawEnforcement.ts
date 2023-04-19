import { CreateUserDto } from "../createUser";

export interface CreateLawEnforcementDto extends CreateUserDto{
    badgeNumber?: number;
    station?: string;
    isVerified?: boolean;
}
