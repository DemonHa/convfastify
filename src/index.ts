import fp from "fastify-plugin";
import { glob } from "glob";

const convfastify = fp(
  async (fastify, opt) => {
    const options = opt as Partial<{ pattern: string }>;
    if (!options.pattern) throw "Please specify a pattern to load files";
    const routePaths = glob.sync(options.pattern, { absolute: true });

    for (const routePath of routePaths) {
      const route = require(routePath);
      fastify.route(route.default);
    }
  },
  {
    fastify: "4.x",
    name: "convfastify",
  }
);

export default convfastify;
