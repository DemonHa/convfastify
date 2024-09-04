# convfastify

[![NPM Version](https://img.shields.io/npm/v/convfastify.svg?style=flat)]()
[![NPM License](https://img.shields.io/npm/l/all-contributors.svg?style=flat)](https://github.com/DemonHa/convfastify/blob/main/LICENSE)
[![npm downloads](https://img.shields.io/npm/dt/convfastify.svg)](https://www.npmjs.com/package/convfastify)
![test workflow](https://github.com/DemonHa/convfastify/actions/workflows/test.yml/badge.svg)

_convfastify_ is a plugin for the [Fastify](http://fastify.io/) framework that provides a conventional way of declaring routes.

Features:

- Autoload routes
- Typesafe route definition
- Preconfigured swagger

# Installation

For npm users:

```bash
npm i convfastify
```

For yarn users:

```bash
yarn add convfastify
```

# Quick Start

Register the plugin and load routes:

```js
const fastify = require("fastify");
const { default: convfastify } = require("convfastify");

const app = fastify({
  logger: true,
});

app.register(
  convfastify()
    .loadFrom(`${__dirname}/routes/**/*.js`)
    .serveSwagger()
    .register()
);

app.listen({
  port: 8080,
});
```

On the files under the `/routes` directory:

```js
const { route } = require("convfastify");

module.exports.default = route.define({
  method: "GET",
  url: "/",
  schema: {
    querystring: {
      type: "object",
      properties: {
        foo: { type: "number" },
        bar: { type: "string" },
      },
      required: ["foo", "bar"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
  handler: (_, res) => {
    res.send({ message: "Hello World" });
  },
});
```

It will load the routes defined in the `routes` directory and serve swagger.

## ESM module example

Register the plugin and load routes:

```js
import fastify from "fastify";
import convfastify from "convfastify";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = fastify({
  logger: true,
});

app.register(
  convfastify
    .default()
    .loadFrom(`${__dirname}/routes/**/*.js`)
    .serveSwagger()
    .register({ esm: true })
);

app.listen({
  port: 8080,
});
```

On the files under the `/routes` directory:

```js
import { route } from "convfastify";

export default route.define({
  method: "GET",
  url: "/",
  schema: {
    querystring: {
      type: "object",
      properties: {
        foo: { type: "number" },
        bar: { type: "string" },
      },
      required: ["foo", "bar"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
  handler: (_, res) => {
    res.send({ message: "Hello World" });
  },
});
```

It will load the routes defined in the `routes` directory and serve swagger.

## Typescript example

Register the plugin and load routes:

```ts
import fastify from "fastify";
import convfastify from "convfastify";

const app = fastify({
  logger: true,
});

app.register(
  convfastify()
    // Load routes
    .loadFrom(`${__dirname}/routes/**/*.js`)
    // Serving swagger
    .serveSwagger()
    // Register the plugin
    .register()
);

app.listen({
  port: 8080,
});
```

On the files under the `/routes` directory:

```ts
import { route } from "convfastify";

export default route.define({
  method: "GET",
  url: "/",
  schema: {
    querystring: {
      type: "object",
      properties: {
        foo: { type: "number" },
        bar: { type: "string" },
      },
      required: ["foo", "bar"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
  handler: (req, res) => {
    res.send({ message: "Hello World" });
  },
});
```

It will load the routes defined in the `routes` directory and serve swagger.

### Using different type provider

By default when you define routes, it is preconfigured to infer types using `json-schema-to-ts`, but you can use a different type provider.

Example:

```ts
import { route } from "convfastify";
import { TypeBoxTypeProvider, Type } from "@fastify/type-provider-typebox";

export default route.withType<TypeBoxTypeProvider>().define({
  url: "/",
  method: "GET",
  schema: {
    querystring: Type.Object({
      name: Type.String(),
    }),
    response: {
      200: Type.Object({
        name: Type.String(),
      }),
    },
  },
  handler: (req, res) => {
    res.send({ name: req.query.name });
  },
});
```

# V2 Migration Guide

This guide is intended to help with migration from convfastify v1 to v2.

## Braking changes

### `route` is an object

To support different type providers, `route` is not a function you can call directly but an object.

To migrate it with minimal effort:

- Create a file `src/route.ts`

```ts
import { route as convroute } from "convfastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

// NOTE: in this example we are using `TypeBoxTypeProvider` but you can use any provider
export const route = convroute.withType<TypeBoxTypeProvider>().define;
```

Now you can import `route` from the `/src/route.ts` instead of `convfastify` directly on all of your routes

# API

### `convfastify().loadFrom(path)`

This method allows loading routes from a specified path or [glob pattern](https://github.com/isaacs/node-glob).

### `convfastify().serveSwagger(config)`

This method allows serving swagger for the loaded routes. It accepts configuration for [`swagger`](https://github.com/fastify/fastify-swagger#register-options) and [`swaggerUi`](https://github.com/fastify/fastify-swagger-ui#register-options).

### `convfastify().register(config)`

This method allows you to register the plugin to your fastify application.

It accepts configuration object for the plugin.

#### config

- `esm`: set it to true if you are using esm module resolution
