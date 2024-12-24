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
import CreateExperimentStep1 from './components/CreateExperiment/CreateExperimentStep1';
import CreateExperimentStep2 from './components/CreateExperiment/CreateExperimentStep2';
import StepContext from './components/CreateExperiment/context/StepContextCreate';



const CreateExperiment = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [ExperimentTitle, setExperimentTitle] = useState('');
  const [ExperimentType, setExperimentType] = useState('within-subject');
  const [BtypeExperiment, setBtypeExperiment] = useState('random');
  const [ExperimentDesc, setExperimentDesc] = useState('');
  const [ExperimentTasks, setExperimentTasks] = useState([]);
  const [ExperimentSurveys, setExperimentSurveys] = useState([]);
  const [selectedSurveys, setSelectedSurveys] = useState([]);
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
          ExperimentTasks,
          setExperimentTasks,
          ExperimentSurveys,
          setExperimentSurveys,
          selectedSurveys,
          setSelectedSurveys,
        }}
      >
        {activeStep === 0 && <CreateExperimentStep0 />}
        {activeStep === 1 && <CreateExperimentStep1 />}
        {activeStep === 2 && <CreateExperimentStep2 />}
      </StepContext.Provider>

    </>
  );
};

export { CreateExperiment };
