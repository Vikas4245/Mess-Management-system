import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create PollContext
export const PollContext = createContext();

export const PollProvider = ({ children }) => {
  const [polls, setPolls] = useState([]);

  // Fetch polls on component mount
  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await axios.get("api/v1/voting/polls");
      setPolls(response.data); // Assuming the API returns an array of polls
    } catch (error) {
      console.error("Failed to fetch polls:", error);
    }
  };

  return (
    <PollContext.Provider value={{ polls, fetchPolls }}>
      {children}
    </PollContext.Provider>
  );
};
