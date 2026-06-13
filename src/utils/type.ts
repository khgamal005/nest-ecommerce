import { UserRole } from './enums';

export type JwtPayload = {
  id: number;
  email: string;
  role: UserRole;
};
