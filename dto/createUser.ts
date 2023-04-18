export interface CreateUserDto {
    email: string;
    password: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    permissionFlags?: number;
}
