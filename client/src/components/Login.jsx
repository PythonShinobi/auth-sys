// client/src/components/Login.jsx
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
  useToast,
} from '@chakra-ui/react';

import { AuthContext } from '../context/AuthContext';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const handleLogin = async (event) => {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const loginData = {
      email: data.get('email'),
      password: data.get('password'),
    };
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/login', loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
    
      const { user, session_token, message } = response.data;

      const expires = new Date(response.data.expires_at).toUTCString();
      document.cookie = `session_token=${session_token}; path=/; expires=${expires}; SameSite=Strict; Secure;`;
    
      login(user);
      toast({
        title: 'Login successful.',
        description: message || "You've successfully logged in.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    
      navigate('/');
      setErrorMessage(''); // Clear error message on successful login
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'An error occurred during login.';
      setErrorMessage(errorMsg); // Set error message
      toast({
        title: 'Login failed.',
        description: errorMsg,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box width="400px" mx="auto" mt="100px" p={5} borderWidth={1} borderRadius="lg">
      <Text fontSize="2xl" textAlign="center" mb={4}>
        Login
      </Text>
      <form onSubmit={handleLogin}>
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" name="email" type="email" placeholder="Enter your email" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input id="password" name="password" type="password" placeholder="Enter your password" />
          </FormControl>
          <Button colorScheme="teal" type="submit">
            Login
          </Button>
          {errorMessage && ( // Render error message if it exists
            <Text color="red" mt={2}> {/* Style the message in red */}
              {errorMessage}
            </Text>
          )}
        </Stack>
      </form>
    </Box>
  );
};

export default LoginForm;