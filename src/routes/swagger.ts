import express from 'express'
import swaggerUi from 'swagger-ui-express'
import specs from '../swaggerConfig' // Import the Swagger configuration

const router = express.Router()

router.use('/', swaggerUi.serve)
router.get('/', swaggerUi.setup(specs))

export default router
