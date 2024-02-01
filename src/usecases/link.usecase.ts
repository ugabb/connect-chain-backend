import { prisma } from "../database/prisma-client";
import { Link, LinkCreate, LinkUpdate } from "../interface/link.interface";
import { LinkRepository } from "../repositories/link.repository";
import { UserRepository } from "../repositories/user.repository";

export class LinkUseCase {
  private linkRepository: LinkRepository;
  private userRepository: UserRepository;

  constructor() {
    this.linkRepository = new LinkRepository();
    this.userRepository = new UserRepository();
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

  async saveAllLinksByUsername(
    username: string,
    links: LinkCreate[]
  ): Promise<Link[]> {
    try {
      // Verify if user exists
      const userExist = await this.userRepository.getUserByUsername(username);
      if (!userExist) {
        throw new Error("User doesn't exist");
      }

      const updatedLinks: Link[] = [];

      // For each link, check if already exists; if it does, update; if not, create
      for (let link of links) {
        try {
          const existingLink =
            await this.linkRepository.getLinkByPlatformAndUser(
              link.platform,
              link.userId
            );

          if (existingLink?.id) {
            // Update existing link
            const updatedLink = await this.linkRepository.updateLink(
              existingLink.id,
              link
            );
            updatedLinks.push(updatedLink);
          } else {
            // Create new link
            const createdLink = await this.linkRepository.createLink(link);
            updatedLinks.push(createdLink);
          }
        } catch (error) {
          console.error("Error processing link:", error);
        }
      }

      return updatedLinks;
    } catch (error) {
      console.error("Error processing links for user:", error);
      throw error; // Re-throw the error for external handling
    }
  }

  async getAllLinksByUsername(username: string): Promise<Link[]> {
    // verify if the user have links
    const links = await this.linkRepository.getAllLinksByUsername(username);
    if (links.length <= 0) throw new Error("User don't have links");

    return links;
  }

  async updateLink(
    linkId: string,
    updateFields: Partial<LinkUpdate>
  ): Promise<Link> {
    const linkExist = await prisma.link.findFirst({
      where: { id: linkId },
    });
    if (!linkExist) throw new Error("Link does not exist");

    const updatedLink = await this.linkRepository.updateLink(
      linkId,
      updateFields
    );
    return updatedLink;
  }

  async deleteLink(linkId: string): Promise<Link> {
    const linkExist = await prisma.link.findFirst({
      where: { id: linkId },
    });
    if (!linkExist) throw new Error("Link does not exist");

    const deletedLink = await this.linkRepository.deleteLink(linkId);
    return deletedLink;
  }
  async deleteAllLinks(): Promise<void> {
    await this.linkRepository.deleteAllLinks();
  }
}
