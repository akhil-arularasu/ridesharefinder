import { useState, useEffect } from "react";
import validator from 'validator' 
import './RegistrationForm.css'; // Adjust the path based on your project structure
import { FormField } from 'semantic-ui-react'
import { InView } from 'react-intersection-observer'
import Alert from '@mui/material/Alert'; // Import Alert from Material-UI


function RegisterForm() {
  
  const initialValues = { name: "", collegeId: "", email: "", password: "", repeatPassword: "", telephone: ""};
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_SERVER + '/api/colleges');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const collegesData = await response.json();
      setColleges(collegesData);
    } catch (error) {
      console.error('Failed to fetch colleges:', error);
      // Optionally, update the UI to inform the user of the error
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleCollegeChange = (e) => {
    const selectedCollegeName = e.target.value;
    const selectedCollege = colleges.find(college => college.name === selectedCollegeName);
    setFormValues({ ...formValues, collegeId: selectedCollege ? selectedCollege.id : "" });
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormErrors({});
      setSubmissionError(""); // Reset previous submission errors
      setIsSubmit(false); // Reset submission state
    
      const validationErrors = validate(formValues);
      if (Object.keys(validationErrors).length === 0) {
        const apiData = {
          name: formValues.name,
          email: formValues.email,
          password: formValues.password,
          repeat_password: formValues.repeatPassword,
          college_id: formValues.collegeId, // Use the collegeId from the state
          telNumber: formValues.telephone
        };
    
        try {
          const response = await fetch(process.env.REACT_APP_SERVER + '/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiData)
          });
    
          const data = await response.json();
          
          if (!response.ok) {
            // Use the error message from the response
            console.log('erorr', data)
            throw new Error(data.error);
          }
    
          // If registration is successful
          console.log("Response data:", data);
          setIsSubmit(true); // Indicate successful submission
        } catch (error) {
          setSubmissionError(error.message); // Set the error message for display
        }
      } else {
        setFormErrors(validationErrors);
      }
    };

  const validatePhoneNumber = (number) => {
    return validator.isMobilePhone(number, 'en-US'); // 'en-US' for US phone number format
  };
    
  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
  }, [formErrors]);
  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    console.log(values.password.length)
    if (values.password.length < 5) {
      errors.password = "Password cannot be less than 6 characters";
    } else if (values.password.length > 12) {
      errors.password = "Password cannot exceed 12 characters";
    }
    if (values.password != values.repeatPassword) {
      errors.password = "Passwords must Match!";
    }
    if (validatePhoneNumber(values.telephone) == false) {
      errors.telephone = "Enter a valid US (10 digit) Phone number";
    }
    if (!values.agreeToTerms) {
      errors.agreeToTerms = "You must agree to the RSF terms and conditions";
    }
    console.log('errors final', errors)
    return errors;
  };

  return (
    <InView >
    <div className="container">
      {submissionError && (
        <Alert severity="error">{submissionError}</Alert>
      )}
      {Object.keys(formErrors).length === 0 && isSubmit ? (
        <div className="ui message success">Signed Up successfully. Check your inbox for confirmation link</div>
      ) : (
        <pre></pre>
      )}

    <div className="registration-form-container">
      <form onSubmit={handleSubmit}>
        <div className="ui divider"></div>
        <div className="ui form">
        <div className="field form-row">
          <FormField required>
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formValues.name}
              onChange={handleChange}
              required
            />
           </FormField>
           <p style={{ color: 'red' }}>{formErrors.name}</p>
          </div>
          <p>{formErrors.name}</p>
          <div className="field">
          <FormField required>
          <label>College</label>
            <select
              name="college"
              value={formValues.college}
              onChange={handleCollegeChange}
              required
            >
              <option value="">Select Home Institution</option>
              {colleges.map((college) => (
                <option key={college.id} value={college.name}>{college.name}</option>
              ))}
            </select>
          </FormField>
          <p style={{ color: 'red' }}>{formErrors.name}</p>
        </div>
        <p>{formErrors.college}</p>
          <div className="field">
          <FormField required>
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder=".edu Email Address"
              value={formValues.email}
              onChange={handleChange}
              required
            />
          </FormField>
          <p style={{ color: 'red' }}>{formErrors.email}</p>
          </div>
          <p>{formErrors.email}</p>
          <div className="field">
          <FormField required>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formValues.password}
              onChange={handleChange}
              required  
            />
           </FormField>
           <p style={{ color: 'red' }}>{formErrors.password}</p>
          </div>
          <div className="field">
          <FormField required>
            <label>Repeat Password</label>
            <input
              type="password"
              name="repeatPassword"
              placeholder="Repeat Password"
              value={formValues.repeatPassword}
              onChange={handleChange}
              required
            />
          </FormField>
          </div>
          <div className="field">
          <FormField required>
            <label>Telephone Number</label>
            <input
              type="number"
              name="telephone"
              placeholder="Telephone Number"
              value={formValues.telephone}
              onChange={handleChange}
              id="telephone"  // Added ID for accessibility
              required
            />
            </FormField>
            <p style={{ color: 'red' }}>{formErrors.telephone}</p>
          </div>
          <FormField required>
          <div className="field">
          <div className="ui checkbox">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formValues.agreeToTerms}
              onChange={handleChange}
              required
            />
            <label>I agree to the terms and conditions.</label>
          </div>
        </div>
        </FormField>
        <p style={{ color: 'red' }}>{formErrors.name}</p>
        <p>{formErrors.agreeToTerms}</p>
          <button className="fluid ui button blue">Submit</button>
        </div>
      </form>
      </div>
    </div>
    </InView>
  );
}

export default RegisterForm;