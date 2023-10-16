import fp from "fastify-plugin";
import { glob } from "glob";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifySwagger from "@fastify/swagger";
import { ExtractSecondParam } from "./types";

import { swaggerConfig, swaggerUiConfig } from "./default-config";

const convfastify = fp<
  { pattern: string } & {
    swagger?: ExtractSecondParam<typeof fastifySwagger>;
  } & { swaggerUi?: ExtractSecondParam<typeof fastifySwaggerUi> }
>(
  async (fastify, opt) => {
    // Check for patter to load routes
    if (!opt.pattern) throw "Please specify a pattern to load files";
    const routePaths = glob.sync(opt.pattern, { absolute: true });

    // Register swagger
    fastify.register(fastifySwagger, { ...swaggerConfig, ...opt.swagger });
    fastify.register(fastifySwaggerUi, {
      ...swaggerUiConfig,
      ...opt.swaggerUi,
    });

    // Register routes
    fastify.register(async (fastify) => {
      for (const routePath of routePaths) {
        const route = require(routePath);
        fastify.route(route.default);
      }
    });
  },
  {
    fastify: "4.x",
    name: "convfastify",
  }
);

export default convfastify;
