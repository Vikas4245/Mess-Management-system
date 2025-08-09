import React, { useState } from 'react';

const ComplaintForm = ({ onSubmit }) => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !description) return;
    onSubmit({ category, description });
    setCategory('');
    setDescription('');
  };

  return (
    <form className="complaint-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Raise a Complaint</h2>

      <label className="form-label">Category</label>
      <input
        className="form-input"
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Enter category"
      />

      <label className="form-label">Description</label>
      <textarea
        className="form-textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your issue"
      />

      <button className="form-button" type="submit">
        Submit Complaint
      </button>
    </form>
  );
};

export default ComplaintForm;
