import fastifySwagger from "@fastify/swagger";
import { ExtractSecondParam } from "./types";
import fastifySwaggerUi from "@fastify/swagger-ui";

export const swaggerConfig: ExtractSecondParam<typeof fastifySwagger> = {
  openapi: {
    info: {
      title: "OpenAPI definition",
      version: "v0",
    },
  },
};

export const swaggerUiConfig: ExtractSecondParam<typeof fastifySwaggerUi> = {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  staticCSP: true,
  transformSpecificationClone: true,
};
