import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Experiments = () => {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    if (user) {
      if (user.pesquisador) {
        navigate('/Researcher'); 
      } else {
        navigate('/NotResearcher'); 
      }
    
    }
  }, [user, navigate]);

};

export { Experiments };
