import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Header from "../Header";
import Footer from "../Footer";
import QRCodeScanner from "../QRCodeScanner";
import { useNavigate } from "react-router-dom";

const StaffProfile = () => {
  const [content, setContent] = useState("staff-info");
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedStaff = Cookies.get("staff");

    if (storedStaff) {
      setStaff(JSON.parse(storedStaff));
      setLoading(false);
    } else {
      navigate("/staff"); 
    }
  }, [navigate]);

  const handleContent = (str) => {
    setContent(str); 
  };

  const handleLogout = () => {
    Cookies.remove("staff");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    navigate("/login"); 
  };

  return (
    <div id="staff-profile">
      <Header />
      <div id="staff-profile-content">
        <h2>Welcome {staff?.name}</h2>
        <QRCodeScanner />
        <button onClick={handleLogout}>Logout</button>
      </div>
      <Footer />
    </div>
  );
};

export default StaffProfile;
