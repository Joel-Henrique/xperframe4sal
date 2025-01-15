import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { api } from '../config/axios';
import 'react-quill/dist/quill.snow.css';

import {
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditExperimentStep0 from './components/EditExperiment/EditExperimentStep0';
import EditExperimentStep1 from './components/EditExperiment/EditExperimentStep1';
import EditExperimentStep2 from './components/EditExperiment/EditExperimentStep2';
import StepContext from './components/EditExperiment/context/StepContext';
import { useParams } from 'react-router-dom';


const EditExperiment = () => {
  const { t } = useTranslation();
  const { experimentId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [step, setStep] = useState(0);
  const [ExperimentTitle, setExperimentTitle] = useState('');
  const [ExperimentType, setExperimentType] = useState('');
  const [BtypeExperiment, setBtypeExperiment] = useState('');
  const [ExperimentDesc, setExperimentDesc] = useState('')
  const [ExperimentId, setExperimentId] = useState('');;

  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const CustomConnector = () => <span style={{ display: 'none' }} />;
  useEffect(() => {
    setActiveStep(step);
  }, [step]);
  const steps = [
    { label: t('edit_form'), icon: '📝' },
    { label: t('edit_task'), icon: '📋' },
    { label: t('edit_survey'), icon: '❔' },
  ];

  const fetchExperiment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.get(`/experiments/${experimentId}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      setExperimentId(experimentId);
      setExperimentTitle(data.name || '');
      setExperimentType(data.typeExperiment || '');
      setBtypeExperiment(data.betweenExperimentType || '');
      setExperimentDesc(data.summary || '');
    } catch (err) {
      console.error('Error fetching experiment data:', err);
      setError('Error fetching the experiment');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiment();
  }, [experimentId, user.accessToken]);

  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {t('edit_experiment')}
      </Typography>

      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<CustomConnector />}
      >
        {steps.map((step, index) => (
          <Step
            key={step.label}
            onClick={() => handleStepClick(index)}
            sx={{
              cursor: 'pointer',
              '& .MuiStepLabel-root': {
                color: index === activeStep ? 'primary.main' : 'text.disabled',
                textDecoration: 'none', 
              },
              '& .MuiStepIcon-root': {
                color: index === activeStep ? 'primary.main' : 'text.disabled',
              },
              '&:hover .MuiStepLabel-root': {
                textDecoration: 'none', 
              },
            }}
          >
            <StepLabel
              icon={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: index === activeStep ? 'primary.main' : 'grey.300',
                    color: index === activeStep ? 'white' : 'black',
                    fontSize: '1.5rem',
                    marginBottom: 1,
                  }}
                >
                  {step.icon}
                </Box>
              }
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <StepContext.Provider
        value={[
          step,
          setStep,
          ExperimentTitle,
          setExperimentTitle,
          ExperimentType,
          setExperimentType,
          BtypeExperiment,
          setBtypeExperiment,
          ExperimentDesc,
          setExperimentDesc,
          ExperimentId,
        ]}
      >
        {/* experimento */}
        {activeStep === 0 && <EditExperimentStep0 />}
        {/* tarefa */}
        {activeStep === 1 && <EditExperimentStep1 />}
        {/* questionario */}
        {activeStep === 2 && <EditExperimentStep2 />}
      </StepContext.Provider>
    </>
  );
};

export { EditExperiment };
