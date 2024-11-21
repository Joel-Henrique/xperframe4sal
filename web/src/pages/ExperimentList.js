import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../config/axios';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ExperimentList = () => {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const { t } = useTranslation();

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

export { ExperimentList };
