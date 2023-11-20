import fastify, { FastifyInstance } from "fastify";
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import convfastify from "../src";

let app: FastifyInstance;

describe("App", () => {
  beforeEach(() => {
    app = fastify();
  });

  afterEach(() => {
    app.close();
  });

  test("should load routes from the specified path", async () => {
    app.register(
      convfastify().loadFrom(`${__dirname}/routes/**/*.js`).register()
    );

    const response = await app.inject({
      method: "GET",
      url: "/",
    });

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.payload)).toEqual({ message: "Hello World" });
  });

  test("should expose swagger interface", async () => {
    app.register(
      convfastify()
        .loadFrom(`${__dirname}/routes/**/*.js`)
        .serveSwagger()
        .register()
    );

    const response = await app.inject({
      method: "GET",
      url: "/docs",
    });

    expect(response.statusCode).toEqual(302);
    expect(response.headers.location).toEqual("./docs/static/index.html");
    expect(
      (
        await app.inject({
          method: "GET",
          url: "/",
        })
      ).body
    ).toEqual(JSON.stringify({ message: "Hello World" }));
  });

  test("should load files written with esm syntax", async () => {
    app.register(
      convfastify()
        .loadFrom(`${__dirname}/routes/**/*.mjs`)
        .serveSwagger()
        .register({
          esm: true,
        })
    );

    expect(
      (
        await app.inject({
          method: "GET",
          url: "/",
        })
      ).body
    ).toEqual(JSON.stringify({ message: "Hello World" }));
  });
});
