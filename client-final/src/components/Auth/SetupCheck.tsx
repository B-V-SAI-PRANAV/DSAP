import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInitialSetupStatus } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface SetupCheckProps {
  children: React.ReactNode;
}

const SetupCheck: React.FC<SetupCheckProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedSetup, setHasCompletedSetup] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'admin') {
      setHasCompletedSetup(true);
      setIsLoading(false);
    } else {
      checkSetupStatus();
    }
  }, [user]);

  const checkSetupStatus = async () => {
    try {
      const status = await getInitialSetupStatus();
      setHasCompletedSetup(status.completed);
      if (!status.completed) {
        navigate('/known-topics');
        return;
      }
    } catch (error) {
      console.error('Failed to check setup status:', error);
      navigate('/known-topics');
      return;
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking your setup...</p>
        </div>
      </div>
    );
  }

  if (hasCompletedSetup) {
    return <>{children}</>;
  }

  return null;
};

export default SetupCheck; 