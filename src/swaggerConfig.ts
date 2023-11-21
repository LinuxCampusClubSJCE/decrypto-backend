import swaggerJsdoc from 'swagger-jsdoc'

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API',
            version: '1.0.0',
            description: 'API documentation using Swagger'
        },
        servers: [
            {
                url: 'http://localhost:3000', // Replace with your server URL
                description: 'Local server'
            }
        ]
    },
    apis: ['./src/routes/*.ts'] // Replace with your route files path
}

const specs = swaggerJsdoc(options)

export default specs
