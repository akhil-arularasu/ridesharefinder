import React, { useState, useEffect } from "react";
import validator from 'validator' 
import './RegistrationForm.css'; // Adjust the path based on your project structure
import { FormField } from 'semantic-ui-react'
import { InView } from 'react-intersection-observer'
import Alert from '@mui/material/Alert'; // Import Alert from Material-UI
import { Grid, Button, Modal, Header, Icon, HeaderContent, Form, Checkbox, Divider, Message } from "semantic-ui-react"; // Import Semantic UI React components


function RegisterForm() {
  
  const initialValues = { name: "", collegeId: "", email: "", password: "", repeatPassword: "", telephone: ""};
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [colleges, setColleges] = useState([]);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

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
            console.log('error', data)
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
    if (!values.email.endsWith('.edu')) {
        errors.email = 'Email address must end with .edu';
    }    
    if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    console.log(values.password.length)
    if (values.password.length < 5) {
      errors.password = "Password cannot be less than 6 characters";
    } else if (values.password.length > 12) {
      errors.password = "Password cannot exceed 12 characters";
    }
    if (values.password !== values.repeatPassword) {
      errors.password = "Passwords must Match!";
    }
    if (validatePhoneNumber(values.telephone) == false) {
      errors.telephone = "Enter a valid US (10 digit) Phone number";
    }
    if (!agreeToTerms) {
      errors.agreeToTerms = "You must agree to the TrypSync terms and conditions";
    }
    console.log('errors final', errors)
    return errors;
  };

  return (
    <div className="registration-form-container">
      {submissionError && <Alert severity="error">{submissionError}</Alert>}
      {Object.keys(formErrors).length === 0 && isSubmit ? (
        <Message success>
          <Message.Header>Signed Up Successfully</Message.Header>
          <p>Check your inbox for a confirmation link. If you do not see the link, be sure to check your spam inbox!</p>
        </Message>
      ) : (
        <pre></pre>
      )}
      {/* Show modal only after successful submission and when there are no errors */}
      {Object.keys(formErrors).length === 0 && isSubmit && (
        <Modal
          open={true}
          onClose={() => setIsSubmit(false)} // Reset isSubmit to hide modal
          size='mini'
          centered={true}
          dimmer='blurring'
        >
          <Header icon>
            <Icon name='archive'/>
            Email Confirmation
          </Header>
          <Modal.Content style={{textAlign: 'center'}}>
            <p>
              You will receive an email with an account confirmation link within the next few minutes. If you did not receive an email, check your <b>Spam Folder</b>!
            </p>
          </Modal.Content>
          <Modal.Actions style={{textAlign: 'center'}}>
            <Button color='green' inverted onClick={() => setIsSubmit(false)}>
              <Icon name='checkmark' /> I understand
            </Button>
          </Modal.Actions>
        </Modal>
      )}

      <div className="registration-form-container">
        <Form onSubmit={handleSubmit}>
          <Divider />
          <Grid stackable columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Form.Field required>
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formValues.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Field>
                <p style={{ color: "red" }}>{formErrors.name}</p>
              </Grid.Column>
              <Grid.Column>
                <Form.Field required>
                  <label>College</label>
                  <select
                    name="collegeId"
                    value={formValues.collegeId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Home Institution</option>
                    {colleges.map((college) => (
                      <option key={college.id} value={college.id}>
                        {college.name}
                      </option>
                    ))}
                  </select>
                </Form.Field>
                <p style={{ color: "red" }}>{formErrors.collegeId}</p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Field required>
                  <label>Email</label>
                  <input
                    type="text"
                    name="email"
                    placeholder=".edu Email Address"
                    value={formValues.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Field>
                <p style={{ color: "red" }}>{formErrors.email}</p>
              </Grid.Column>
              <Grid.Column>
                <Form.Field required>
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formValues.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Field>
                <p style={{ color: "red" }}>{formErrors.password}</p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Field required>
                  <label>Repeat Password</label>
                  <input
                    type="password"
                    name="repeatPassword"
                    placeholder="Repeat Password"
                    value={formValues.repeatPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Field>
              </Grid.Column>
              <Grid.Column>
                <Form.Field required>
                  <label>Telephone Number</label>
                  <input
                    type="number"
                    name="telephone"
                    placeholder="Telephone Number"
                    value={formValues.telephone}
                    onChange={handleChange}
                    id="telephone" // Added ID for accessibility
                    required
                  />
                </Form.Field>
                <p style={{ color: "red" }}>{formErrors.telephone}</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Form.Field required>
          <div>
            <Checkbox
              name="agreeToTerms"
              checked={agreeToTerms}
              onChange={() => setAgreeToTerms(!agreeToTerms)}
              required
            />
            <label htmlFor="agreeToTerms">
            <span style={{ paddingLeft: '10px' }}>I agree to the TrypSync <a href="/trypsyncdisclaimer.pdf" target="_blank" rel="noopener noreferrer">Terms and Conditions</a> including Liability Disclaimer + SMS and Email Consent. </span>
            </label>
          </div>
        </Form.Field>
        <p style={{ color: "red" }}>{formErrors.agreeToTerms}</p>

          <Form.Button fluid primary>
            Submit
          </Form.Button>
        </Form>
      </div>
    </div>
  );
}

export default RegisterForm;