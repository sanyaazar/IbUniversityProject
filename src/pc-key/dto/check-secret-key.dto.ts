import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CheckSecretKeyDTO {
  @IsUUID()
  @IsNotEmpty()
  WmicUUID: string;
}
