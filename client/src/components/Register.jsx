// client/src/components/Register.jsx
import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';

import { AuthContext } from '../context/AuthContext'; // Import your AuthContext

const RegisterForm = () => {
  const { login } = useContext(AuthContext); // Get the login function from context
  const navigate = useNavigate();
  
  // State to handle success or error messages
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleRegister = async (event) => {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const registerData = {
      username: data.get('username'),
      email: data.get('email'),
      password: data.get('password'),
    };

    try {
      // Make a POST request to your registration API
      const response = await axios.post('http://127.0.0.1:5000/api/register', registerData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Ensure cookies are included in requests
      });

      // If registration is successful, get the session token and set it as a cookie
      const { user, session_token, message } = response.data; // Adjust based on your API response structure
      
      // Set the session token cookie with appropriate flagsd
      const expires = new Date(response.data.expires_at).toUTCString();
      document.cookie = `session_token=${session_token}; path=/; expires=${expires}; SameSite=Strict; Secure;`;

      login(user); // Call login with user data

      // Display the success message
      setMessage(message);
      setMessageType('success');

      // Optionally redirect after registration
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An error occurred during registration.';
      // Display the error message
      setMessage(errorMessage);
      setMessageType('error');
    }
  };

  return (
    <Box width="400px" mx="auto" mt="100px" p={5} borderWidth={1} borderRadius="lg">
      <Text fontSize="2xl" textAlign="center" mb={4}>
        Register
      </Text>
      
      {/* Display success or error message */}
      {message && (
        <Box
          bg={messageType === 'success' ? 'green' : 'red'}
          color={messageType === 'success' ? 'white' : 'white'}
          p={3}
          mb={4}
          borderRadius="md"
        >
          {message}
        </Box>
      )}

      <form onSubmit={handleRegister}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input id="username" name="username" placeholder="Enter your username" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" name="email" type="email" placeholder="Enter your email" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input id="password" name="password" type="password" placeholder="Enter your password" />
          </FormControl>
          <Button colorScheme="teal" type="submit">
            Register
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default RegisterForm;