import React, { useState } from 'react';
import { Modal, Icon, Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmit, setIsSubmit] = useState(false); // State to control modal visibility

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
        setIsSubmit(true); // Show modal on successful submission
      } catch (error) {
        setMessage(error.message);
        setIsSubmit(false); // Ensure modal doesn't show on error

      }
    };
  
    return (
      <Grid textAlign='center' style={{ height: '70vh', paddingTop: '5vh' }} verticalAlign='middle'> {/* Reduce the vertical space */}
        <Grid.Column style={{ maxWidth: 550 }}>
          <Header as='h2' primary textAlign='center'>
            <Image src='/RSF-Logo-Icon.png' alt="RSF Logo" /> TrypSync
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

                    {isSubmit && (
            <Modal
              open={true}
              onClose={() => setIsSubmit(false)}
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
                  You will receive an email with a password reset link within the next few minutes. If you did not receive an email, check your <b>Spam Folder</b> and mark it as 'Not Spam' for the future!
                </p>
              </Modal.Content>
              <Modal.Actions style={{textAlign: 'center'}}>
                <Button color='green' inverted onClick={() => setIsSubmit(false)}>
                  <Icon name='checkmark' /> I understand
                </Button>
              </Modal.Actions>
            </Modal>
          )}

        </Grid.Column>
      </Grid>
    );
  };
  
  export default PasswordReset;
  