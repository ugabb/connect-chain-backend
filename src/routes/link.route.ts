import fastify, { FastifyInstance } from "fastify";
import { LinkUseCase } from "../usecases/link.usecase";
import { LinkCreate } from "../interface/link.interface";

export async function linkRoutes(fastify: FastifyInstance) {
  const linkUseCase = new LinkUseCase();

  fastify.post<{ Body: LinkCreate }>("/", async (req, reply) => {
    const { platform, url, userId } = req.body;
    try {
      const response = await linkUseCase.createLink({ platform, url, userId });

      return reply.send({
        message: "Link created successfully",
        link: response,
      });
    } catch (error) {
      reply.send(error);
    }
  });
}
