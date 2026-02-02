import { UserRole } from "@prisma/client";

export type User = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  image?: string | null;
};
