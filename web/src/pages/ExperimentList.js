import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const ExperimentList = () => {
  const { t } = useTranslation();

  return (
      <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.0rem', sm: '1.2rem', marginBottom: 30 } }}>
        {t('experiment_list')}
      </Typography>

  );
};

export { ExperimentList };