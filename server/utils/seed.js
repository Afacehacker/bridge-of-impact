const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Case = require('../models/Case');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing
        await User.deleteMany();
        await Case.deleteMany();

        // Create Admin
        await User.create({
            name: 'Bridge Admin',
            email: 'admin@bridgeofimpact.org',
            password: 'password123',
            role: 'admin'
        });

        // Create Cases
        await Case.create([
            {
                title: 'Surgery for 5-Year-Old Chidi',
                beneficiaryName: 'Chidi Okoro',
                location: 'Enugu State',
                category: 'Medical',
                targetAmount: 2500000,
                amountRaised: 1850000,
                description: 'Chidi was diagnosed with a congenital heart defect and needs urgent corrective surgery at the University of Nigeria Teaching Hospital.',
                image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040'
            },
            {
                title: 'Emergency Dialysis Support',
                beneficiaryName: 'Ahmadu Bello',
                location: 'Kano State',
                category: 'Medical',
                targetAmount: 850000,
                amountRaised: 320000,
                description: 'Ahmadu is battling stage 4 kidney disease and requires 3 dialysis sessions weekly to survive while awaiting a donor.',
                image: '/assets/images/hospital_bed_child.png'
            },
            {
                title: 'Flood Relief for Families in Lokoja',
                beneficiaryName: 'Lokoja Community',
                location: 'Kogi State',
                category: 'Crisis Relief',
                targetAmount: 5000000,
                amountRaised: 1200000,
                description: 'Providing food, clean water, and temporary shelter for families displaced by the recent Niger River floods.',
                image: '/assets/images/children_community.png'
            }
        ]);

        console.log('Seed successful! Admin: admin@bridgeofimpact.org / password123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
