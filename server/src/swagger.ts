import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Real Estate API Documentation",
			version: "1.0.0",
			description: "API documentation for the Real Estate application",
		},
		servers: [
			{
				url:
					process.env.NODE_ENV === "production"
						? "https://your-production-domain.com"
						: `http://localhost:${process.env.PORT || 3002}`,
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: ["./src/routes/*.ts", "./src/index.ts"],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
