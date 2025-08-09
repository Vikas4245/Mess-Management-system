import React, { useEffect, useState } from "react";
import axios from "axios";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const itemsPerPage = 4;
  const intervalTime = 5000; // Auto-change every 5 seconds

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("api/v1/feedback/feedbacks");
        setFeedbacks(response.data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (feedbacks.length > itemsPerPage) {
      const interval = setInterval(() => {
        handleNext();
      }, intervalTime);

      return () => clearInterval(interval);
    }
  }, [feedbacks, currentIndex]);

  const handleNext = () => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        (prevIndex + itemsPerPage) % feedbacks.length
      );
      setTransitioning(false);
    }, 500);
  };

  const handlePrev = () => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        (prevIndex - itemsPerPage + feedbacks.length) % feedbacks.length
      );
      setTransitioning(false);
    }, 500);
  };

  return (
    <div className="feedback-container">
      {feedbacks.length === 0 ? (
        <p>No feedback available.</p>
      ) : (
        <div className={`feedback-list ${transitioning ? "fade-out" : "fade-in"}`}>
          {feedbacks
            .slice(currentIndex, currentIndex + itemsPerPage)
            .map((fb, index) => (
              <div key={index} className="feedback-card slide-in">
                <h4>{fb.provider.name}</h4>
                <p><strong>{fb.regarding}</strong></p>
                <p>{fb.feedback}</p>
              </div>
            ))}
        </div>
      )}

      {/* Navigation Buttons */}
      {feedbacks.length > itemsPerPage && (
        <div className="feedback-buttons">
          <button onClick={handlePrev}>⬅️ Previous</button>
          <button onClick={handleNext}>Next ➡️</button>
        </div>
      )}
    </div>
  );
}

export default FeedbackList
