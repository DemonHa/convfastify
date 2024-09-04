import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import {
  ContextConfigDefault,
  FastifySchema,
  FastifyTypeProvider,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteGenericInterface,
  RouteOptions,
} from "fastify";

interface RouteDefinition<
  T extends FastifyTypeProvider = JsonSchemaToTsProvider
> {
  define: <const SchemaCompiler extends FastifySchema = FastifySchema>(
    route: RouteOptions<
      RawServerDefault,
      RawRequestDefaultExpression,
      RawReplyDefaultExpression,
      RouteGenericInterface,
      ContextConfigDefault,
      SchemaCompiler,
      T
    >
  ) => typeof route;
  withType: <
    TNew extends FastifyTypeProvider = FastifyTypeProvider
  >() => RouteDefinition<TNew>;
}

const route: RouteDefinition = {
  withType<T extends FastifyTypeProvider = FastifyTypeProvider>() {
    return this as unknown as RouteDefinition<T>;
  },
  define: (routeDefinition) => {
    return routeDefinition;
  },
};

export default route;
