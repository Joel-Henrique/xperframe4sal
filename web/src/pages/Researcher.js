import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../config/axios';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
  Divider,
  Skeleton,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';

const ExperimentAccordion = ({ experiment, expanded, onChange, onClick, t }) => (
  <Accordion
    sx={{ marginBottom: '5px' }}
    elevation={3}
    expanded={expanded}
    onChange={onChange}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls={`${experiment._id}-content`}
      id={`${experiment._id}-header`}
      sx={{
        '&:hover': {
          backgroundColor: 'lightgray',
        },
      }}
    >
      <Typography>{experiment.name}</Typography>
    </AccordionSummary>
    <Divider />
    <AccordionDetails>
      <Typography dangerouslySetInnerHTML={{ __html: experiment.summary }} />
      <div style={{ textAlign: 'right' }}>
        <Button
          variant="contained"
          color="primary"
          style={{ margin: '16px' }}
          onClick={onClick}
        >
          {t('Access')}
        </Button>
      </div>
    </AccordionDetails>
  </Accordion>
);


const LoadingState = () => (
  <div>
    {[...Array(3)].map((_, index) => (
      <Skeleton key={index} variant="rectangular" height={80} style={{ marginBottom: '8px' }} />
    ))}
  </div>
);

const Researcher = () => {
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState(null);
  const [experimentsOwner, setOwnerExperiments] = useState(null);
  const [expanded, setExpanded] = useState(`panel-owner-0`);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const { t } = useTranslation();

  useEffect(() => {
    const fetchExperimentData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`user-experiments?userId=${user.id}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        });
        const userExperimentsData = response.data;
        let experimentList = [];
        if (userExperimentsData?.length > 0) {
          for (let i = 0; i < userExperimentsData.length; i++) {
            if (!userExperimentsData[i].hasFinished) {
              const experimentResponse = await api.get(
                `experiments/${userExperimentsData[i].experimentId}`,
                { headers: { Authorization: `Bearer ${user.accessToken}` } }
              );
              experimentList.push(experimentResponse.data);
            }
          }
        }
        const ownedExperiments = experimentList.filter(
          (experiment) => experiment.ownerId === user.id
        );
        const participatedExperiments = experimentList.filter(
          (experiment) => experiment.ownerId !== user.id
        );
        setExperiments(participatedExperiments);
        setOwnerExperiments(ownedExperiments);
      } catch (error) {
        setError(t('error_loading_experiments'));
      }
      setIsLoading(false);
    };

    fetchExperimentData();
  }, [user?.id, user?.accessToken, t]);

  const handleCreateExperiment = () => {
    navigate('/CreateExperiment');
  };

  const handleClick = (experimentId) => {
    navigate(`/experiments/${experimentId}/surveys`);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <Typography variant="h6" gutterBottom>
          {t('researcher_experiments_title')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateExperiment}
        >
          {t('create_experiment_button')}
        </Button>
      </div>




      {isLoading && <LoadingState />}
      {error && (
        <Typography variant="body1" color="error" style={{ marginTop: '16px' }}>
          {error}
        </Typography>
      )}

      {experimentsOwner?.length > 0 ? (
        experimentsOwner.map((experiment, index) => (
          <ExperimentAccordion
            key={experiment._id}
            experiment={experiment}
            expanded={expanded === `panel-owner-${index}`}
            onChange={handleChange(`panel-owner-${index}`)}
            onClick={() => handleClick(experiment._id)}
            t={t}
          />
        ))
      ) : (
        !isLoading && <Typography>{t('no_experiments')}</Typography>
      )}



      <Typography variant="h6" gutterBottom style={{ marginTop: '16px' }}>
        {t('see_experiment_list_title')}
      </Typography>

      {experiments?.length > 0 ? (
        experiments.map((experiment, index) => (
          <ExperimentAccordion
            key={experiment._id}
            experiment={experiment}
            expanded={expanded === `panel-${index}`}
            onChange={handleChange(`panel-${index}`)}
            onClick={() => handleClick(experiment._id)}
            t={t}
          />
        ))
      ) : (
        !isLoading && <Typography>{t('no_experiments')}</Typography>
      )}
    </>
  );
};

export { Researcher };
