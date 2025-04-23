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
import CreateExperimentStep4 from './components/CreateExperiment/CreateExperimentStep4';
import { useNavigate } from 'react-router-dom';

const CreateExperiment = () => {
  const { t } = useTranslation();
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [ExperimentTitle, setExperimentTitle] = useState('');
  const [ExperimentType, setExperimentType] = useState('within-subject');
  const [BtypeExperiment, setBtypeExperiment] = useState('random');
  const [ExperimentDesc, setExperimentDesc] = useState('');
  const [ExperimentTasks, setExperimentTasks] = useState([]);
  const [ExperimentSurveys, setExperimentSurveys] = useState([]);
  const [ScoreThreshold, setScoreThreshold] = useState('');
  const [SelectedSurvey, setSelectedSurvey] = useState('');

  const [isLoadingExp, setIsLoadingExp] = useState(false);
  const [ActiveStep, setActiveStep] = useState();
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setActiveStep(step);
  }, [step]);

  const steps = [t('step_1'), t('step_3'), t('step_2'), t('step_5')];

  const handleCreateExperiment = async () => {
    try {
      setIsLoadingExp(true);
      await api.post(
        `/experiments2`,
        {
          ownerId: user.id,
          name: ExperimentTitle,
          summary: ExperimentDesc,
          typeExperiment: ExperimentType,
          betweenExperimentType: BtypeExperiment,
          surveysProps: ExperimentSurveys,
          tasksProps: ExperimentTasks,
        },
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
  
      navigate('/experiments');
  
    } catch (error) {
      console.error(t('Error creating experiment'), error);
    } finally {
      setIsLoadingExp(false);
    }
  };
  
  useEffect(() => {
    if (step === 4) {
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
          SelectedSurvey,
          setSelectedSurvey,
          ScoreThreshold,
          setScoreThreshold,
          ExperimentDesc,
          setExperimentDesc,
          ExperimentTasks,
          setExperimentTasks,
          ExperimentSurveys,
          setExperimentSurveys,
        }}
      >
        {step === 0 && <CreateExperimentStep0 />}
        {step === 2 && <CreateExperimentStep1 />}
        {step === 1 && <CreateExperimentStep2 />}
        {step === 3 && <CreateExperimentStep4 />}
      </StepContext.Provider>
    </>
  );
};


export { CreateExperiment };
