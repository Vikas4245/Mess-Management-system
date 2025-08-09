import React from 'react';
import userImage from '../../assets/images/foodimg4.png'; // Default image

const StudentCard = ({ user, content, handleContent, handleLogout }) => {
  const handleClick = (str) => {
    handleContent(str);
  };

  return (
    <div id="user-card-div">
      <img id="user-img" src={user?.image || userImage} alt="User" />
      <ul id="user-card-ul">
        <li className="user-card-li">
          <button onClick={() => handleClick('user-info')}>Profile</button>
        </li>
        <li className="user-card-li">
          <button onClick={() => handleClick('complaint')}>Complaint</button>
        </li>
        <li className="user-card-li">
          <button onClick={() => handleClick('feedback')}>Feedback</button>
        </li>
        <li className="user-card-li">
          <button onClick={() => handleClick('qr-code')}>QR Code</button>
        </li>
        <li className="user-card-li">
          <button onClick={() => handleClick('vote')}>Vote</button>
        </li>
      </ul>
      <div>
        <button onClick={handleLogout}>Logout</button> {/* Logout button */}
      </div>
    </div>
  );
};

export default StudentCard;
