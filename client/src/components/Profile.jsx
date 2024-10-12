// client/src/components/Profile.jsx
import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Retrieve the user data from local storage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.username) {
      setUsername(storedUser.username); // Set the username if it exists
    }
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Hello, {username ? username : 'User'}!</h1>
      {/* You can add more user profile information here */}
    </div>
  );
};

export default Profile;