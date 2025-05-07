import React, { useCallback, useState, useEffect } from 'react';
import { api } from '../config/axios';
import 'react-quill/dist/quill.snow.css';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer
} from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ListAltIcon from '@mui/icons-material/ListAlt';
import QuizIcon from '@mui/icons-material/Quiz';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import EditExperimentStep0 from './components/EditExperiment/EditExperimentForm';
import EditExperimentStep1 from './components/EditExperiment/EditExperimentTask';
import EditExperimentStep2 from './components/EditExperiment/EditExperimentStep2';
import EditExperimentICF from './components/EditExperiment/EditExperimentICF';
import StepContext from './components/EditExperiment/context/StepContext';

const drawerWidth = 300;
const appBarHeight = 64;

const EditExperiment = () => {
  const { t } = useTranslation();
  const { experimentId } = useParams();
  const [activeStep, setActiveStep] = useState(0);

  const [ExperimentTitle, setExperimentTitle] = useState('');
  const [ExperimentType, setExperimentType] = useState('');
  const [BtypeExperiment, setBtypeExperiment] = useState('');
  const [ExperimentDesc, setExperimentDesc] = useState('');
  const [ExperimentId, setExperimentId] = useState('');
  const [ExperimentSurveys, setExperimentSurveys] = useState('');
  const [user] = useState(JSON.parse(localStorage.getItem('user')));

  const steps = [
    { label: t('edit_form'), icon: <EditNoteIcon /> },
    { label: t('edit_icf'), icon: <AssignmentIndIcon /> },
    { label: t('edit_task'), icon: <ListAltIcon /> },
    { label: t('edit_survey'), icon: <QuizIcon /> },
  ];

  const fetchExperiment = useCallback(async () => {
    try {
      const { data } = await api.get(`/experiments2/${experimentId}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setExperimentId(experimentId);
      setExperimentTitle(data.name || '');
      setExperimentType(data.typeExperiment || '');
      setBtypeExperiment(data.betweenExperimentType || '');
      setExperimentDesc(data.summary || '');
    } catch (err) {
      console.error('Error fetching experiment data:', err);
    }
  }, [experimentId, user.accessToken]);

  const fetchSurvey = useCallback(async () => {
    try {
      const response = await api.get(`survey2`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setExperimentSurveys(response.data);
    } catch (error) {
      console.error(t('Error in Search'), error);
    }
  }, [user.accessToken]);

  useEffect(() => {
    fetchExperiment();
    fetchSurvey();
  }, [fetchExperiment, fetchSurvey]);

  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            top: appBarHeight,
            height: `calc(100% - ${appBarHeight}px)`,
            boxShadow: 3,
            backgroundColor: '#f9f9f9',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        <List>

          <Typography
            sx={{ ml: 3, mt: 0, mb: 2, fontSize: 14, color: '#666' }}
          >
            {t('')}
          </Typography>

          {steps.map((step, index) => (
            <ListItemButton
              key={step.label}
              selected={index === activeStep}
              onClick={() => handleStepClick(index)}
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                backgroundColor: index === activeStep ? 'primary.light' : 'transparent',
                '&:hover': {
                  backgroundColor: index === activeStep ? 'primary.light' : '#f0f0f0',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#333' }}>{step.icon}</ListItemIcon>
              <ListItemText primary={step.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <StepContext.Provider
          value={[
            ExperimentTitle, setExperimentTitle,
            ExperimentType, setExperimentType,
            BtypeExperiment, setBtypeExperiment,
            ExperimentDesc, setExperimentDesc,
            ExperimentId, setExperimentId,
            ExperimentSurveys, setExperimentSurveys,
          ]}
        >
          {activeStep === 0 && <EditExperimentStep0 />}
          {activeStep === 1 && <EditExperimentICF />}
          {activeStep === 2 && <EditExperimentStep1 />}
          {activeStep === 3 && <EditExperimentStep2 />}
        </StepContext.Provider>
      </Box>
    </Box>
  );
};

export { EditExperiment };
