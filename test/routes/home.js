module.exports.default = {
  url: "/",
  method: "GET",
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          message: {
            type: "string",
          },
        },
      },
    },
  },
  handler: (_, res) => {
    res.send({ message: "Hello World" });
  },
};
