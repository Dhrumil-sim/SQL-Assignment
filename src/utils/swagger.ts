import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API Docs',
      version: '1.0.0',
      description: 'Documentation for my project API',
    },
    servers: [
      {
        url: 'http://localhost:3000', // adjust if needed
      },
    ],
  },
  apis: ['src/routes/**/*.ts', 'src/controllers/**/*.ts'], // adjust paths to where JSDoc is written
};

export const swaggerSpec = swaggerJsdoc(options);
