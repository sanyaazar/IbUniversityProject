import { RightType } from '@prisma/client';

export class GetFileWithRightsResponseDTO {
  decryptedContent: string;
  rights: RightType;
  hashMismatch: boolean;
  userMismatch: boolean;
}
