// test-order.js

// We send a network request to our running engine
fetch('http://localhost:3000/api/order', {
    method: 'POST', // 'POST' because we are sending data
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        type: 'buy',
        price: 50500, // Willing to pay $50,500
        amount: 2     // Wants 2 BTC
    })
})
.then(response => response.json())
.then(data => console.log("Server Reply:", data));