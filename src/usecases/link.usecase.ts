import { prisma } from "../database/prisma-client";
import { Link, LinkCreate } from "../interface/link.interface";
import { LinkRepository } from "../repositories/link.repository";

export class LinkUseCase {
  private linkRepository: LinkRepository;

  constructor() {
    this.linkRepository = new LinkRepository();
  }

  async createLink(link: LinkCreate): Promise<Link> {
    // verify if link from some platform already exist
    const platformExist = await prisma.link.findFirst({
      where: {
        platform: link.platform,
      },
    });
    if (platformExist) throw new Error("Link to this platform already exist!");

    const linkCreated = await this.linkRepository.createLink(link);
    return linkCreated;
  }
}
