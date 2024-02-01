import fastify, { FastifyInstance } from "fastify";
import { LinkUseCase } from "../usecases/link.usecase";
import { LinkCreate, LinkUpdate } from "../interface/link.interface";

export async function linkRoutes(fastify: FastifyInstance) {
  const linkUseCase = new LinkUseCase();

  fastify.post<{ Body: LinkCreate }>("/", async (req, reply) => {
    const { platform, url, userId } = req.body;
    try {
      const response = await linkUseCase.createLink({ platform, url, userId });

      return reply.send(response).status(201);
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.post<{ Body: LinkCreate[]; Params: { username: string } }>(
    "/save-all/user/:username",
    async (req, reply) => {
      const links = req.body;
      const { username } = req.params;
      try {
        const linksSaved = await linkUseCase.saveAllLinksByUsername(
          username,
          links
        );
        if (linksSaved.length <= 0)
          throw new Error("Error while saving Link(s)");
        return reply.send(linksSaved).status(201);
      } catch (error) {
        return reply.send({ message: error });
      }
    }
  );

  fastify.get<{ Params: { username: string } }>(
    "/:username",
    async (req, reply) => {
      const { username } = req.params;

      try {
        const response = await linkUseCase.getAllLinksByUsername(username);

        return reply.send(response).status(200);
      } catch (error) {
        return reply.send(error);
      }
    }
  );

  fastify.put<{ Body: LinkUpdate; Params: { linkId: string } }>(
    "/:linkId",
    async (req, reply) => {
      const { platform, url } = req.body;
      const { linkId } = req.params;

      try {
        const response = await linkUseCase.updateLink(linkId, {
          platform,
          url,
        });
        return reply.send(response);
      } catch (error) {
        return reply.send(error);
      }
    }
  );

  fastify.delete<{ Params: { linkId: string } }>(
    "/:linkId",
    async (req, reply) => {
      const { linkId } = req.params;
      try {
        const response = await linkUseCase.deleteLink(linkId);
        return reply.send(response);
      } catch (error) {
        return reply.send(error);
      }
    }
  );
  fastify.delete("/", async (req, reply) => {
    try {
      await linkUseCase.deleteAllLinks();
      return reply.send("All links deleted");
    } catch (error) {
      return reply.send(error);
    }
  });
}
