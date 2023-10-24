# convfastify

Conventionally load your routes to your fastify application.

- Typesafe route definition
- Pre configured swagger

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

Register the plugin and load routes

```ts
import fastify from "fastify";
import convfastify from "convfastify";

const app = fastify();

app.register(
  convfastify()
    // Load routes
    .loadFrom(`${__dirname}/routes/**/*`)
    // Serving swagger
    .serveSwagger()
    // Register the plugin
    .register()
);

app.listen({
  port: 8080,
});
```

On the files under the `/routes`

```ts
import { route } from "convfastify";

export default route({
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
