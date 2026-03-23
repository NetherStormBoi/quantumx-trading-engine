// bot.js
console.log("🤖 Market Maker Bot started! Sending orders...");

const types = ['buy', 'sell'];

// Run this loop every 500 milliseconds
setInterval(() => {
    // 1. Generate random trade data
    const randomType = types[Math.floor(Math.random() * 2)];
    // Random price between $50,000 and $50,500
    const randomPrice = Math.floor(Math.random() * 500) + 50000; 
    // Random amount between 0.1 and 2.1 BTC
    const randomAmount = Number((Math.random() * 2).toFixed(2)) + 0.1;

    // 2. Fire it at the engine
    fetch('http://localhost:3000/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: randomType,
            price: randomPrice,
            amount: randomAmount
        })
    }).catch(err => console.log("Waiting for server..."));

}, 500);