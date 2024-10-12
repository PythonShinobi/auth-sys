// client/src/components/Home.jsx
import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Image,
} from '@chakra-ui/react';

const HomePage = () => {
  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={6} align="start">
        <Heading as="h1" size="2xl" textAlign="center">
          Welcome to Developer Path
        </Heading>
        <Text fontSize="lg" textAlign="center">
          Your guide to a successful career in tech. Explore resources, career paths, and much more!
        </Text>
        <Box textAlign="center">
          <Image 
            src="https://via.placeholder.com/600" 
            alt="Tech Careers"
            borderRadius="md"
          />
        </Box>
        <VStack spacing={4}>
          <Text fontSize="lg">
            Join our community of learners and professionals who are committed to achieving success in their tech careers.
          </Text>
          <Button colorScheme="teal" size="lg" href="/register">
            Get Started
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
};

export default HomePage;