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
import CreateExperimentStep3 from './components/CreateExperiment/CreateExperimentStep3';
import CreateExperimentStep4 from './components/CreateExperiment/CreateExperimentStep4';

const CreateExperiment = () => {
  const { t } = useTranslation();
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [ExperimentTitle, setExperimentTitle] = useState('');
  const [ExperimentType, setExperimentType] = useState('within-subject');
  const [BtypeExperiment, setBtypeExperiment] = useState('random');
  const [ExperimentDesc, setExperimentDesc] = useState('');
  const [ExperimentTasks, setExperimentTasks] = useState([]);
  const [ExperimentSurveys, setExperimentSurveys] = useState([]);
  const [ExperimentUsers, setExperimentUsers] = useState([]);
  const [isLoadingExp, setIsLoadingExp] = useState(false);
  const [ActiveStep, setActiveStep] = useState();
  const [step, setStep] = useState(0);


  useEffect(() => {
    setActiveStep(step);
  }, [step]);

  const steps = [t('step_1'), t('step_2'), t('step_3'), t('step_4'), t('step_5')];

  const handleCreateExperiment = async () => {
    try {
      setIsLoadingExp(true);
      await api.post(
        `/experiments`,
        {
          ownerId: user.id,
          name: ExperimentTitle,
          summary: ExperimentDesc,
          typeExperiment: ExperimentType,
          betweenExperimentType: BtypeExperiment,
          surveysProps: ExperimentSurveys,
          tasksProps: ExperimentTasks,
          userProps: ExperimentUsers,
        },
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
  
      setExperimentTitle('');
      setExperimentDesc('');
      setExperimentTasks([]);
      setExperimentSurveys([]);
      setExperimentUsers([]);
      setStep(0);  
  
    } catch (error) {
      console.error(t('Error creating experiment'), error);
    } finally {
      setIsLoadingExp(false);
    }
  };
  
  useEffect(() => {
    if (step === 5) {
      handleCreateExperiment();
    }
  }, [step]);  
  
  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {t('Experiment_create')}
      </Typography>
      <Stepper activeStep={step} alternativeLabel>
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
          ExperimentUsers,
          setExperimentUsers,
        }}
      >
        {step === 0 && <CreateExperimentStep0 />}
        {step === 1 && <CreateExperimentStep1 />}
        {step === 2 && <CreateExperimentStep2 />}
        {step === 3 && <CreateExperimentStep3 />}
        {step === 4 && <CreateExperimentStep4 />}
      </StepContext.Provider>
    </>
  );
};


export { CreateExperiment };
