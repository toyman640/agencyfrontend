import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { logInUser } from '../redux/user/userSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loading, user, loginStatus, error,
  } = useSelector((state) => state.user);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  // const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const userInfo = {
      email,
      password,
    };
    dispatch(logInUser(userInfo));
  };

  useEffect(() => {
    if (user && loginStatus && loginStatus.status === 200) {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate('/dashboard');
      }, 2000);
    }
    if (error) {
      console.log('Login Error:', error);
    }
  }, [user, loginStatus, error, navigate]);

  return (
    <div>
      <h2>Login Page</h2>
      <Form onSubmit={handleSubmit}>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {/* {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>} */}
        {showSuccessMessage && <div style={{ color: 'green' }}>Login successful! Redirecting...</div>}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Form.Text className="text-muted">
            We will never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Form>

      <p>
        New user? sign up here
        <Link to="/sign-up-agency-account">
          Sign up here
        </Link>
      </p>

    </div>
  );
};

export default Login;
