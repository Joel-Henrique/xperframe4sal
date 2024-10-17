import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function CreateExperiment() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [title, setTitle] = useState('');
    const [taskConditions, setTaskConditions] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [selectedSurveys, setSelectedSurveys] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    
    // Adicione valores mock aqui
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Tarefa 1' },
        { id: 2, title: 'Tarefa 2' },
    ]);
    const [surveys, setSurveys] = useState([
        { id: 1, title: 'Questionário 1' },
        { id: 2, title: 'Questionário 2' },
    ]);
    const [users, setUsers] = useState([
        { id: 1, name: 'Usuário 1' },
        { id: 2, name: 'Usuário 2' },
    ]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [tasksResponse, surveysResponse, usersResponse] = await Promise.all([
                    api.get('/tasks'),
                    api.get('/surveys'),
                    api.get('/users')
                ]);
                setTasks(tasksResponse.data);
                setSurveys(surveysResponse.data);
                setUsers(usersResponse.data);
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };

        fetchOptions();
    }, []);

    const handleCreateExperiment = async () => {
        try {
            setIsLoading(true);
            const response = await api.post(
                '/experiments',
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
            setSnackbarMessage('Experimento criado com sucesso!');
            navigate('/experiments');
        } catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMessage('Erro ao criar o experimento. Tente novamente.');
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
                {t('Criação de Experimento')}
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
                <InputLabel
                        id="surveys-label"
                        sx={{
                            '&.Mui-focused': {
                                top: '-8px', 
                            },
                        }}
                    >
                    {t('Selecione as Tarefas')}
                </InputLabel>
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
                <InputLabel
                    id="surveys-label"
                    sx={{
                        '&.Mui-focused': {
                            top: '-8px', 
                        },
                    }}
                >
                    {t('Selecione os Questionários')}
                </InputLabel>
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
            <InputLabel
                    id="surveys-label"
                    sx={{
                        '&.Mui-focused': {
                            top: '-8px', 
                        },
                    }}
                >
                    {t('Selecione os Usuários')}
                </InputLabel>
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
                onClick={handleCreateExperiment}
                disabled={isLoading}
                fullWidth
            >
                {isLoading ? <CircularProgress size={24} /> : t('Criar Experimento')}
            </Button>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};
