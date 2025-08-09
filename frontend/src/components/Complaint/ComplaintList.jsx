import React from 'react';
import '../../assets/styles.css'; // Assuming styling is here

const ComplaintList = ({ complaints = [] }) => {
  if (!complaints.length) {
    return <p className="no-complaints">No complaints found.</p>;
  }

  return (
    <div className="complaint-list-container">
      {complaints.map((complaint) => (
        <div className="complaint-card" key={complaint._id}>
          <h3>{complaint.category}</h3>
          <p>{complaint.description}</p>
          <p>Status: {complaint.status}</p>
          <p>Created At: {new Date(complaint.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default ComplaintList;
