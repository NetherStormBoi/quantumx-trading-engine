// server.js
const express = require('express');
const cors = require('cors');
const OrderHeap = require('./engine'); // Bringing in your Pyramid algorithm!

const app = express();
app.use(cors());
app.use(express.json()); // Allows us to read JSON data from the internet

// 1. Setup the Engine State
const bids = new OrderHeap(true);  // Buyers
const asks = new OrderHeap(false); // Sellers
const tradeHistory = [];

// ==========================================
// 2. THE ORDER ENDPOINT (Receiving trades from the web)
// ==========================================
app.post('/api/order', (req, res) => {
    // Read the incoming order from the network
    const newOrder = req.body; 

    console.log(`\n📩 Incoming Web Order: ${newOrder.type} ${newOrder.amount} BTC @ $${newOrder.price}`);

    // Put them in the correct pyramid
    if (newOrder.type === 'buy') {
        bids.push(newOrder);
    } else {
        asks.push(newOrder);
    }

    // --- THE MATCHMAKER LOOP ---
    while (bids.peek() !== null && asks.peek() !== null) {
        const topBuyer = bids.peek();
        const topSeller = asks.peek();

        if (topBuyer.price < topSeller.price) break; 

        console.log(`🤝 MATCH! Buyer paying $${topBuyer.price} meets Seller asking $${topSeller.price}`);

        const tradedAmount = Math.min(topBuyer.amount, topSeller.amount);

        tradeHistory.push({
            price: topSeller.price,
            amount: tradedAmount,
            time: new Date().toLocaleTimeString()
        });

        topBuyer.amount -= tradedAmount;
        topSeller.amount -= tradedAmount;

        if (topBuyer.amount === 0) {
            bids.heap.shift(); 
            bids.bubbleDown(); 
        }
        if (topSeller.amount === 0) {
            asks.heap.shift(); 
            asks.bubbleDown(); 
        }
    }

    // Reply back to whoever sent the request
    res.json({ message: "Order processed successfully!" });
});

// ==========================================
// 3. THE "VIEW" ENDPOINTS (Checking the state)
// ==========================================

// Check the trade history
app.get('/api/trades', (req, res) => {
    res.json(tradeHistory);
});

// Check the current best prices at the top of the pyramids
app.get('/api/book', (req, res) => {
    res.json({
        bestBuyer: bids.peek(),
        bestSeller: asks.peek()
    });
});

// Start the engine!
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Trading Engine API is live on http://localhost:${PORT}`);
});