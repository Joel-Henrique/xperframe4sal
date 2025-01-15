import React, { createContext } from 'react';
const StepContext = createContext({
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
    ExperimentId: '',
});


export default StepContext;