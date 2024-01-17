import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Grid, Image, Header, Segment, Message } from 'semantic-ui-react';

const PasswordResetFinal = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch(process.env.REACT_APP_SERVER + `/api/reset_password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            if (!response.ok) {
                throw new Error('Failed to reset password. Please try again.');
            }

            setSuccess('Password reset successfully. Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000); // Redirect to login page after 3 seconds
        } catch (error) {
            setError(error.message);
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
                            icon='lock'
                            iconPosition='left'
                            placeholder='New Password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Confirm New Password'
                            type='password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button primary fluid size='large'>
                            Reset Password
                        </Button>
                    </Segment>
                </Form>
                {error && <Message error content={error} />}
                {success && <Message success content={success} />}
            </Grid.Column>
        </Grid>
    );
};

export default PasswordResetFinal;
