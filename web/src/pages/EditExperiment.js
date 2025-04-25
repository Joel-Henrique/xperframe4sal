import React, { useCallback } from 'react';
import { useState, useEffect } from 'react';
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
import EditExperimentICF from './components/EditExperiment/EditExperimentICF';


const EditExperiment = () => {
  const { t } = useTranslation();
  const { experimentId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const step = 0;
  const [ExperimentTitle, setExperimentTitle] = useState('');
  const [ExperimentType, setExperimentType] = useState('');
  const [BtypeExperiment, setBtypeExperiment] = useState('');
  const [ExperimentDesc, setExperimentDesc] = useState('');
  const [Icf, setIcf] = useState('');
  const [ExperimentId, setExperimentId] = useState('');
  const [ExperimentSurveys, setExperimentSurveys] = useState('');
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const CustomConnector = () => <span style={{ display: 'none' }} />;

  useEffect(() => {
    setActiveStep(step);
  }, [step]);

  const steps = [
    { label: t('edit_form'), icon: '📝' },
    { label: t('edit_icf'), icon: '🤵' },
    { label: t('edit_task'), icon: '📋' },
    { label: t('edit_survey'), icon: '❓' },
  ];

  const fetchExperiment = useCallback(async () => {

    try {
      const { data } = await api.get(`/experiments2/${experimentId}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      console.log(data)
      setExperimentId(experimentId);
      setExperimentTitle(data.name || '');
      setExperimentType(data.typeExperiment || '');
      setBtypeExperiment(data.betweenExperimentType || '');
      setExperimentDesc(data.summary || '');
      setIcf(data.icf || '');
    } catch (err) {
      console.error('Error fetching experiment data:', err);
    }
  },[experimentId, user.accessToken]);

  const fetchSurvey = useCallback(async () => {
      try {
          const response = await api.get(`survey2`, {
              //params: { Experimentid: experimentId }, 
              headers: { Authorization: `Bearer ${user.accessToken}` },
          });
          //const filteredsurveys = response.data.filter(survey => survey.Experimentid === ExperimentId); 
          const filteredsurveys = response.data
          setExperimentSurveys(filteredsurveys);
      } catch (error) {
          console.error(t('Error in Search'), error);
      }
  },[user.accessToken])

  useEffect(() => {
    fetchExperiment();
    fetchSurvey();
  }, [fetchExperiment, fetchSurvey()]);

  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom align="center" marginBottom={5}>
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
          ExperimentTitle,
          setExperimentTitle,
          ExperimentType,
          setExperimentType,
          BtypeExperiment,
          setBtypeExperiment,
          ExperimentDesc,
          setExperimentDesc,
          ExperimentId,
          setExperimentId,
          ExperimentSurveys,
          setExperimentSurveys,
          Icf, 
          setIcf,
        ]}
      >
        {/* experimento */}
        {activeStep === 0 && <EditExperimentStep0 />}
         {/*Icf */}
         {activeStep === 1 && <EditExperimentICF />}
        {/* tarefa */}
        {activeStep === 2 && <EditExperimentStep1 />}
        {/* questionario */}
        {activeStep === 3 && <EditExperimentStep2 />}
        
      </StepContext.Provider>
    </>
  );
};

export { EditExperiment };
