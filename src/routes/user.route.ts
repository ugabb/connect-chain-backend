import { FastifyInstance } from "fastify";
import { UserUseCase } from "../usecases/user.usecase";
import { User, UserCreate } from "../interface/user.interface";

export async function userRoutes(fastify: FastifyInstance) {
  const userUseCase = new UserUseCase();

  fastify.post<{ Body: UserCreate }>("/sign-up", async (req, reply) => {
    const user = req.body;
    try {
      const response = await userUseCase.createUser(user);

      reply.send(response).status(201);
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.get("/", async (req, reply) => {
    try {
      const response = await userUseCase.listUsers();
      reply.send(response).status(200);
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.get<{ Params: { username: string } }>(
    "/:username",
    async (req, reply) => {
      const { username } = req.params;
      try {
        const response = await userUseCase.getUserByUsername(username);
        reply.send(response).status(200);
      } catch (error) {
        reply.send(error);
      }
    }
  );

  fastify.put<{ Body: UserCreate; Params: { userId: string } }>(
    "/:userId",
    async (req, reply) => {
      const user = req.body;
      const { userId } = req.params;

      try {
        const response = await userUseCase.updateUser(userId, user);
        reply.send(response).status(200);
      } catch (error) {
        reply.send(error);
      }
    }
  );

  fastify.delete<{ Params: { username: string } }>(
    "/:username",
    async (req, reply) => {
      const { username } = req.params;

      try {
        const response = await userUseCase.deleteUser(username);

        reply
          .send({
            response,
            message: "User successfully deleted",
          })
          .status(200);
      } catch (error) {
        reply.send(error);
      }
    }
  );
}
