import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { UserUseCase } from "../usecases/user.usecase";
import { User, UserCreate, UserLogin } from "../interface/user.interface";
import { authenticate } from "../server";
import { FastifyJWT } from "@fastify/jwt";

export async function userRoutes(fastify: FastifyInstance) {
  const userUseCase = new UserUseCase();

  fastify.post<{ Body: UserLogin }>(
    "/login",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const user = req.body;
      try {
        const payload = await userUseCase.login(user);

        const token = req.jwt.sign(payload);

        reply.setCookie("access_token", token, {
          path: "/",
          httpOnly: true,
          secure: true,
        });

        reply.send({ accessToken: token }).status(200);
      } catch (error) {
        reply.send(error);
      }
    }
  );

  fastify.post<{ Body: UserCreate }>("/sign-up", async (req, reply) => {
    const user = req.body;
    try {
      const response = await userUseCase.createUser(user);

      reply.send(response).status(201);
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.get(
    "/",
    { preHandler: async () => authenticate },
    async (req, reply) => {
      try {
        const response = await userUseCase.listUsers();
        reply.send(response).status(200);
      } catch (error) {
        reply.send(error);
      }
    }
  );

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
