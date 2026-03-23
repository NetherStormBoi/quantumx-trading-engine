// index.js

// 1. Bring in the 'Pyramid' code we just wrote
const OrderHeap = require('./engine');

// 2. Set up our two Pyramids
// Buyers want the highest price at the top (Max-Heap = true)
const bids = new OrderHeap(true); 

// Sellers want the lowest price at the top (Max-Heap = false -> Min-Heap)
const asks = new OrderHeap(false); 

// We'll keep a list of all successful trades here
const tradeHistory = [];

// ==========================================
// 3. THE MATCHING ALGORITHM
// ==========================================
function processOrder(newOrder) {
    console.log(`\n📩 New Order Received: ${newOrder.type} ${newOrder.amount} BTC @ $${newOrder.price}`);

    // Step A: Put the new person in the correct pyramid
    if (newOrder.type === 'buy') {
        bids.push(newOrder);
    } else {
        asks.push(newOrder);
    }

    // Step B: The Matchmaker Loop
    // We keep checking the top of both pyramids as long as there is at least one buyer and one seller
    while (bids.peek() !== null && asks.peek() !== null) {
        
        const topBuyer = bids.peek();
        const topSeller = asks.peek();

        // Step C: Do their prices cross? 
        // If the buyer is offering LESS than the seller wants, the loop breaks. No trade.
        if (topBuyer.price < topSeller.price) {
            break; 
        }

        // Step D: WE HAVE A MATCH! 
        console.log(`🤝 MATCH FOUND! Buyer paying $${topBuyer.price} meets Seller asking $${topSeller.price}`);

        // Figure out how much Bitcoin they can actually trade.
        // (If a buyer wants 2 BTC, but the seller only has 1 BTC, they can only trade 1 BTC).
        const tradedAmount = Math.min(topBuyer.amount, topSeller.amount);

        // Record the trade!
        tradeHistory.push({
            price: topSeller.price, // Trades usually happen at the seller's price
            amount: tradedAmount,
            time: new Date().toLocaleTimeString()
        });

        // Deduct the traded amount from both people
        topBuyer.amount -= tradedAmount;
        topSeller.amount -= tradedAmount;

        // Step E: Cleanup
        // If the buyer got all the BTC they wanted, remove them from the pyramid
        if (topBuyer.amount === 0) {
            bids.heap.shift(); // Removes the top person
            bids.bubbleDown(); // Tells the next best buyer to step up to the top!
        }
        
        // If the seller sold all their BTC, remove them from the pyramid
        if (topSeller.amount === 0) {
            asks.heap.shift(); 
            asks.bubbleDown(); 
        }
    }
}

// ==========================================
// 4. THE SIMULATION
// ==========================================
console.log("🚀 Starting Trading Engine Simulation...\n");

// 1. Three Sellers arrive
// Notice the prices. $50,050 is the BEST (lowest) price, so the engine 
// should automatically push it to the top of the Sellers' Pyramid.
processOrder({ type: 'sell', price: 50100, amount: 1.0 });
processOrder({ type: 'sell', price: 50200, amount: 2.0 });
processOrder({ type: 'sell', price: 50050, amount: 0.5 }); 

console.log("\n--- Buyers Entering ---");

// 2. A 'Whale' Buyer arrives!
// They want to buy 1.5 BTC and are willing to pay up to $50,150.
// Watch the engine match them with the $50,050 seller first, and then the $50,100 seller!
processOrder({ type: 'buy', price: 50150, amount: 1.5 });

// 3. Print the final receipt
console.log("\n📊 Final Trade History:");
console.log(tradeHistory);