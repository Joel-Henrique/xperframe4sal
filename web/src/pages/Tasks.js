import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../config/axios';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrow from "@mui/icons-material/PlayArrow";

import { LoadingIndicator } from '../components/LoadIndicator';

import { ExperimentTemplate, mountSteps } from './ExperimentTemplate';


const Tasks = () => {
  const navigate = useNavigate();
  const { experimentId } = useParams();

  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [, setExperiment] = useState(null);
  const [tasks, setTasks] = useState();
  const [expanded, setExpanded] = useState(`panel-0`);
  const [steps, setSteps] = useState([])

  const [isLoading, setIsLoading] = useState(false);

  const [userTasks, setUserTasks] = useState(null);


  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        setIsLoading(true);
        const [experimentResponse, userExperimentResponse] = await Promise.all([
          api.get(`experiments/${experimentId}`, { 'headers': { Authorization: `Bearer ${user.accessToken}` } }),
          api.get(`user-experiments?experimentId=${experimentId}&userId=${user.id}`, { 'headers': { Authorization: `Bearer ${user.accessToken}` } }),
        ]);

        let experimentResult = experimentResponse.data;
        let userExperimentResult = userExperimentResponse.data;
        setExperiment(experimentResult);

        let response = await api.get(`user-tasks?userId=${user.id}`, { 'headers': { Authorization: `Bearer ${user.accessToken}` } });
        let userTasks = response?.data;

        // Filter tasks of the experiment
        userTasks = userTasks.filter(userTask => Object.keys(experimentResult.tasksProps).includes(userTask.taskId));

        setUserTasks(userTasks);

        let taskList = [];

        for (let userTask of userTasks) {
          response = await api.get(`tasks/${userTask.taskId}`, { 'headers': { Authorization: `Bearer ${user.accessToken}` } });
          const task = response?.data;

          if (task.isActive) {
            taskList.push(task);
          }
        }

        const experimentSteps = mountSteps(
          experimentResult.steps,
          userExperimentResult.stepsCompleted,
        );
        setSteps(experimentSteps);
        setTasks(taskList);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    }
    fetchTaskData()

  }, [experimentId, user?.id, user?.accessToken,]);

  const handleStartTaskClick = async (e) => {
    try {

      const userTask = userTasks.filter(userTask => userTask.taskId === e)[0];
      await api.patch(`user-tasks/${userTask._id}/start`, userTask, { 'headers': { Authorization: `Bearer ${user.accessToken}` } });

      navigate(`/experiments/${experimentId}/tasks/${e}`,
        {
          state: { task: tasks.filter(s => s._id === e)[0], userTask: userTask }
        });
    } catch (error) {
      console.error(error);
    }
  }

  const handleContinueTaskClick = async (e) => {
    try {

      const userTask = userTasks.filter(userTask => userTask.taskId === e)[0];
      await api.patch(`user-tasks/${userTask._id}/resume`, userTask, { 'headers': { Authorization: `Bearer ${user.accessToken}` } });

      navigate(`/experiments/${experimentId}/tasks/${e}`, {
        state: { task: tasks.filter(s => s._id === e)[0], userTask: userTask }
      });
    } catch (error) {
      console.error(error);
    }
  }

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  }


  return (
    <ExperimentTemplate headerTitle="Veja a seguir a lista de tarefas disponíveis para você:" steps={steps}>

      {!tasks && (<Typography variant="body1">Carregando tarefas...</Typography>)}
      {!tasks && isLoading && <LoadingIndicator size={70} />}
      {tasks?.length === 0 && (<Typography variant="body1">No momento você não foi inscrito em nenhuma tarefa. Obrigad@!</Typography>)}
      {tasks?.map((task, index) => (
        <Accordion
          sx={{ marginBottom: '5px' }}
          key={task._id}
          elevation={3}
          expanded={expanded === `panel-${index}`}
          onChange={handleChange(`panel-${index}`)}
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
              {task.title}
            </Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <Typography dangerouslySetInnerHTML={{ __html: task.description }} />
            <div style={{ textAlign: 'right' }}>
              {userTasks.filter(userTask => userTask.taskId === task._id)[0]?.isPaused ?
                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: '16px' }}
                  onClick={() => handleContinueTaskClick(task._id)}
                >
                  Retomar
                </Button> :
                <Button
                  variant="contained"
                  color="success"
                  style={{ margin: '16px' }}
                  onClick={() => handleStartTaskClick(task._id)}
                >
                  Iniciar <PlayArrow />
                </Button>
              }
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </ExperimentTemplate>
  );
}

export { Tasks }