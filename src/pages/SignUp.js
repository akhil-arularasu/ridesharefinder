import { useState, useEffect } from "react";
import validator from 'validator' 
import './RegistrationForm.css'; // Adjust the path based on your project structure

function RegisterForm() {
  const collegeIdMapping = {
    "Emory University": 1,
    "Oxford College of Emory University": 2,
    // Add more mappings as needed
  };
  
  const initialValues = { name: "", college: "", email: "",  password: "",  repeatPassword: "", telephone: ""};
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formValues);
    setFormErrors(validationErrors);

    // Check if there are no errors
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmit(true);
      
      const collegeId = collegeIdMapping[formValues.college];
      const apiData = {
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        repeat_password: formValues.repeatPassword,
        college_id: collegeId, // Using mapped college ID
        telNumber: formValues.telephone
    };
      try {
          const response = fetch('http://localhost:3000/api/register', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(apiData)
          });

          const data = response.json();

          // Handle response data
          console.log("Response data:", data);
          // You might want to redirect the user or update the UI accordingly

      } catch (error) {
          console.error("Error during fetch:", error);
          // Handle network or server errors
      }
  } else {
      setIsSubmit(false);
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
    if (!values.name) {
      errors.name = "Full Name is required!";
    }
    if (!values.college) {
      errors.college = "Selecting a home institution is required";
    }
    if (!values.email) {
      errors.email = "Email is required!";
    }
    else if ((values.college === "Oxford College of Emory University" || values.college === "Emory University") && !values.email.endsWith("@emory.edu")) {
      errors.email = "Email must end with @emory.edu";
    } else if(values.college === "Georgia State University" && !values.email.endsWith("@student.gsu.edu")) {
      errors.email = "Email must end with @student.gsu.edu";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    } else if (values.password.length > 12) {
      errors.password = "Password cannot exceed 12 characters";
    }
    if (!values.repeatPassword) {
      errors.password = "Repeat Password is required";
    } else if (values.password != values.repeatPassword) {
      errors.password = "Passwords must Match!";
    }
    if(!values.telephone) {
      errors.telephone = "Telephone Number is Required";
    } else if (validatePhoneNumber(values.telephone) == false) {
      errors.telephone = "Enter a valid US (10 digit) Phone number";
    }
    if (!values.agreeToTerms) {
      errors.agreeToTerms = "You must agree to the RSF terms and conditions";
    }
    return errors;
  };

  return (
    <div className="container">
      {Object.keys(formErrors).length === 0 && isSubmit ? (
        <div className="ui message success">Signed Up successfully. Check your inbox for confirmation link</div>
      ) : (
        <pre></pre>
      )}

    <div className="registration-form-container">
      <form onSubmit={handleSubmit}>
        <h1>Become an RSF Member</h1>
        <div className="ui divider"></div>
        <div className="ui form">
          <div className="field">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formValues.name}
              onChange={handleChange}
            />
          </div>
          <p>{formErrors.name}</p>
          <div className="field">
          <label>College</label>
          <select
            name="college"
            value={formValues.college}
            onChange={handleChange}
          >
            <option value="">Select Home Institution</option>
            {Object.keys(collegeIdMapping).map((collegeName, index) => (
              <option key={index} value={collegeName}>{collegeName}</option>
            ))}
          </select>
        </div>
        <p>{formErrors.college}</p>
          <div className="field">
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder=".edu Email Address"
              value={formValues.email}
              onChange={handleChange}
            />
          </div>
          <p>{formErrors.email}</p>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formValues.password}
              onChange={handleChange}
            />
          </div>
          <p>{formErrors.password}</p>
          <div className="field">
            <label>Repeat Password</label>
            <input
              type="password"
              name="repeatPassword"
              placeholder="Repeat Password"
              value={formValues.repeatPassword}
              onChange={handleChange}
            />
          </div>
          <p>{formErrors.repeatPassword}</p>

          <div className="field">
            <label>Telephone Number</label>
            <input
              type="number"
              name="telephone"
              placeholder="Telephone Number"
              value={formValues.telephone}
              onChange={handleChange}
              id="telephone"  // Added ID for accessibility
            />
          </div>
          <p>{formErrors.telephone}</p>
          <div className="field">
          <div className="ui checkbox">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formValues.agreeToTerms}
              onChange={handleChange}
            />
            <label>I agree to the terms and conditions.</label>
          </div>
        </div>
        <p>{formErrors.agreeToTerms}</p>
          <button className="fluid ui button blue">Submit</button>
        </div>
      </form>
      </div>
    </div>
  );
}

export default RegisterForm;