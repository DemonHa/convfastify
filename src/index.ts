import fp from "fastify-plugin";
import { glob } from "glob";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifySwagger from "@fastify/swagger";

import { swaggerConfig, swaggerUiConfig } from "./default-config";
import route from "./route";

import type { ConvTypes } from "./types";

const convfastify = () => {
  const options: ConvTypes = {
    path: undefined,
    swagger: false,
    swaggerConfigs: swaggerConfig,
    swaggerUiConfigs: swaggerUiConfig,
  };

  return {
    serveSwagger: function (
      this,
      config?: {
        swagger?: ConvTypes["swaggerConfigs"];
        swaggerUi?: ConvTypes["swaggerUiConfigs"];
      }
    ): typeof this {
      options.swagger = true;
      options.swaggerConfigs = {
        ...options.swaggerConfigs,
        ...config?.swagger,
      };
      options.swaggerUiConfigs = {
        ...options.swaggerUiConfigs,
        ...config?.swaggerUi,
      };
      return this;
    },
    loadFrom: function (this, path: string): typeof this {
      options.path = path;
      return this;
    },
    register: (pluginConfig?: { esm?: boolean }) => {
      return fp(
        async (fastify) => {
          if (options.swagger) {
            // Register swagger
            fastify.register(fastifySwagger, options.swaggerConfigs);
            fastify.register(fastifySwaggerUi, options.swaggerUiConfigs);
          }

          if (options.path != undefined) {
            const routePaths = glob.sync(options.path, { absolute: true });

            // Register routes
            fastify.register(async (fastify) => {
              for (const routePath of routePaths) {
                const route = pluginConfig?.esm
                  ? await import(routePath)
                  : require(routePath);
                fastify.route(route.default);
              }
            });
          }
        },
        {
          fastify: "4.x",
          name: "convfastify",
        }
      );
    },
  };
};

export default convfastify;
export { route };
