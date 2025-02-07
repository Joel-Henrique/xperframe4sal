import React, { createContext } from 'react';
const StepContextCreate = createContext({
    step: 0,
    setStep: () => {},
    ExperimentTitle: '',
    setExperimentTitle: () => {},
    ExperimentType: '',
    setExperimentType: () => {},
    BtypeExperiment: '',
    setBtypeExperiment: () => {},
    ExperimentDesc: '',
    setExperimentDesc: () => {},
    ExperimentTasks: [],
    setExperimentTasks: () => {},
    ExperimentSurveys: [],
    setExperimentSurveys: () => {},
    ExperimentUsers: [],
    setExperimenUsers: () => {},
});


export default StepContextCreate;