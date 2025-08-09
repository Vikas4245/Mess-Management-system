import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const StudentContent = ({ content, user }) => {
  const [polls, setPolls] = useState([]);
  const [selectedPollId, setSelectedPollId] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const qrRef = useRef(null);
  const canvasRef = useRef(null);
  const [regarding, setRegarding] = useState("");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleFeedback = async (e) => {
    e.preventDefault();

    try {
      if (!regarding || !feedback) {
        setError("All fields are required!");
        return;
      }

      const provider = user?._id;

      const response = await axios.post("api/v1/feedback/add-feedback", {
        provider,
        regarding,
        feedback,
      });

      setMessage(response.data.message);
      setRegarding("");
      setFeedback("");
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit feedback.");
    }
  };

  const handleDownload = () => {
    if (!user?.qrcode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = user.qrcode;
    img.crossOrigin = "Anonymous"; // Prevent CORS issues

    img.onload = () => {
      // Increased canvas size for better QR clarity in PNG
      const qrSize = 500; // Large QR Code in PNG
      canvas.width = qrSize + 100; // Extra width for text alignment
      canvas.height = qrSize + 150; // Extra height for text below QR

      // Fill Background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Enlarged QR Code (Centered)
      ctx.drawImage(img, 50, 20, qrSize, qrSize);

      // Text Properties
      ctx.font = "30px Arial";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";

      // Draw Student Name
      ctx.fillText(user.name || "Student Name", canvas.width / 2, qrSize + 70);

      // Draw Roll Number
      ctx.fillText(`Roll No: ${user.rollno || "Unknown"}`, canvas.width / 2, qrSize + 110);

      // Convert Canvas to Image & Download
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${user.name || "Student"}_QR_Code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };

  const handleComplaint = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("api/v1/complaint/add-complaint", { category, description });
      alert("Complaint submitted successfully!");
      setCategory(""); // Clear form
      setDescription("");
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint. Please try again.");
    }
  };

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get("api/v1/voting/polls");
        setPolls(response.data.polls);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    fetchPolls();
  }, []);

  const handleVote = async (pollId) => {
    try {
      await axios.post(`api/v1/voting/polls/${pollId}/vote`, {
        rollno: selectedCandidate,
      });
      alert("Vote successfully cast!");
      setSelectedCandidate("");
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to cast vote. Please try again.");
    }
  };
    
  if (content === 'complaint') {
    return (
      <div id="user-content">
      <h2 className="text-4xl">Complaint</h2>
      <hr />
      <form onSubmit={handleComplaint}>
        <div>
          <label htmlFor="category">Regarding</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="Food">Food</option>
            <option value="Staff">Staff</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <textarea
          placeholder="Write your complaint here!"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          cols="30"
          rows="2"
        ></textarea>

        <button type="submit">Submit</button>
      </form>
    </div>
    );
  } else if (content === 'feedback') {
    return (
      <div id="user-content">
      <h2 className="text-4xl">Feedback</h2>
      <hr />
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleFeedback}>
        <div>
          <label htmlFor="regarding">Regarding</label>
          <select id="regarding" name="regarding" value={regarding} onChange={(e) => setRegarding(e.target.value)}>
            <option value="">Select</option>
            <option value="Food">Food</option>
            <option value="Staff">Staff</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <textarea
          placeholder="Write your feedback here!"
          name="feedback"
          id="feedback"
          cols="30"
          rows="2"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
  } else if (content === 'qr-code') {
    return (
      <div id="user-content">
      <h2>QR Code</h2>
      <hr />
      <div>
        <img ref={qrRef} src={user?.qrcode} alt="Student QR Code" />
      </div>

      <button onClick={handleDownload}>Download</button>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
    );
  }
  else if(content == 'vote'){
    return (
      <div>
      <h1>Polls</h1>
      {polls.length === 0 ? (
        <p>No active polls at the moment.</p>
      ) : (
        polls.map((poll) => (
          <div key={poll.id} style={{ marginBottom: "20px" }}>
            <h2>{poll.title}</h2>
            <p>Purpose: {poll.purpose}</p>
            <p>Deadline: {new Date(poll.deadline).toLocaleString()}</p>
            <h3>Candidates</h3>
            {poll.candidates.map((candidate) => (
              <div key={candidate.rollno}>
                <label>
                  <input
                    type="radio"
                    name={`poll-${poll.id}`}
                    value={candidate.rollno}
                    checked={selectedCandidate === candidate.rollno}
                    onChange={() => {
                      setSelectedPollId(poll.id);
                      setSelectedCandidate(candidate.rollno);
                    }}
                  />
                  {candidate.name} ({candidate.rollno}) - {candidate.branch}
                </label>
              </div>
            ))}
            <button
              onClick={() => handleVote(selectedPollId)}
              disabled={!selectedPollId || !selectedCandidate}
            >
              Vote
            </button>
          </div>
        ))
      )}
    </div>
    );
  } else {
    return (
      <div id="user-content">
        <h2>User Info</h2>
        <hr />
        <div id="user-info-div">
          <p>Name: {user?.name}</p>
          <p>Roll No.: {user?.rollno}</p>
          <p>Email: {user?.email}</p>
          <p>Discipline: {user?.discipline}</p>
          <p>Registered Mess: {user?.regmess}</p>
        </div>
        <div id="user-info-actions">
          <button>Edit</button>
        </div>
      </div>
    );
  }
};

export default StudentContent;