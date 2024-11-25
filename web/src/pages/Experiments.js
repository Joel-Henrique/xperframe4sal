import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Experiments = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    console.log('Usuário carregado:', storedUser);
    if (storedUser) {
      if (storedUser.pesquisador !== undefined) {
        if (storedUser.pesquisador) {
          navigate('/Researcher');
        } else {
          navigate('/NotResearcher');
        }
      } else {
        navigate('/NotResearcher');
      }
    }
  }, [navigate]); 

  return null; 
};

export { Experiments };
