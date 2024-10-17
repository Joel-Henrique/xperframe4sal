import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../config/axios';
import {
    TextField,
    Button,
    Typography,
    Box,
    Snackbar,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    styled,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const CustomContainer = styled('div')(({ theme }) => ({
    backgroundColor: '#fafafa',
    borderRadius: '8px',
    padding: '0px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
}));

export default function EditExperiment() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { experimentId } = useParams(); // Pegar o ID do experimento a ser editado

    const [title, setTitle] = useState('');
    const [taskConditions, setTaskConditions] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [selectedSurveys, setSelectedSurveys] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    
    const [tasks, setTasks] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [users, setUsers] = useState([]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Fetch dos dados do experimento e opções de tarefas/questionários/usuários
    useEffect(() => {
        const fetchExperiment = async () => {
            try {
                const response = await api.get(`/experiments/${experimentId}`);
                const { title, tasks, surveys, users } = response.data;
                setTitle(title);
                setSelectedTasks(tasks);
                setSelectedSurveys(surveys);
                setSelectedUsers(users);
            } catch (error) {
                console.error('Erro ao buscar experimento:', error);
            }
        };

        const fetchOptions = async () => {
            try {
                const [tasksResponse, surveysResponse, usersResponse] = await Promise.all([
                    api.get('/tasks'),
                    api.get('/surveys'),
                    api.get('/users'),
                ]);
                setTasks(tasksResponse.data);
                setSurveys(surveysResponse.data);
                setUsers(usersResponse.data);
            } catch (error) {
                console.error('Erro ao buscar opções:', error);
            }
        };

        fetchExperiment();
        fetchOptions();
    }, [experimentId]);

    const handleUpdateExperiment = async () => {
        try {
            setIsLoading(true);
            await api.put(
                `/experiments/${experimentId}`,
                {
                    title,
                    taskConditions,
                    selectedTasks,
                    selectedSurveys,
                    selectedUsers,
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('user')?.accessToken}` } }
            );

            setSnackbarSeverity('success');
            setSnackbarMessage('Experimento atualizado com sucesso!');
            navigate(`/experiments`);
        } catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMessage('Erro ao atualizar o experimento. Tente novamente.');
        } finally {
            setIsLoading(false);
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleTaskChange = (event) => {
        setSelectedTasks(event.target.value);
    };

    const handleSurveyChange = (event) => {
        setSelectedSurveys(event.target.value);
    };

    const handleUserChange = (event) => {
        setSelectedUsers(event.target.value);
    };

    return (
        <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                {t('Edição de Experimento')}
            </Typography>

            <TextField
                label={t('Título do Experimento')}
                variant="outlined"
                fullWidth
                margin="normal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />

            <FormControl fullWidth margin="normal">
                <InputLabel id="tasks-label">{t('Selecione as Tarefas')}</InputLabel>
                <Select
                    labelId="tasks-label"
                    multiple
                    value={selectedTasks}
                    onChange={handleTaskChange}
                    renderValue={(selected) => selected.map(id => tasks.find(task => task.id === id)?.title).join(', ')}
                >
                    {tasks.map((task) => (
                        <MenuItem key={task.id} value={task.id}>
                            <Checkbox checked={selectedTasks.indexOf(task.id) > -1} />
                            <ListItemText primary={task.title} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel id="surveys-label">{t('Selecione os Questionários')}</InputLabel>
                <Select
                    labelId="surveys-label"
                    multiple
                    value={selectedSurveys}
                    onChange={handleSurveyChange}
                    renderValue={(selected) => selected.map(id => surveys.find(survey => survey.id === id)?.title).join(', ')}
                >
                    {surveys.map((survey) => (
                        <MenuItem key={survey.id} value={survey.id}>
                            <Checkbox checked={selectedSurveys.indexOf(survey.id) > -1} />
                            <ListItemText primary={survey.title} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel id="users-label">{t('Selecione os Usuários')}</InputLabel>
                <Select
                    labelId="users-label"
                    multiple
                    value={selectedUsers}
                    onChange={handleUserChange}
                    renderValue={(selected) => selected.map(id => users.find(user => user.id === id)?.name).join(', ')}
                >
                    {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                            <Checkbox checked={selectedUsers.indexOf(user.id) > -1} />
                            <ListItemText primary={user.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateExperiment}
                disabled={isLoading}
                fullWidth
            >
                {isLoading ? <CircularProgress size={24} /> : t('Atualizar')}
            </Button>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
