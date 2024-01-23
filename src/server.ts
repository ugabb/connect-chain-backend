import { FastifyInstance, fastify } from "fastify";
import { userRoutes } from "./routes/user.route";
import { linkRoutes } from "./routes/link.route";

const app: FastifyInstance = fastify();

app.register(userRoutes, { prefix: "/api/users" });
app.register(linkRoutes, { prefix: "/api/links" });

app.listen({ port: 8080 }, (err) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log("Server running on port 8080");
});
