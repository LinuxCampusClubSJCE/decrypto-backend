import envVariables from '../config/config'
import User from '../models/User' // Assuming this is your User model
import bcrypt from 'bcrypt'

const createAdminUser = async (): Promise<void> => {
    try {
        const adminUsername = envVariables.ADMIN_USERNAME
        const adminPassword = envVariables.ADMIN_PASSWORD
        const adminEmail = envVariables.ADMIN_EMAIL
        const adminFullName = envVariables.ADMIN_FULLNAME
        const adminUSN = envVariables.ADMIN_USN
        const adminPhone = envVariables.ADMIN_PHONE

        const existingAdmin = await User.findOne({ username: adminUsername })
        if (existingAdmin != null) {
            console.log('Admin user already exists.')
            return
        }
        const hashedPassword = await bcrypt.hash(adminPassword, 10)

        const adminUser = new User({
            username: adminUsername,
            password: hashedPassword,
            email: adminEmail,
            fullName: adminFullName,
            usn: adminUSN,
            isAdmin: true,
            phone: adminPhone
        })

        await adminUser.save()
        console.log('Admin user created successfully.')
    } catch (error) {
        console.error('Error creating admin user:', error)
    }
}

export default createAdminUser
