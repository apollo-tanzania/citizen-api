import { PutUserDto } from './putUser';

export interface PatchUserDto extends Partial<PutUserDto> {}
