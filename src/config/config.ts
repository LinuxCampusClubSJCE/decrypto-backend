import dotenv from 'dotenv'

dotenv.config()

interface EnvVariables {
    MONGODB_URI: string
    PORT: number
    JWT_SECRET: string
    ADMIN_USERNAME: string
    ADMIN_PASSWORD: string
    ADMIN_EMAIL: string
    ADMIN_FULLNAME: string
    ADMIN_USN: string
    ALLOW_QUESTION_UPDATE: boolean
    ALLOW_USER_REGISTRATION: boolean
    ADMIN_PHONE: string
}

declare let process: {
    env: {
        MONGODB_URI: string
        PORT: number
        JWT_SECRET: string
        ADMIN_USERNAME: string
        ADMIN_PASSWORD: string
        ADMIN_EMAIL: string
        ADMIN_FULLNAME: string
        ADMIN_USN: string
        ALLOW_QUESTION_UPDATE: string
        ALLOW_USER_REGISTRATION: string
        ADMIN_PHONE: string
    }
}
const envVariables: EnvVariables = {
    MONGODB_URI:
        process.env.MONGODB_URI.length > 0
            ? process.env.MONGODB_URI
            : 'mongodb://localhost:27017/decrypto',
    PORT: process.env.PORT !== 0 ? process.env.PORT : 3000,
    JWT_SECRET:
        process.env.JWT_SECRET !== '' ? process.env.JWT_SECRET : 'secret',
    ADMIN_USERNAME:
        process.env.ADMIN_USERNAME !== ''
            ? process.env.ADMIN_USERNAME
            : 'admin',
    ADMIN_PASSWORD:
        process.env.ADMIN_PASSWORD !== ''
            ? process.env.ADMIN_PASSWORD
            : 'Admin@123',
    ADMIN_EMAIL:
        process.env.ADMIN_EMAIL !== ''
            ? process.env.ADMIN_EMAIL
            : 'lccsjce@sjce.ac.in',
    ADMIN_FULLNAME:
        process.env.ADMIN_FULLNAME !== ''
            ? process.env.ADMIN_FULLNAME
            : 'LCC Admin',
    ADMIN_USN:
        process.env.ADMIN_USN !== '' ? process.env.ADMIN_USN : '01JST00CS000',
    ALLOW_QUESTION_UPDATE: process.env.ALLOW_QUESTION_UPDATE === 'true',
    ALLOW_USER_REGISTRATION: process.env.ALLOW_USER_REGISTRATION === 'true',
    ADMIN_PHONE: process.env.ADMIN_PHONE
}
export default envVariables
