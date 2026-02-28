const axios = require('axios');

const paystack = (secretKey) => {
    const initializeTransaction = async (form) => {
        const options = {
            url: 'https://api.paystack.co/transaction/initialize',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json'
            },
            data: form
        };
        try {
            const response = await axios(options);
            return response.data;
        } catch (error) {
            console.error('Paystack Initialize Error:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    const verifyTransaction = async (reference) => {
        const options = {
            url: `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json'
            }
        };
        try {
            const response = await axios(options);
            return response.data;
        } catch (error) {
            console.error('Paystack Verify Error:', error.response ? error.response.data : error.message);
            throw error;
        }
    };

    return { initializeTransaction, verifyTransaction };
};

module.exports = paystack;
