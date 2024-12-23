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
});


export default StepContextCreate;