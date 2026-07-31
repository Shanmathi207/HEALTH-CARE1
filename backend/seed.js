const User = require('./models/User');
require('dotenv').config();

const demoUsers = [
    {
        email: 'patient@demo.com',
        password: 'password123',
        userType: 'patient',
        name: 'Demo Patient',
        phone: '0000000000'
    },
    {
        email: 'doctor@demo.com',
        password: 'password123',
        userType: 'doctor',
        name: 'Demo Doctor',
        phone: '0000000001',
        specialization: 'General Medicine',
        department: 'Cardiology'
    },
    {
        email: 'admin@demo.com',
        password: 'password123',
        userType: 'hospital',
        name: 'Demo Admin',
        phone: '0000000002',
        hospitalName: 'City General Hospital'
    }
];

async function seedDatabase() {
    try {
        await User.deleteMany({});
        console.log('🗑️  Cleared existing users');

        for (const userData of demoUsers) {
            const user = new User(userData);
            await user.save();
            console.log(`👤 Created ${userData.userType}: ${userData.email}`);
        }

        console.log('✨ Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seedDatabase();
