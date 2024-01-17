import React, { useState } from 'react';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setMessage(''); // Clear previous message
  
      try {
        const response = await fetch(process.env.REACT_APP_SERVER + '/api/reset_password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || 'Error occurred while sending reset link.');
        }
  
        setMessage('Reset link sent. Please check your email.');
      } catch (error) {
        setMessage(error.message);
      }
    };
  
    return (
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' primary textAlign='center'>
            <Image src='/RSF-Logo-Icon.png' alt="RSF Logo" /> RideShareFinder
          </Header>
          <Form size='large' onSubmit={handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                icon='user'
                iconPosition='left'
                placeholder='@edu Email Address'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button primary fluid size='large'>
                Get Password Reset Link
              </Button>
            </Segment>
          </Form>
          {message && <Message>{message}</Message>}
        </Grid.Column>
      </Grid>
    );
  };
  
  export default PasswordReset;
  