// client/src/App.js
import React, { memo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from "./components/Home";
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute'; 
import ProtectedProfileRoute from './components/ProtectedProfileRoute'; // Import the new ProtectedProfileRoute
import Profile from './components/Profile'; // Import the Profile component

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route 
              path='/register' 
              element={
                <ProtectedRoute>
                  <Register />
                </ProtectedRoute>
              } 
            />
            <Route 
              path='/login' 
              element={
                <ProtectedRoute>
                  <Login />
                </ProtectedRoute>
              } 
            />
            <Route 
              path='/profile' 
              element={
                <ProtectedProfileRoute>
                  <Profile />
                </ProtectedProfileRoute>
              } 
            />
          </Routes>          
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default memo(App);