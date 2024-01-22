import { z } from "zod";

export interface IUser {
  id: string;
}

const linkSchema = z.object({
  id: z.string().uuid().nullable(),
  platform: z.string(),
  url: z.string().url(),
  userId: z.string(),
});

export { linkSchema };
