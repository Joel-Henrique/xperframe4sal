import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../config/axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

const CreateTasks = () => {
    const { experimentId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [summary, setSummary] = useState('');
    const [requiredSurveysIds, setRequiredSurveysIds] = useState([]); 
    const [surveys, setSurveys] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const response = await api.get('/surveys', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('user')?.accessToken}` }
                });
                setSurveys(response.data);
            } catch (error) {
                console.error(t('Erro ao buscar os questionários'), error);
            }
        };

        fetchSurveys();
    }, [t]);

    const handleCreateTask = async () => {
        try {
            setIsLoading(true);
            const response = await api.post(
                `/tasks`,
                {
                    title,
                    summary,
                    description,
                    experimentId,
                    requiredSurveysIds,
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('user')?.accessToken}` } }
            );

            setSnackbarSeverity('success');
            setSnackbarMessage(t('Tarefa criada com sucesso!'));
            navigate(`/experiments/${experimentId}/tasks`);
        } catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMessage(t('Erro ao criar a tarefa. Tente novamente.'));
        } finally {
            setIsLoading(false);
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleSurveyChange = (event) => {
        setRequiredSurveysIds(event.target.value);
    };

    return (
        <Box sx={{ maxWidth: 500, margin: '0 auto', padding: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                {t('Criação de Tarefas')}
            </Typography>

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
                label={t('Sumário da Tarefa')}
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
                placeholder={t('Forneça informações sobre o sumário da tarefa')}
            />

            <div>
                <CustomContainer>
                    <ReactQuill
                        theme="snow"
                        value={description}
                        onChange={setDescription}
                        placeholder={t('Descrição da Tarefa *')}
                        required
                    />
                </CustomContainer>
            </div>

            <FormControl fullWidth margin="normal">
                <InputLabel id="surveys-label" shrink>{t('Questionários Obrigatórios')}</InputLabel>
                <Select
                    labelId="surveys-label"
                    label={t('Questionários Obrigatórios')}
                    multiple
                    value={requiredSurveysIds}
                    onChange={handleSurveyChange}
                    renderValue={(selected) => selected.length > 0 ? selected.join(', ') : t('Nenhum questionário selecionado')}
                    displayEmpty
                >
                    {surveys.length === 0 ? (
                        <MenuItem disabled>{isLoading ?
                            <CircularProgress size={24}/> : t('Nenhum questionário disponível')}</MenuItem>
                    ) : (
                        surveys.map((survey) => (
                            <MenuItem key={survey.id} value={survey.id}>
                                <Checkbox checked={requiredSurveysIds.indexOf(survey.id) > -1}/>
                                <ListItemText primary={survey.title}/>
                            </MenuItem>
                        ))
                    )}
                </Select>
            </FormControl>

            <Button
                variant="contained"
                color="primary"
                onClick={handleCreateTask}
                disabled={isLoading}
                fullWidth
            >
                {isLoading ? t('Criando...') : t('Criar')}
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
