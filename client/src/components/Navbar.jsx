// client/src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  HStack,
  Spacer,
} from '@chakra-ui/react';

import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);  

  const handleLogout = async () => {
    try {      
      logout();
    } catch (error) {
      console.error('Logout failed:', error.response.data);
    }            
  };

  return (
    <Box color="white" px={4}>
      <Flex h={16} alignItems="center">
        <Button as={RouterLink} to="/" variant="ghost">
          Developer Path
        </Button>
        <Spacer />
        <HStack spacing={4}>
          {isAuthenticated ? (
            <>
              <Button as={RouterLink} to="/profile" variant="ghost">
                Profile
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={RouterLink} to="/register" variant="ghost">
                Register
              </Button>
              <Button as={RouterLink} to="/login" variant="ghost">
                Login
              </Button>
            </>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;