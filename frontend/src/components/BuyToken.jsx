import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

const FIXED_PRICE_PER_PERSON = 50;

const BuyToken = () => {
  const [name, setName] = useState("");
  const [totalTokens, setNumPeople] = useState("");
  const [amount, setAmount] = useState(0);
  const [tokenId, setTokenId] = useState(null);
  const [qrcode, setQrCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    setAmount(totalTokens ? totalTokens * FIXED_PRICE_PER_PERSON : 0);
  }, [totalTokens]);

  const handlePayment = async () => {
    if (!name || !totalTokens) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await axios.post('api/v1/token/purchase-token', { name, amount, totalTokens });
      setQrCode(response.data.data.qrcode); 
      setTokenId(response.data.data._id);
    } catch (error) {
      setError("Payment failed. Try again.");
      console.error("Payment Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (qrcode && tokenId) {
      drawToken();
    }
  }, [qrcode, tokenId]);

  const drawToken = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 400;
    canvas.height = 500;

    // Background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Title
    ctx.fillStyle = "#000";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Meal Token", canvas.width / 2, 50);

    // Token Details
    ctx.font = "18px Arial";
    ctx.fillText(`Token ID: ${tokenId}`, canvas.width / 2, 90);
    ctx.fillText(`Name: ${name}`, canvas.width / 2, 130);
    ctx.fillText(`Amount: ₹${amount}`, canvas.width / 2, 170);
    ctx.fillText(`No. of People: ${totalTokens}`, canvas.width / 2, 210);

    // Load and draw QR code
    const img = new Image();
    img.src = qrcode;
    img.onload = () => {
      ctx.drawImage(img, 100, 240, 200, 200);
    };
  };

  const handleDownloadToken = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `meal_token_${tokenId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Header />
      <div className="container">
        <h2>Buy Meal Token</h2>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Number of People:</label>
          <input
            type="number"
            value={totalTokens}
            onChange={(e) => setNumPeople(e.target.value)}
            min="1"
          />
        </div>
        <div>
          <label>Amount (₹{FIXED_PRICE_PER_PERSON} per person):</label>
          <input type="text" value={amount} readOnly />
        </div>
        <button onClick={handlePayment} disabled={loading}>
          {loading ? "Processing..." : "Buy Token"}
        </button>

        {error && <p className="error">{error}</p>}

        {qrcode && tokenId && (
          <div>
            <h3>Meal Token</h3>
            <canvas ref={canvasRef} style={{ border: "1px solid black" }}></canvas>
            <br />
            <button onClick={handleDownloadToken}>Download Token</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BuyToken;
