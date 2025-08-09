import React, { useEffect, useState } from 'react';
import ComplaintList from './ComplaintList';
import axios from 'axios';
import '../../assets/styles.css';

const AdminComplaintsScreen = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/v1/complaint/complaints');
        setComplaints(res.data); // Adjust if response is different
      } catch (err) {
        console.error('Error fetching complaints:', err);
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="admin-complaints-screen">
      <h2 className="screen-heading">All Complaints</h2>
      {loading ? <p>Loading complaints...</p> : <ComplaintList complaints={complaints} />}
    </div>
  );
};

export default AdminComplaintsScreen;
