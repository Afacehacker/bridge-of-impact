const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Case = require('../models/Case');

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const cases = await Case.find();
        console.log('--- FOUND CASES ---');
        cases.forEach(c => {
            console.log(`Title: ${c.title}`);
            console.log(`Image Path in DB: ${c.image}`);
            console.log('---');
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debug();
