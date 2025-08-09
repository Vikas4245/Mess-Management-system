import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import Cookies from "js-cookie";

const QRCodeScanner = () => {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [session, setSession] = useState(""); // Automated session selection

  // **Function to get the session based on current time**
  const getSession = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 6 && currentHour < 11) return "morning";
    if (currentHour >= 11 && currentHour < 16) return "afternoon";
    if (currentHour >= 16 && currentHour < 22) return "evening";
    return ""; // If outside session hours
  };

  useEffect(() => {
    // **Automatically set the session on page load**
    setSession(getSession());

    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 500 });

    scanner.render(
      async (decodedText) => {
        setError(null);
        setSuccessMessage("Processing...");

        try {
          const qrData = JSON.parse(decodedText);
          let response;

          // **Reset scanner quickly for continuous scanning**
          setTimeout(() => scanner.resume(), 500);

          if (qrData.type === "student") {
            if (!session) {
              setError("No active session. Please check the time.");
              return;
            }

            const today = new Date().toISOString().split("T")[0];

            response = await axios.post(
              "api/v1/attendance/record-attendance",
              { rollNo: qrData.rollNo, session, date: today },
              {
                headers: {
                  Authorization: `Bearer ${Cookies.get("accessToken")}`,
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            );

            setSuccessMessage(response.data.message);
          } else if (qrData.type === "token") {
            response = await axios.post("api/v1/token/redeem-token", {
              tokenId: qrData.tokenId,
            });

            setSuccessMessage(response.data.message);
          } else {
            throw new Error("Invalid QR code data");
          }
        } catch (err) {
          setError(err.response?.data?.message || "Invalid QR Code or Scan Failed.");
          setSuccessMessage(null);
        } finally {
          // **Ensure scanner is always ready for the next scan**
          setTimeout(() => scanner.resume(), 500);
        }
      },
      (errorMessage) => {
        setError("Scanning failed. Try again.");
        setTimeout(() => scanner.resume(), 500);
      }
    );

    return () => scanner.clear();
  }, [session]);

  return (
    <div>
      <h2>Scan QR Code</h2>

      {/* Display the auto-selected session */}
      <p><strong>Current Session:</strong> {session ? session.toUpperCase() : "No active session"}</p>

      {/* QR Scanner */}
      <div id="reader"></div>

      {/* Messages */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default QRCodeScanner;
