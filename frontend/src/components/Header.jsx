import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../assets/styles.css";
import logo from "../assets/images/IIITDMJ-Logo.jpg";
import { FiMenu, FiX } from "react-icons/fi"; // Import menu icons

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const cname = ({ isActive }) => (isActive ? "active-link" : "link");

  return (
    <div id="header">
      <div id="logo">
        <img id="logo-img" src={logo} alt="logo" />
      </div>

      {/* Menu Toggle Button */}
      <button id="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Navigation Menu */}
      <ul id="header-ul" className={isOpen ? "open" : ""}>
        <li className="header-li"><NavLink to="/" className={cname}>Home</NavLink></li>
        <li className="header-li"><NavLink to="/login" className={cname}>Login</NavLink></li>
        <li className="header-li"><NavLink to="/signup" className={cname}>Register</NavLink></li>
        <li className="header-li"><NavLink to="/complaints" className={cname}>Complaints</NavLink></li>
        <li className="header-li"><NavLink to="/aboutus" className={cname}>About Us</NavLink></li>
        <li className="header-li"><NavLink to="/buy-token" className={cname}>Buy Token</NavLink></li>
        <li className="header-li"><NavLink to="/staff" className={cname}>Staff</NavLink></li>
        <li className="header-li"><NavLink to="/admin" className={cname}>Admin</NavLink></li>
      </ul>
    </div>
  );
};

export default Header;
