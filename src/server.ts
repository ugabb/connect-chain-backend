import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  fastify,
} from "fastify";
import { userRoutes } from "./routes/user.route";
import { linkRoutes } from "./routes/link.route";

// jwt
import fjwt, { FastifyJWT } from "@fastify/jwt";
// cookies
import fCookie from "@fastify/cookie";

const app: FastifyInstance = fastify();

// pre handler
app.register(fjwt, {
  secret: "SUper-secret-code-that-should-be-in-dotenv-file",
});

export const authenticate = app.decorate(
  "authenticate",
  async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.cookies.access_token;

    if (!token) {
      return reply.status(401).send({ message: "Authentication required" });
    }
    const decoded = req.jwt.verify<FastifyJWT["user"]>(token);
    req.user = decoded;
  }
);

app.addHook("preHandler", (req, res, next) => {
  req.jwt = app.jwt;
  return next();
});

// cookies
app.register(fCookie, {
  secret: "SUper-secret-code-that-should-be-in-dotenv-FILE",
  hook: "preHandler",
});

app.register(userRoutes, { prefix: "/api/users" });
app.register(linkRoutes, { prefix: "/api/links" });

app.listen({ port: 8080 }, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log("Server running on port 8080");
});
