import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminContent = ({ content, user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [candidate, setCandidate] = useState({ name: '', rollno: '', branch: '', cgpa: '' });

  // Add a candidate to the draft list
  const addCandidateToDraft = () => {
    if (!candidate.name || !candidate.rollno || !candidate.branch || !candidate.cgpa) {
      alert('Please fill in all candidate fields');
      return;
    }
    setCandidates([...candidates, candidate]);
    setCandidate({ name: '', rollno: '', branch: '', cgpa: '' }); // Reset candidate form
  };

  // Create the poll and add all candidates in one go
  const createPoll = async () => {
    const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);

    if (!title || !description || !deadline || candidates.length === 0) {
      alert('Please fill in all fields and add at least one candidate');
      return;
    }

    try {
      // Create poll first
      const pollResponse = await axios.post('api/v1/voting/create-poll', {
        title,
        description,
        deadline: deadlineTimestamp,
      });

      const pollId = pollResponse.data.pollId; // Get the poll ID from the response

      // Add all candidates to the poll
      for (const cand of candidates) {
        await axios.post(`api/v1/voting/add-candidate/${pollId}`, cand);
      }

      alert('Poll and candidates created successfully!');
    } catch (error) {
      console.error(error);
      alert('Error creating poll or adding candidates');
    }
  };


  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 
  // Fetch complaints from the API
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get("api/v1/complaint/complaints");
        setComplaints(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load complaints. Please try again later.");
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Mark a complaint as resolved
  const markAsResolved = async (id) => {
    try {
      await axios.put(`api/v1/complaint/update-complaint-status/${id}`);
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint.id === id ? { ...complaint, status: "resolved" } : complaint
        )
      );
    } catch (error) {
      alert("Failed to mark complaint as resolved. Please try again.");
    }
  };

  if (content === 'complaints') {
    return (
        <div id="admin-complaints-page" style={{ padding: "20px" }}>
        <h2 className="text-4xl">Admin Complaint Management</h2>
        <hr />
  
        {loading && <p>Loading complaints...</p>}
        {error && <p className="error-text">{error}</p>}
  
        {!loading && complaints.length === 0 && <p>No complaints found.</p>}
  
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                width: "300px",
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3 style={{ margin: "0 0 8px 0" }}>Complaint #{complaint.id}</h3>
              <p>
                <strong>Category:</strong> {complaint.category}
              </p>
              <p>
                <strong>Description:</strong> {complaint.description}
              </p>
              <p>
                <strong>Timestamp:</strong>{" "}
                {new Date(complaint.timestamp).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: complaint.status === "resolved" ? "green" : "red",
                  }}
                >
                  {complaint.status}
                </span>
              </p>
              {complaint.status !== "resolved" && (
                <button
                  onClick={() => markAsResolved(complaint.id)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Mark as resolved
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  } 
// else if (content === 'feedback') {
//     return (
//       <div id="user-content">
//         <h2 className="text-4xl">Feedback</h2>
//         <hr />
//         <form action="">
//           <div>
//             <label htmlFor="">Regarding</label>
//             <select name="" id="">
//               <option value="">Food</option>
//               <option value="">Staff</option>
//               <option value="">Cleanliness</option>
//               <option value="">Other</option>
//             </select>
//           </div>
//           <textarea placeholder="Write your Feedback here!" name="" id="" cols="30" rows="2"></textarea>
//           <button type="submit">Submit</button>
//         </form>
//       </div>
//     );
//   } else if (content === 'qr-code') {
//     return (
//       <div id="user-content">
//         <h2 className="text-4xl">QR Code</h2>
//         <hr />
//         <div id='user-qrcode-div'>
//           <img src={user?.qrcode} alt="Student QR Code" />
//         </div>
//       </div>
//     );
//   }
  else if(content == 'vote'){
    return (
      <div>
      <h2>Create Poll</h2>
      <div>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label>Deadline:</label>
        <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      </div>

      <h3>Add Candidates</h3>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={candidate.name}
          onChange={(e) => setCandidate({ ...candidate, name: e.target.value })}
        />
      </div>
      <div>
        <label>Roll Number:</label>
        <input
          type="text"
          value={candidate.rollno}
          onChange={(e) => setCandidate({ ...candidate, rollno: e.target.value })}
        />
      </div>
      <div>
        <label>Branch:</label>
        <input
          type="text"
          value={candidate.branch}
          onChange={(e) => setCandidate({ ...candidate, branch: e.target.value })}
        />
      </div>
      <div>
        <label>CGPA:</label>
        <input
          type="number"
          step="0.1"
          value={candidate.cgpa}
          onChange={(e) => setCandidate({ ...candidate, cgpa: e.target.value })}
        />
      </div>
      <button onClick={addCandidateToDraft}>Add Candidate</button>

      <h4>Current Candidates:</h4>
      <ul>
        {candidates.map((cand, index) => (
          <li key={index}>
            {cand.name} - {cand.rollno} - {cand.branch} - CGPA: {cand.cgpa}
          </li>
        ))}
      </ul>

      <button onClick={createPoll}>Create Poll</button>
      </div>
    );
  } 
// else {
//     return (
//       <div id="user-info">
//         <h2>User Info</h2>
//         <hr />
//         <div id="user-info-div">
//           <p>Name: {user?.name}</p>
//           <p>Roll No.: {user?.rollno}</p>
//           <p>Email: {user?.email}</p>
//           <p>Discipline: {user?.discipline}</p>
//           <p>Registered Mess: {user?.regmess}</p>
//         </div>
//         <div id="user-info-actions">
//           <button>Edit</button>
//         </div>
//       </div>
//     );
  // }
};

export default AdminContent;