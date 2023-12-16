const swaggerOptions = {
  definition: {
    info: {
      title: "E-CMMERCE",
      version: "1.0.0",
      description: "API documentation ...",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Local Server",
      },
    ],
  },
  security: [{ Bearer: [] }],
  apis: ["./src/docs/routes/*.yaml"],
}
export default swaggerOptions
