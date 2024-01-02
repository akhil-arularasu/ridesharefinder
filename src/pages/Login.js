import React, {useState} from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar"
import { InView } from 'react-intersection-observer'

const LoginForm = () => {
    const navigate = useNavigate();
    const [enteredUsername, setUsername] = useState('');
    const [enteredPassword, setPassword] = useState('');
    const [isPending, setIsPending] = useState(false); // Define isPending state
    const [error, setError] = useState(''); // Add an error state

    const handleSubmit = (e) => {
        e.preventDefault()
        setError(''); // Clear previous errors
       
        setIsPending(true);
        const userInfo = { 
            email: enteredUsername,
            password: enteredPassword };
        fetch(process.env.REACT_APP_SERVER + '/api/login', {
            method: 'POST',
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify(userInfo)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Current error message:", error); // Check if the error state is updated
            setIsPending(false); // Set isPending to false after fetch completes
            if (data.access_token) {
                localStorage.setItem('token', data.access_token); // Store the token
                console.log('Login successful');
                navigate('/dashboard'); // Redirect to Dashboard
            } else if (data.error) {
                console.error('Error:', data.error);
                // Handle error (show message to user, etc.)
            }
        })
        .catch(error => {
            setIsPending(false); // Set isPending to false even if there's an error
            console.error('Error:', error);
            // Handle network error (show message to user, etc.)
        });
    }
    return (
    <InView >
      <Navbar/>
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
      <Header as='h2' primary textAlign='center'>
      <Image src='/RSF-Logo-Icon.png' alt="RSF Logo" /> RideShareFinder
      </Header>
      <Form size='large' onSubmit={handleSubmit}>
        <Segment stacked>
          <Form.Input fluid icon='user' iconPosition='left' placeholder='.edu Email Address'           
          value = {enteredUsername}
          onChange={(e) => setUsername(e.target.value)}
          required
          />
          <Form.Input
            fluid
            icon='lock'
            iconPosition='left'
            placeholder='Password'
            type='password'
            value = {enteredPassword}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button primary fluid size='large'>
            Login
          </Button>
        </Segment>
        {error && <Message error content={error} />} {/* Display error message */}
      </Form>
      <Message>
        New to us? <a href='signUp'>Sign Up</a>
      </Message>
    </Grid.Column>
  </Grid>
  </InView>
);
    }

export default LoginForm