import React from 'react';
import ProfileSettings from '../components/forms/ProfileSettings';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto py-8">
        <ProfileSettings />
      </div>
    </div>
  );
};

export default ProfilePage;