import { IsNotEmpty, IsString } from 'class-validator';

export class AddSecretKeyDbDTO {
  @IsString()
  @IsNotEmpty()
  pcName: string;

  @IsString()
  @IsNotEmpty()
  WmicUUID: string;
}
