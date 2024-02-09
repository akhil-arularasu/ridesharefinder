import React, {useState} from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment, Container } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom';
import { InView } from 'react-intersection-observer'
import { Alert, AlertTitle } from '@material-ui/lab'; // Import Alert components

const LoginForm = () => {
    const navigate = useNavigate();
    const [enteredUsername, setUsername] = useState('');
    const [enteredPassword, setPassword] = useState('');
    const [isPending, setIsPending] = useState(false); // Define isPending state
    const [error, setError] = useState(''); // Add an error state
    const [alertType, setAlertType] = useState(''); // State to store the type of alert

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setAlertType(''); // Clear previous alert type
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
                setError('Invalid login credentials'); // Set error message
                setAlertType('error'); // Set alert type to error
            }
        })
        .catch(error => {
          setIsPending(false);
          console.error('Error:', error);
          setError('Network error, please try again later');
          setAlertType('error'); // Set alert type to error
      });
  }
  return (
    <Container>
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' primary textAlign='center'>
            <Image src='/RSF-Logo-Icon.png' alt="RSF Logo" /> TrypSync
          </Header>
          <Form size='large' onSubmit={handleSubmit}>
            <Segment stacked>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='.edu Email Address'
              value={enteredUsername}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ fontSize: '16px' }} // Add this line
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              value={enteredPassword}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ fontSize: '16px' }} // Add this line
            />
              <Button primary fluid size='large'>
                Login
              </Button>
            </Segment>
  
            {/* Conditional rendering of Material-UI alerts */}
            {alertType === 'error' && (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            )}  
            {/* Display error message from Semantic UI */}
            {error && <Message error content={error} />} 
          </Form>
          <Message>
            New to us? <a href='signup'>Sign Up</a>
          </Message>
          <Message>
            Forgot Password? <a href='passwordreset'>Reset Here</a>
          </Message>

        </Grid.Column>
      </Grid>
    </Container>
  );
      }

export default LoginForm