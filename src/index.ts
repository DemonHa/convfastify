import fp from "fastify-plugin";
import { glob } from "glob";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifySwagger from "@fastify/swagger";

const convfastify = fp<{ pattern: string }>(
  async (fastify, opt) => {
    if (!opt.pattern) throw "Please specify a pattern to load files";
    const routePaths = glob.sync(opt.pattern, { absolute: true });

    fastify.register(fastifySwagger, {
      openapi: {
        info: {
          title: "Open API",
          description: "Open API Documentation",
          version: "1.0.0",
        },
        servers: [
          {
            url: "http://localhost",
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
            },
          },
        },
      },
    });

    fastify.register(fastifySwaggerUi, {
      routePrefix: "/docs",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
      uiHooks: {
        onRequest: function (_request, _reply, next) {
          next();
        },
        preHandler: function (_request, _reply, next) {
          next();
        },
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject) => {
        return swaggerObject;
      },
      transformSpecificationClone: true,
    });

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
