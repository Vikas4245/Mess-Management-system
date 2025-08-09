import React, { useEffect, useState } from "react";
import axios from "axios";

const PollResults = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPollResults = async () => {
      try {
        const response = await axios.get("api/v1/voting/results");
        setPolls(response.data.polls);
      } catch (error) {
        console.error("Error fetching poll results:", error);
      }
    };

    fetchPollResults();
  }, []);

  return (
    <div>
      <h1>Poll Results</h1>
      {polls.length === 0 ? (
        <p>No results available yet.</p>
      ) : (
        polls.map((poll) => (
          <div key={poll.id} style={{ marginBottom: "20px" }}>
            <h2>{poll.title}</h2>
            <p>Purpose: {poll.purpose}</p>
            <h3>Results</h3>
            {poll.candidates.map((candidate) => (
              <p key={candidate.rollno}>
                {candidate.name} ({candidate.rollno}): {candidate.voteCount} votes
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default PollResults;
