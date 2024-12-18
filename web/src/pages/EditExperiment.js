import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { api } from '../config/axios';
import {
  Typography,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditExperimentStep0 from './components/EditExperiment/EditExperimentStep0';
import EditExperimentStep1 from './components/EditExperiment/EditExperimentStep1';
import EditExperimentStep2 from './components/EditExperiment/EditExperimentStep2';
import EditExperimentStep3 from './components/EditExperiment/EditExperimentStep3';
import StepContext from './components/EditExperiment/context/StepContext';
import { useParams } from 'react-router-dom';


const EditExperiment = () => {
  const { t } = useTranslation();
  const { experimentId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const [activeStep, setActiveStep] = useState(0);
  const [step, setStep] = useState(0);

  const [Experiment , setExperiment] = useState({});
  const [ExperimentTitle, setExperimentTitle] = useState('');
  const [ExperimentType, setExperimentType] = useState('');
  const [BtypeExperiment, setBtypeExperiment] = useState('');
  const [ExperimentDesc, setExperimentDesc] = useState('');
  const [user] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    setActiveStep(step);
  }, [step]);

  const fetchExperiment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await api.get(`/experiments/${experimentId}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });

      setExperiment(data);
      setExperimentTitle(data.name || '');
      setExperimentType(data.typeExperiment || '');
      setBtypeExperiment(data.betweenExperimentType || '');
      setExperimentDesc(data.summary || '');
      
      console.log("Experiment Title:", data.title);
      console.log("Data fetched successfully");
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
  
  
  const steps = [t('step_1'), t('step_2'), t('step_3'), t('step_5')];

  return (
    <>
    
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {t('edit_experiment')}
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
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
        ]}
      >
        {/* experimento */}
        {activeStep === 0 && <EditExperimentStep0 />}
        {/* tarefa */}
        {activeStep === 1 && <EditExperimentStep1 />}
        {/* questionario */}
        {activeStep === 2 && <EditExperimentStep2 />}
        {/* revisao */}
        {activeStep === 3 && <EditExperimentStep3 />}
      </StepContext.Provider>
    </>
  );
};

export { EditExperiment };
