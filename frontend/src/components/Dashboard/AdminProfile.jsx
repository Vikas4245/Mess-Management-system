import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Header from "../Header";
import Footer from "../Footer";
import { useNavigate, NavLink } from "react-router-dom";
import AdminCard from "./AdminCard";
import AdminContent from "./AdminContent";


const AdminProfile = () => {
  const [content, setContent] = useState("admin-info");
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = Cookies.get("admin");

    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
      setLoading(false);
    } else {
      navigate("/admin"); // Changed redirect to match correct login route
    }
  }, [navigate]);

  const handleContent = (str) => {
    setContent(str);
  };

  const handleLogout = () => {
    Cookies.remove("admin");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    navigate("/admin-login"); // Ensure redirect to correct login page
  };

  if (loading) {
    return <p>Loading...</p>; // Added loading state feedback
  }

  return (
    <div id="admin-profile">
      <Header />
      <div id="admin-profile-content">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <AdminCard
              admin={admin}
              content={content}
              handleContent={handleContent}
              handleLogout={handleLogout}
            />
            <AdminContent content={content} admin={admin} />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminProfile;