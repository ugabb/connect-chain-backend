import { prisma } from "../database/prisma-client";
import {
  ILinkRepository,
  Link,
  LinkCreate,
  LinkUpdate,
} from "../interface/link.interface";

export class LinkRepository implements ILinkRepository {
  async getLinkByPlatformAndUser(
    platform: string,
    userId: string
  ): Promise<Link | null> {
    const link = await prisma.link.findFirst({
      where: { userId, platform },
    });
    console.log("link", link);
    if (!link) console.error("Link doesn't exist");
    return link;
  }

  async createLink(link: LinkCreate): Promise<Link> {
    const createdLink = await prisma.link.create({
      data: {
        platform: link.platform,
        url: link.url,
        userId: link.userId,
      },
    });
    return createdLink;
  }

  async getAllLinksByUsername(username: string): Promise<Link[]> {
    const links = await prisma.link.findMany({
      where: {
        User: { username },
      },
    });

    return links;
  }
  async updateLink(
    linkId: string,
    updateFields: Partial<LinkUpdate>
  ): Promise<Link> {
    const updatedLink = await prisma.link.update({
      where: {
        id: linkId,
      },
      data: updateFields,
    });
    return updatedLink;
  }

  async deleteLink(linkId: string): Promise<Link> {
    const deletedLink = await prisma.link.delete({
      where: { id: linkId },
    });
    return deletedLink;
  }

  async deleteAllLinks(): Promise<void> {
    await prisma.link.deleteMany();
  }
}
