import { useEffect } from 'react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../config/axios';
import {
    TextField,
    Button,
    Typography,
    Box,
    Snackbar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';

import CreateExperiment from './CreateExperiment'
import AddUsersToExperiment from './AddUsersToExperiment'

import '../styles/CreateTasks.css';

const CreateTasks = () => {
    const { experimentId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [experiments, setExperiments] = useState([]);
    const [selectedExperiment, setSelectedExperiment] = useState('');
    const [showCreateExperiment, setShowCreateExperiment] = useState(false); 
    const [showAddUsers, setShowAddUsers] = useState(false);

    useEffect(() => {
        // Requisição para buscar os experimentos disponíveis no banco de dados
        const fetchExperiments = async () => {
            try {
                const response = await api.get('/experiments');
                setExperiments(response.data);
            } catch (error) {
                console.error('Erro ao buscar experimentos:', error);
            }
        };

        fetchExperiments();
    }, []);

    const handleCreateTask = async () => {
        try {
            setIsLoading(true);
            const response = await api.post(
                `/tasks`,
                {
                    title,
                    description,
                    experimentId: selectedExperiment,  // Use o experimento selecionado
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('user')?.accessToken}` } }
            );

            setSnackbarSeverity('success');
            setSnackbarMessage('Tarefa criada com sucesso!');
            navigate(`/experiments/${selectedExperiment}/tasks`);
        } catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMessage('Erro ao criar a tarefa. Tente novamente.');
        } finally {
            setIsLoading(false);
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleExperimentChange = (event) => {
        setSelectedExperiment(event.target.value);
    };

    const handleEditExperiment = (id) => {
        // Redireciona pra page de edição
        navigate(`/experiments/edit/${id}`);
    };

    return (
        <Box className="create-tasks-container">
            <Typography variant="h4" component="h1" gutterBottom>
                {t('Criação de Tarefas')}
            </Typography>

            {/* Campo de seleção de experimentos */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="experiment-select-label">{t('Selecione um Experimento')}</InputLabel>
                <Select
                    labelId="experiment-select-label"
                    value={selectedExperiment}
                    onChange={handleExperimentChange}
                    required
                >
                    {experiments.map((experiment) => (
                        <MenuItem key={experiment.id} value={experiment.id}>
                            {experiment.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                label={t('Título da Tarefa')}
                variant="outlined"
                fullWidth
                margin="normal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <TextField
                label={t('Descrição da Tarefa')}
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />

            <Typography variant="h6" gutterBottom>
                {t('Selecione o experimento')}
            </Typography>

            <FormControl fullWidth margin="normal">
                <InputLabel id="experiment-select-label">{t('Selecione um Experimento')}</InputLabel>
                <Select
                    labelId="experiment-select-label"
                    value={selectedExperiment}
                    onChange={handleExperimentChange}
                    required
                >
                    {experiments.map((experiment) => (
                        <MenuItem key={experiment.id} value={experiment.id}>
                        {experiment.title}
                        <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleEditExperiment(experiment.id)}
                        >
                            <EditIcon />
                        </IconButton>
                    </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Typography variant="body1" gutterBottom>
                {t('Não tem o experimento desejado? Crie aqui')}
            </Typography>

            <Button
                variant="outlined"
                color="secondary"
                onClick={() => setShowCreateExperiment(true)}
                fullWidth
                sx={{ marginTop: 2 }}
            >
                {t('Criar Novo Experimento')}
            </Button>

            {showCreateExperiment && <CreateExperiment />}

             {/* Botão para adicionar usuários ao experimento */}
             <Button
                variant="outlined"
                color="secondary"
                onClick={() => setShowAddUsers(!showAddUsers)} // Alterna a exibição do componente
                fullWidth
                sx={{ marginTop: 2 }}
            >
                {t('Adicionar Usuários ao Experimento')}
            </Button>

            {/* Exibe o componente AddUsersToExperiment ao clicar */}
            {showAddUsers && <AddUsersToExperiment />}
                    

            <Button
                variant="contained"
                color="primary"
                onClick={handleCreateTask}
                disabled={isLoading}
                fullWidth
            >
                {isLoading ? 'Criando...' : t('Criar')}
            </Button>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} className="create-tasks-snackbar">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export { CreateTasks };