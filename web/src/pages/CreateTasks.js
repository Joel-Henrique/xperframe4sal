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
} from '@mui/material';
import { useTranslation } from 'react-i18next';

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

    const handleCreateTask = async () => {
        try {
            setIsLoading(true);
            const response = await api.post(
                `/tasks`,
                {
                    title,
                    description,
                    experimentId,
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('user')?.accessToken}` } }
            );

            setSnackbarSeverity('success');
            setSnackbarMessage('Tarefa criada com sucesso!');
            navigate(`/experiments/${experimentId}/tasks`); // Redireciona para a lista de tarefas
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

    return (
        <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {t('Criação de Tarefas')}
            </Typography>
            <TextField
                label={t('Titulo da Tarefa')}
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
            <Button
                variant="contained"
                color="primary"
                onClick={handleCreateTask}
                disabled={isLoading}
                fullWidth
            >
                {isLoading ? 'Criando...' : t('create_task')}
            </Button>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export { CreateTasks };
