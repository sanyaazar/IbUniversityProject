import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class AddSecretKeyDTO {
  @IsString()
  @IsNotEmpty()
  pcName: string;

  @IsUUID()
  @IsNotEmpty()
  WmicUUID: string;
}
