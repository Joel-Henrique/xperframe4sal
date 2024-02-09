import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../config/axios'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CustomSnackbar } from '../components/CustomSnackbar';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingIndicator } from '../components/LoadIndicator';


import { ExperimentTemplate, mountSteps } from './ExperimentTemplate';

const SurveyType = {
  PRE: 'pre',
  POST: 'post',
  OTHER: 'other'
}

const Surveys = () => {

  const navigate = useNavigate()
  const { experimentId } = useParams();

  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [steps, setSteps] = useState([])
  const [experiment, setExperiment] = useState(null);
  const [, setUserExperiment] = useState(null);
  const [surveys, setSurveys] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [preSurveys, setPreSurveys] = useState([]);
  const [postSurveys, setPostSurveys] = useState([]);
  const [answeredPreSurveys, setAnsweredPreSurveys] = useState([]);
  const [answeredPostSurveys, setAnsweredPostSurveys] = useState([]);
  const [, setIsSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('success');
  const [shouldActivateTask, setShouldActivateTask] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [expanded, setExpanded] = useState(`panel-0`);
  const [hasFinishedTasks, setHasFinishedTasks] = useState(false);


  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        setIsLoading(true);

        const [experimentResponse, userExperimentResponse] = await Promise.all([
          api.get(`experiments/${experimentId}`, { 'headers': { Authorization: `Bearer ${user.accessToken}` } }),
          api.get(`user-experiments?experimentId=${experimentId}&userId=${user.id}`, { 'headers': { Authorization: `Bearer ${user.accessToken}` } }),
        ]);

        let experimentResult = experimentResponse.data;
        let userExperimentResult = userExperimentResponse?.data;

        if (!userExperimentResult) {
          navigate(`/experiments`);
        }

        if (!userExperimentResult.stepsCompleted) {
          userExperimentResult.stepsCompleted = {};
        }

        if (!userExperimentResult.stepsCompleted["icf"]) {
          navigate(`/experiments/${experimentId}/icf`);
        }

        setHasFinishedTasks(userExperimentResult?.stepsCompleted["task"]);

        let surveyList = [];
        for (let surveyPropsId in experimentResult.surveysProps) {
          let response = await api.get(`surveys/${surveyPropsId}`, { 'headers': { Authorization: `Bearer ${user.accessToken}` } });
          const survey = response?.data;

          if (survey.isActive) {
            surveyList.push(survey);

            response = await api.get(`survey-answers?userId=${user.id}&surveyId=${survey._id}`, { 'headers': { Authorization: `Bearer ${user.accessToken}` } });
            const answeredSurvey = response?.data;
            const surveyProps = experimentResult.surveysProps[surveyPropsId];

            let hasAnswered = false;
            if (answeredSurvey && Array.isArray(answeredSurvey) && answeredSurvey.length > 0) {
              hasAnswered = true;
            }

            if (surveyProps.type === SurveyType.PRE) {
              preSurveys.push(survey);
              setPreSurveys(preSurveys);

              if (hasAnswered || !surveyProps.required) {
                setAnsweredPreSurveys(Object.assign(answeredPreSurveys, { [survey._id]: true }));
              }
            } else if (surveyProps.type === SurveyType.POST) {
              postSurveys.push(survey);
              setPostSurveys(postSurveys);

              if (!hasAnswered && surveyProps.required) {
                /** TODO */
              } else {
                setAnsweredPostSurveys(Object.assign(answeredPostSurveys, { [survey._id]: true }));
              }
            }
          }
        }

        if (surveyList.length === 0) {
          navigate(`/experiments/${experimentId}/tasks`);
        }

        const activate = userExperimentResult.stepsCompleted["pre"] || false;
        setShowWarning(!activate);
        setShouldActivateTask(activate);

        const experimentSteps = mountSteps(
          experimentResult.steps,
          userExperimentResult.stepsCompleted,
        );

        setExperiment(experimentResult);
        setUserExperiment(userExperimentResult);
        setSurveys(surveyList);
        setSteps(experimentSteps);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setOpen(true);
        setIsSuccess(false);
        setSeverity('error');
        setMessage(error);
        console.log(error);
      }
    }

    fetchSurveyData()


  }, [experimentId, user?.id, user?.accessToken, navigate, answeredPreSurveys, answeredPostSurveys, preSurveys, postSurveys])

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  }

  const handleEnterTasks = () => {
    navigate(`/experiments/${experimentId}/tasks`);
  }

  const handleEnterSurvey = (e) => {
    navigate(`/experiments/${experimentId}/surveys/${e}`, { state: { survey: surveys.filter(s => s._id === e)[0], experiment: experiment } });
  }


  return (
    <ExperimentTemplate headerTitle="Veja a seguir a lista de questionários disponíveis para você:" steps={steps}>
      <CustomSnackbar open={open} time={1500} message={message} severity={severity} />
      <div style={{ display: 'flex', marginBottom: 10 }}>
        {showWarning && <ErrorMessage style={{
          flex: 1,
        }} message={"Atenção: responda todos os questionários antes de ir para as tarefas."} messageType={'warning'} />}
        {!showWarning && !hasFinishedTasks && <Button
          variant="contained"
          color="primary"
          style={{ justifyContent: 'flex-end', marginLeft: 'auto' }}
          onClick={handleEnterTasks}
          disabled={!shouldActivateTask}
        >
          Ir para tarefas
        </Button>}
      </div>
      {!surveys && (<Typography variant="body1">Carregando questionários...</Typography>)}
      {!surveys && (isLoading && <LoadingIndicator size={70} />)}
      {surveys?.length === 0 && (<Typography variant="body1">No momento você não foi inscrito em nenhum questionário. Obrigad@!</Typography>)}

      <div>
        {preSurveys?.map((survey, index) => (
          (<Accordion
            sx={{ marginBottom: '5px' }}
            key={survey._id}
            elevation={3}
            expanded={(expanded === `panel-${index}`) && !hasFinishedTasks}
            onChange={handleChange(`panel-${index}`)}
            disabled={hasFinishedTasks || (answeredPreSurveys[survey._id] && experiment?.surveysProps[survey._id]?.uniqueAnswer)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${index}bh-content`}
              id={`panel-${index}bh-header`}
              sx={{
                '&:hover': {
                  backgroundColor: 'lightgray',
                },
              }}
            >
              <Typography>
                <span>{survey.title}</span>{answeredPreSurveys[survey._id] && experiment?.surveysProps[survey._id]?.uniqueAnswer ? <span style={{ color: 'red', display: 'flex', justifyContent: 'end' }}> Você já respondeu este questionário.</span> : ""}
              </Typography>
            </AccordionSummary>
            <Divider />
            <AccordionDetails>
              <Typography>{survey.description}</Typography>
              <div style={{ textAlign: 'right' }}>
                {answeredPreSurveys[survey._id] && !experiment?.surveysProps[survey._id]?.uniqueAnswer && (
                  <Button
                    variant="contained"
                    color='primary'
                    style={{ margin: '16px' }}
                    onClick={() => handleEnterSurvey(survey._id)}
                  >
                    Editar
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: '16px' }}
                  onClick={() => handleEnterSurvey(survey._id)}
                  disabled={answeredPreSurveys[survey._id]}
                >
                  Entrar
                </Button>
              </div>

            </AccordionDetails>
          </Accordion>)
        ))}
      </div>

      {hasFinishedTasks && (
        <div>
          {postSurveys?.map((survey, index) => (
            (!answeredPostSurveys[survey._id] || (answeredPostSurveys[survey._id] && !experiment?.surveysProps[survey._id]?.uniqueAnswer)) && (<Accordion
              sx={{ marginBottom: '5px' }}
              key={survey._id}
              elevation={3}
              expanded={expanded === `panel-${index}`}
              onChange={handleChange(`panel-${index}`)}
              disabled={(answeredPostSurveys[survey._id] && experiment?.surveysProps[survey._id]?.uniqueAnswer)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${index}bh-content`}
                id={`panel-${index}bh-header`}
                csx={{
                  '&:hover': {
                    backgroundColor: 'lightgray',
                  },
                }}
              >
                <Typography>
                  <span>{survey.title}</span>{answeredPostSurveys[survey._id] && experiment?.surveysProps[survey._id]?.uniqueAnswer ? <span style={{ color: 'red', display: 'flex', justifyContent: 'end' }}> Você já respondeu este questionário.</span> : ""}
                </Typography>
              </AccordionSummary>
              <Divider />
              <AccordionDetails>
                <Typography>{survey.description}</Typography>
                <div style={{ textAlign: 'right' }}>
                  {answeredPostSurveys[survey._id] && !experiment?.surveysProps[survey._id]?.uniqueAnswer && (
                    <Button
                      variant="contained"
                      color='primary'
                      style={{ margin: '16px' }}
                      onClick={() => handleEnterSurvey(survey._id)}
                    >
                      Editar
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ margin: '16px' }}
                    onClick={() => handleEnterSurvey(survey._id)}
                    disabled={answeredPostSurveys[survey._id]}
                  >
                    Entrar
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>)
          ))}
        </div>
      )}
    </ExperimentTemplate >
  );
}

export { Surveys }