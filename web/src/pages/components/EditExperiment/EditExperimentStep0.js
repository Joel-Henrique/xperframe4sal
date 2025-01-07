import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  styled,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import StepContext from './context/StepContext';

const CustomContainer = styled('div')(({ theme }) => ({
  backgroundColor: '#fafafa',
  borderRadius: '8px',
  padding: '0px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  '& .ql-toolbar': {
    backgroundColor: '#f5f5f5',
    borderRadius: '8px 8px 0 0',
  },
  '& .ql-container': {
    minHeight: '200px',
    borderRadius: '0 0 8px 8px',
  },
  '& .ql-editor': {
    fontFamily: theme.typography.fontFamily,
    lineHeight: 1.6,
    color: '#444',
  },
}));


const EditExperimentStep0 = ({ }) => {
  const { t } = useTranslation();
  const [isValidTitleExp, setIsValidTitleExp] = useState(true);
  const [isValidFormExperiment, setIsValidFormExperiment] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [
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
  ] = useContext(StepContext);


  const ExperimentTypes = [
    { value: 'between-subject', label: t('between-subject') },
    { value: 'within-subject', label: t('within-subject') },
  ];
  const betweenExperimentTypes = [
    { value: 'random', label: t('random') },
    { value: 'score_based', label: t('score_based') },
    { value: 'manual', label: t('manual') },
  ];


  return (
    <Box sx={{ flexDirection: 'column', justifyContent: 'space-between', margin: 0 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          marginTop: 3,
        }}
      >
        <Box
          sx={{
            width: '60%',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: 4,
            mx: 'auto',
          }}
        >
          <TextField
            label={t('Experiment_title')}
            error={!isValidTitleExp}
            helperText={!isValidTitleExp ? t('invalid_name_message') : ''}
            variant="outlined"
            fullWidth
            margin="normal"
            value={ExperimentTitle} 
            onChange={(e) => setExperimentTitle(e.target.value)} 
            required
          />


          <FormControl fullWidth margin="normal">
            <InputLabel>{t('Experiment_Type')}</InputLabel>
            <Select
              value={ExperimentType} 
              onChange={(e) => setExperimentType(e.target.value)} 
              label={t('ExperimentTypes')}
            >
              {ExperimentTypes.map((stype) => (
                <MenuItem key={stype.value} value={stype.value}>
                  {stype.label}
                </MenuItem>
              ))}
            </Select>

          </FormControl>
          {ExperimentType === 'between-subject' && (
            <FormControl fullWidth margin="normal">
              <InputLabel>{t('Group_Separation_Method')}</InputLabel>
              <Select
                value={BtypeExperiment} 
                onChange={(e) => setBtypeExperiment(e.target.value)}
                label={t('ExperimentTypesbetween')}
              >
                {betweenExperimentTypes.map((stype) => (
                  <MenuItem key={stype.value} value={stype.value}>
                    {stype.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <div style={{ width: '100%', marginTop: '16.5px', marginBottom: '16px' }}>
            <CustomContainer>
              <ReactQuill
                theme="snow"
                value={ExperimentDesc} 
                onChange={setExperimentDesc} 
                placeholder={t('Experiment_Desc1')}
              />
            </CustomContainer>
          </div>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', width: '100%' }}>
            <Button
              variant="contained"
              color="primary"
              
              sx={{ maxWidth: '150px' }}
            >
              {t('back')}
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => setStep(step + 1)} 
              sx={{ maxWidth: '150px' }}
            >
              {t('next')}
            </Button>

          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EditExperimentStep0;
