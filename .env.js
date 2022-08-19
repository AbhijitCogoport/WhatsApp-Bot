const production = {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'production',
};

const development = {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: '9000',
    Meta_WA_accessToken: 'EAAQ9Mp7CZCi4BAE3ZCcKYQr4BT5OQN9CSkr8tzb3pcHZCBCapkkl6JRGMTTTrt4ZB1icN8E0MChxmC6ObI9UJfaZC9MyfHAQLzUapR3uxWMvU4T9zCTJKd3yZB8veGwKpHJNNj7FZBNj2ICftoscVZCZCh3ZBriAPXwprZCwRLpcKFwZAG1LZAmlBwHcFoZAmiPM7RclkOZBVo9suHE4QZDZD',
    Meta_WA_SenderPhoneNumberId: '106849635477090',
    Meta_WA_wabaId: '103555699146921',
    Meta_WA_VerifyToken: 'abhijitgayenbyme',
};

const fallback = {
    ...process.env,
    NODE_ENV: undefined,
};

module.exports = (environment) => {
    console.log(`Execution environment selected is: "${environment}"`);
    if (environment === 'production') {
        return production;
    } else if (environment === 'development') {
        return development;
    } else {
        return fallback;
    }
};