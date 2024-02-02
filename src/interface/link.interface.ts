import { z } from "zod";

export interface IUser {
  id: string;
}

const linkSchema = z.object({
  id: z.string().uuid().nullable(),
  platform: z.string(),
  url: z.string().url(),
  color: z.string(),
  iconName: z.string(),
  userId: z.string(),
});

const linkCreate = z.object({
  platform: z.string(),
  url: z.string().url(),
  color: z.string(),
  iconName: z.string(),
  userId: z.string(),
});

const linkUpdate = z.object({
  platform: z.string(),
  url: z.string().url(),
});

export type Link = z.infer<typeof linkSchema>;
export type LinkCreate = z.infer<typeof linkCreate>;
export type LinkUpdate = z.infer<typeof linkUpdate>;

export interface ILinkRepository {
  createLink(link: LinkCreate): Promise<Link>;
  getAllLinksByUsername(username: string): Promise<Link[]>;
  getLinkByPlatformAndUser(
    platform: string,
    userId: string
  ): Promise<Link | null>;
  updateLink(linkId: string, updateFields: Partial<LinkCreate>): Promise<Link>;
  deleteLink(linkId: string): Promise<Link>;
  deleteAllLinks(): Promise<void>;
}

export { linkSchema };
