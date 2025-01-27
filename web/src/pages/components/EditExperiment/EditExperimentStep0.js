import React, { useState, useRef, useContext } from 'react';
import {
  Box,
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
import { api } from '../../../config/axios';
import { Messages } from 'primereact/messages';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

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
  const msgs = useRef(null);
  const { t } = useTranslation();
  const [isValidTitleExp, setIsValidTitleExp] = useState(true);
  const [isValidFormExperiment, setIsValidFormExperiment] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
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
    ExperimentId
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

  const handleEditExperimentSubmit = async (e) => {
    e.preventDefault();

    const updatedExperiment = {
      name: ExperimentTitle,
      summary: ExperimentDesc,
      typeExperiment: ExperimentType,
      betweenExperimentType: BtypeExperiment,
    };

    try {
      const response = await api.patch(`/experiments/${ExperimentId}`, updatedExperiment, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      if (msgs.current) {
        msgs.current.clear();
        setTimeout(() => {
          msgs.current.show({
            severity: 'success',
            summary: t('Success'),
            life: 3000,
          });
        }, 100);
      }
    } catch (error) {
      msgs.current.clear();
      if (msgs.current) {
        msgs.current.show({
          severity: 'error',
          summary: t('error'),
          life: 3000,
        });
      }
      console.error('Erro na atualização da tarefa:', error);
    }
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        margin: 0,
        marginTop: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: 3,
        }}
      >
        <Box sx={{ width: '20%' }} />

        <Box
          sx={{
            width: '60%',
            padding: 2,
            display: 'flex',
            margin: 2,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: 4,
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

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 'auto',
              width: '100%',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditExperimentSubmit}
              sx={{ maxWidth: '150px' }}
            >
              {t('save')}
            </Button>
          </Box>
        </Box>

        <Box sx={{ width: '20%' }} />
      </Box>
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <Messages ref={msgs} />
      </Box>
    </Box>

  );
};

export default EditExperimentStep0;
