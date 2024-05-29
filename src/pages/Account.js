import React, { useState, useEffect } from "react";
import validator from 'validator';
import './AccountForm.css';
import { FormField } from 'semantic-ui-react';
import { InView } from 'react-intersection-observer';
import { Dropdown } from 'semantic-ui-react'; // Import Dropdown from Semantic UI React
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

function AccountForm() {
  const initialValues = { name: "", collegeId: "", telNumber: "", collegeName: "" };
  const [showAlert, setShowAlert] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [formValues, setFormValues] = useState(initialValues);
  const [collegeOptions, setCollegeOptions] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const validatePhoneNumber = (number) => {
    return validator.isMobilePhone(number, 'en-US'); // 'en-US' for US phone number format
  };

  useEffect(() => {
    const userToken = localStorage.getItem('token');
    fetch(process.env.REACT_APP_SERVER + '/api/userAccount', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      setFormValues({
        name: data.name,
        collegeId: data.collegeId,
        telNumber: data.telNumber,
        collegeName: data.collegeName
        });
    })
    .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    console.log('Updated formValues:', formValues);
  }, [formValues]);
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleDropdownChange = (event, data) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [data.name]: data.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Clear previous errors
    setFormErrors({});

    // Convert telNumber to a string and validate phone number
    const telNumberStr = String(formValues.telNumber);
    if (!validatePhoneNumber(telNumberStr)) {
      setFormErrors({ ...formErrors, telNumber: "Invalid US phone number format." });
      return; // Stop the form submission
    }

    // API call to update user information
    const userToken = localStorage.getItem('token');
    fetch(process.env.REACT_APP_SERVER + '/api/account', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formValues.name,
        telNumber: formValues.telNumber,
        collegeId: formValues.collegeId,
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        setAlertMessage("Account info updated successfully");
        setAlertSeverity("success");
        setAlertOpen(true);
      }
    })
    .catch(error => {
      console.error('Error updating account:', error);
      setAlertMessage("Error updating account");
      setAlertSeverity("error");
      setAlertOpen(true);
    });
      };

    // Fetch college options
    useEffect(() => {
        const userToken = localStorage.getItem('token');
        fetch(`${process.env.REACT_APP_SERVER}/api/campuses`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
            },
        })
        .then(response => {
          if (response.status === 401) {
            // If unauthorized, redirect to the home page
            navigate('/login');
            return;
          }
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const options = data.map(college => ({
          key: college.id,
          text: college.name,
          value: college.id
          }));
          setCollegeOptions(options);
      })
      .catch(error => console.error('Error fetching colleges:', error));
      }, []);
    
  return (
    <InView>
      <div className="container">
        <div className="account-form-container">
          <form onSubmit={handleSubmit}>
            <h1>Account</h1>
            <div className="ui divider"></div>
            <div className="ui form">
              <div className="field">
                <label>Name: </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formValues.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label>Telephone Number: </label>
                <input
                    type="tel"
                    name="telNumber"
                    placeholder="Telephone #"
                    value={formValues.telNumber}
                    onChange={handleChange}
                    pattern="^\d{10}$"  // Example pattern for a 10-digit phone number
                    title="Phone number should be 10 digits"
                    required
                />
                {formErrors.telNumber && <div className="ui pointing red basic label">
                  {formErrors.telNumber}
                </div>}
                </div>
                <div className="field">
                    <label>Campus: </label>
                <Dropdown
                    placeholder="Select Campus"
                    fluid
                    selection
                    options={collegeOptions}
                    name="collegeId"
                    value={formValues.collegeId}
                    onChange={handleDropdownChange}
                />
                </div>
            <button className="fluid ui button blue">Update</button>
            </div>
          </form>
        </div>
      </div>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={() => setAlertOpen(false)}>
      <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} sx={{ width: '100%' }}>
        {alertMessage}
      </Alert>
    </Snackbar>
</InView>
  );
}

export default AccountForm;
