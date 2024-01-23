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

const linkCreate = z.object({
  platform: z.string(),
  url: z.string().url(),
  userId: z.string(),
});

export type Link = z.infer<typeof linkSchema>;
export type LinkCreate = z.infer<typeof linkCreate>;

export interface ILinkRepository {
  createLink(link: LinkCreate): Promise<Link>;
  getAllLinksByUsername(username: string): Promise<Link[]>;
  updateLink(linkId: string, updateFields: Partial<LinkCreate>): Promise<Link>;
  deleteLink(linkId: string): Promise<Link>;
}

export { linkSchema };
