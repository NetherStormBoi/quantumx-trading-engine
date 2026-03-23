import React, { useState, useEffect } from 'react';

function App() {
  // --- STATE ---
  const [book, setBook] = useState({ bestBuyer: null, bestSeller: null });
  const [trades, setTrades] = useState([]);

  // --- THE LIVE FEED (Polling) ---
  useEffect(() => {
    // This function reaches out to your Express server
    const fetchMarketData = async () => {
      try {
        const bookRes = await fetch('http://localhost:3000/api/book');
        const bookData = await bookRes.json();
        setBook(bookData);

        const tradesRes = await fetch('http://localhost:3000/api/trades');
        const tradesData = await tradesRes.json();
        
        // We only want to show the 10 most recent trades so the screen doesn't overflow
        setTrades(tradesData.slice(-10).reverse()); 
      } catch (error) {
        console.error("Engine offline or unreachable...");
      }
    };

    // 1. Fetch immediately on load
    fetchMarketData();

    // 2. Set up an infinite loop to fetch new data every 1 second (1000ms)
    const intervalId = setInterval(fetchMarketData, 1000);

    // Cleanup the loop if the user closes the tab
    return () => clearInterval(intervalId);
  }, []);

  // --- UI STYLES ---
  const theme = {
    bg: "#0B0E11",        // Deep Binance-style dark mode
    panel: "#181A20",     // Slightly lighter for cards
    text: "#EAECEF",      // Off-white text
    green: "#0ECB81",     // Neon Bid green
    red: "#F6465D",       // Neon Ask red
    border: "#2B3139"
  };

  return (
    <div style={{ backgroundColor: theme.bg, color: theme.text, minHeight: "100vh", padding: "20px", fontFamily: "monospace" }}>
      
      {/* HEADER */}
      <header style={{ borderBottom: `1px solid ${theme.border}`, paddingBottom: "15px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: "1.8rem" }}>⚡ QuantumX Trading Engine</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "10px", height: "10px", backgroundColor: theme.green, borderRadius: "50%", boxShadow: `0 0 8px ${theme.green}` }}></div>
          <span style={{ color: theme.green, fontWeight: "bold" }}>ENGINE LIVE</span>
        </div>
      </header>

      {/* MAIN DASHBOARD GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* LEFT COLUMN: THE ORDER BOOK */}
        <div style={{ backgroundColor: theme.panel, padding: "20px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
          <h2 style={{ marginTop: 0, borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>📖 Live Order Book (Best Prices)</h2>
          
          {/* Asks (Sellers) - Displayed in Red */}
          <div style={{ marginBottom: "30px", padding: "15px", borderLeft: `4px solid ${theme.red}`, backgroundColor: "rgba(246, 70, 93, 0.05)" }}>
            <h3 style={{ color: theme.red, margin: "0 0 10px 0" }}>Lowest Ask (Seller)</h3>
            {book.bestSeller ? (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.5rem", fontWeight: "bold" }}>
                <span>${book.bestSeller.price.toFixed(2)}</span>
                <span>{book.bestSeller.amount} BTC</span>
              </div>
            ) : (
              <p style={{ color: "#888" }}>Waiting for sellers...</p>
            )}
          </div>

          {/* THE SPREAD (Visual divider) */}
          <div style={{ textAlign: "center", padding: "10px 0", color: "#888", fontSize: "0.9rem", borderTop: `1px dashed ${theme.border}`, borderBottom: `1px dashed ${theme.border}`, marginBottom: "30px" }}>
            --- THE SPREAD ---
          </div>

          {/* Bids (Buyers) - Displayed in Green */}
          <div style={{ padding: "15px", borderLeft: `4px solid ${theme.green}`, backgroundColor: "rgba(14, 203, 129, 0.05)" }}>
            <h3 style={{ color: theme.green, margin: "0 0 10px 0" }}>Highest Bid (Buyer)</h3>
            {book.bestBuyer ? (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.5rem", fontWeight: "bold" }}>
                <span>${book.bestBuyer.price.toFixed(2)}</span>
                <span>{book.bestBuyer.amount} BTC</span>
              </div>
            ) : (
              <p style={{ color: "#888" }}>Waiting for buyers...</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: TRADE HISTORY */}
        <div style={{ backgroundColor: theme.panel, padding: "20px", borderRadius: "8px", border: `1px solid ${theme.border}` }}>
          <h2 style={{ marginTop: 0, borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>📜 Recent Matches</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: "0.9rem", paddingBottom: "5px" }}>
              <span>Price</span>
              <span>Amount</span>
              <span>Time</span>
            </div>

            {trades.length > 0 ? (
              trades.map((trade, index) => (
                <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "4px" }}>
                  <span style={{ color: theme.green, fontWeight: "bold" }}>${trade.price.toFixed(2)}</span>
                  <span>{trade.amount.toFixed(2)} BTC</span>
                  <span style={{ color: "#888", fontSize: "0.9rem" }}>{trade.time}</span>
                </div>
              ))
            ) : (
              <p style={{ color: "#888", textAlign: "center", marginTop: "20px" }}>No trades executed yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;