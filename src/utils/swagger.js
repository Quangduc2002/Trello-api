import swaggerJsdoc from "swagger-jsdoc";
import express from "express";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Trello",
      version: "1.0.0",
      description: "Trello swagger API documentation",
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Định nghĩa các file chứa API (cần tạo thư mục routes)
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

function swaggerDocs(app) {
  // swagger page
  app.use("/trello-api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("docs.json", (req, res) => {
    res.json({ message: "Hello World!" });
    res.send(swaggerSpec);
  });
}

export default swaggerDocs;
