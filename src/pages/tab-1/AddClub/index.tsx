import React, { useState } from 'react';
import axiosInstance from 'src/shared/utils/axios.config';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './AddClub.css'; // Import the CSS file for styling

interface AddClubProps { }

const AddClub: React.FC<AddClubProps> = () => {
  const navigate = useNavigate(); // Initialize navigate function from useNavigate
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
    role_id: '2', // Static role_id as 2
  });

  const [formError, setFormError] = useState(false); // State to manage form errors

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Make the POST request using axiosInstance
      const response = await axiosInstance.post('/auth/register', formData);

      // Handle success response here (e.g., show success message, redirect, etc.)
      console.log('Success:', response.data);

      // Navigate to /Clubs-Management/Clubs after successful form submission
      navigate('/Clubs-Management/Clubs');
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error('Error:', error);
      setFormError(true); // Set form error state to true on error
    }
  };

  return (
    <div className="tab12-card">
      <h1 className='title-card'>Add Club</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required className={formError ? 'error' : ''} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className={formError ? 'error' : ''} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required className={formError ? 'error' : ''} />
        </div>
        <div className="form-group">
          <label htmlFor="phone_number">Phone Number:</label>
          <input type="text" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleInputChange} required className={formError ? 'error' : ''} />
        </div>
        <button type="submit" disabled={formError}>Add Club</button>
      </form>
    </div>
  );
};

export default AddClub;
