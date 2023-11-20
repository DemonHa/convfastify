import type fastifySwagger from "@fastify/swagger";
import type fastifySwaggerUi from "@fastify/swagger-ui";

export type ConvTypes = {
  path?: string;
  swagger: boolean;
  swaggerConfigs: ExtractSecondParam<typeof fastifySwagger>;
  swaggerUiConfigs: ExtractSecondParam<typeof fastifySwaggerUi>;
};

export type ExtractSecondParam<T> = T extends (...args: infer A) => any
  ? A[1]
  : never;
