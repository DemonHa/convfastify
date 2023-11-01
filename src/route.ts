import type { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
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

const route = <
  TypeProvider extends FastifyTypeProvider = JsonSchemaToTsProvider,
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  ContextConfig = ContextConfigDefault,
  const SchemaCompiler extends FastifySchema = FastifySchema
>(
  routeDefinition: RouteOptions<
    RawServerDefault,
    RawRequestDefaultExpression,
    RawReplyDefaultExpression,
    RouteGeneric,
    ContextConfig,
    SchemaCompiler,
    TypeProvider
  >
) => routeDefinition;

export default route;
