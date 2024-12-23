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
import CreateExperimentStep0 from './components/CreateExperiment/CreateExperimentStep0';
import StepContext from './components/CreateExperiment/context/StepContextCreate';



const CreateExperiment = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [ExperimentTitle, setExperimentTitle] = useState('');
  const [ExperimentType, setExperimentType] = useState('within-subject');
  const [BtypeExperiment, setBtypeExperiment] = useState('random');
  const [ExperimentDesc, setExperimentDesc] = useState('');
  const [step, setStep] = useState(0);


  useEffect(() => {
    setActiveStep(step);
  }, [step]);

  const steps = [t('step_1'), t('step_2'), t('step_3'), t('step_4'), t('step_5')];

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {t('Experiment_create')}
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <StepContext.Provider
        value={{
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
        }}
      >
        {activeStep === 0 && <CreateExperimentStep0 />}

      </StepContext.Provider>

    </>
  );
};

export { CreateExperiment };
