import React, { useState } from "react";
import axios from "axios";

const CreatePoll = () => {
  const [pollTitle, setPollTitle] = useState("");
  const [pollPurpose, setPollPurpose] = useState("Student Committee Formation");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [candidateName, setCandidateName] = useState("");
  const [candidateRollno, setCandidateRollno] = useState("");
  const [candidateBranch, setCandidateBranch] = useState("");
  const [candidateCGPA, setCandidateCGPA] = useState("");

  const handleAddCandidate = (e) => {
    e.preventDefault(); // Prevent form submission

    if (
      candidateName &&
      candidateRollno &&
      candidateBranch &&
      candidateCGPA >= 7
    ) {
      setCandidates([
        ...candidates,
        {
          name: candidateName,
          rollno: candidateRollno,
          branch: candidateBranch,
          cgpa: candidateCGPA,
        },
      ]);

      // Clear candidate fields after adding
      setCandidateName("");
      setCandidateRollno("");
      setCandidateBranch("");
      setCandidateCGPA("");
    } else {
      alert("Please fill out all fields and ensure CGPA is at least 7.");
    }
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission

    if (!pollTitle || !deadline || candidates.length === 0 || !description) {
      alert("Please provide all poll details, a description, and at least one candidate.");
      return;
    }

    try {
      const response = await axios.post("api/v1/voting/create-poll", {
        title: pollTitle,
        purpose: pollPurpose,
        deadline,
        description,
        candidates,
      });

      if (response.data.success) {
        alert("Poll created successfully!");
        setPollTitle("");
        setPollPurpose("Student Committee Formation");
        setDeadline("");
        setDescription("");
        setCandidates([]); // Clear all fields after successful poll creation
      } else {
        alert("Failed to create poll.");
      }
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("An error occurred while creating the poll.");
    }
  };

  return (
    <div>
      <h1>Create Poll</h1>
      <form onSubmit={handleCreatePoll}>
        <div>
          <label>
            Poll Title:
            <input
              type="text"
              value={pollTitle}
              onChange={(e) => setPollTitle(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Purpose:
            <select
              value={pollPurpose}
              onChange={(e) => setPollPurpose(e.target.value)}
            >
              <option value="Student Committee Formation">
                Student Committee Formation
              </option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Deadline:
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </label>
        </div>
        <h2>Add Candidates</h2>
        <div>
          <label>
            Candidate Name:
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Candidate Roll No:
            <input
              type="text"
              value={candidateRollno}
              onChange={(e) => setCandidateRollno(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Branch:
            <input
              type="text"
              value={candidateBranch}
              onChange={(e) => setCandidateBranch(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            CGPA:
            <input
              type="number"
              step="0.01"
              value={candidateCGPA}
              onChange={(e) => setCandidateCGPA(e.target.value)}
            />
          </label>
        </div>
        <button onClick={handleAddCandidate}>Add Candidate</button>
        <h3>Added Candidates:</h3>
        {candidates.length === 0 ? (
          <p>No candidates added yet.</p>
        ) : (
          <ul>
            {candidates.map((candidate, index) => (
              <li key={index}>
                {candidate.name} ({candidate.rollno}) - {candidate.branch}, CGPA:{" "}
                {candidate.cgpa}
              </li>
            ))}
          </ul>
        )}
        <button type="submit">Create Poll</button>
      </form>
    </div>
  );
};

export default CreatePoll;
