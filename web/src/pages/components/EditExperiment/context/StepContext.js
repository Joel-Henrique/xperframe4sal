import React, { createContext } from 'react';
const StepContext = createContext({
    ExperimentTitle: '',
    setExperimentTitle: () => {},
    ExperimentType: '',
    setExperimentType: () => {},
    BtypeExperiment: '',
    setBtypeExperiment: () => {},
    RulesExperiment: '',
    setRulesExperiment: () => {},
    ExperimentDesc: '',
    setExperimentDesc: () => {},
    ExperimentId: ''
});


export default StepContext;