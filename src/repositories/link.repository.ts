import { prisma } from "../database/prisma-client";
import {
  ILinkRepository,
  Link,
  LinkCreate,
  LinkUpdate,
} from "../interface/link.interface";

export class LinkRepository implements ILinkRepository {
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
}
