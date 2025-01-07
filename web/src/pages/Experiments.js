import React, { useEffect, useState } from 'react';
import Researcher from './components/Researcher';
import NotResearcher from './components/NotResearcher';


const Experiments = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const renderContent = () => {
    if (user?.pesquisador) {
      return <Researcher />;
    }
    return <NotResearcher />;
  };

  return <div>{user ? renderContent() : <p></p>}</div>;
};

export { Experiments };
