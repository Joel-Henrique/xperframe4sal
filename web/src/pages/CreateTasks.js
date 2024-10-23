import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../config/axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { useTranslation } from 'react-i18next';

import {
    TextField,
    Button,
    Typography,
    Box,
    Stepper,
    Step,
    StepLabel,
    MenuItem,
    Checkbox,
    ListItemText,
    FormControl,
    Select,
    InputLabel,
    styled,
    Snackbar,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from '@mui/material';


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

const steps = ['Step 1: Informações Básicas', 'Step 2: Seleção de Questionários', 'Step 3: Revisão e Conclusão'];

const CreateTasks = () => {
    const [searchTerm, setSearchTerm] = useState('');  // Adiciona o estado de busca
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const { experimentId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [summary, setSummary] = useState('');
    const [surveys, setSurveys] = useState([]);
    const [selectedSurveys, setSelectedSurveys] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [requiredSurveysIds, setRequiredSurveysIds] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };
    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const response = await api.get(`surveys`, {
                    headers: { Authorization: `Bearer ${user.accessToken}` },
                });
                setSurveys(response.data);
            } catch (error) {
                console.error(t('Erro ao buscar os questionários'), error);
            }
        };

        fetchSurveys();
    }, [user, t]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleNextinfob = () => {
        if (!title) {
            setSnackbarOpen(true);
            setSnackbarMessage('Por favor, preencha o título da tarefa.');
            setSnackbarSeverity('error');
            return;
        }

        if (!summary) {
            setSnackbarOpen(true);
            setSnackbarMessage('Por favor, preencha o sumário da tarefa.');
            setSnackbarSeverity('error');
            return;
        }

        if (!description || description.replace(/<[^>]+>/g, '').trim() === '') {
            setSnackbarOpen(true);
            setSnackbarMessage('Por favor, preencha a descrição da tarefa.');
            setSnackbarSeverity('error');
            return;
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleCreateTask = async () => {
        try {
            setIsLoading(true);
            await api.post(
                `/tasks`,
                {
                    title,
                    summary,
                    description,
                    experimentId,
                    requiredSurveysIds: selectedSurveys,
                },
                { headers: { Authorization: `Bearer ${user.accessToken}` } }
            );
            navigate(`/experiments/${experimentId}/tasks`);
        } catch (error) {
            console.error(t('Erro ao criar a tarefa'), error);
        } finally {
            setIsLoading(false);
        }
    };



    const handleSelectSurvey = (id) => {
        setSelectedSurveys((prevSelectedSurveys) =>
            prevSelectedSurveys.includes(id)
                ? prevSelectedSurveys.filter((selectedId) => selectedId !== id) // Desmarcar
                : [...prevSelectedSurveys, id] // Adicionar novo ID
        );
    };
    

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const response = await api.get('surveys', {
                    headers: { Authorization: `Bearer ${user.accessToken}` },
                });
                setSurveys(response.data);
            } catch (error) {
                console.error(t('Erro ao buscar os questionários'), error);
            }
        };

        fetchSurveys();
    }, [user, t]);

    return (

        <Box sx={{ flexDirection: 'column', justifyContent: 'space-between', margin: 0 }}>

            <Typography variant="h4" component="h1" gutterBottom align="center">
                {t('Criação de Tarefas')}
            </Typography>

            {/* Barra de Step Progress */}
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {activeStep === 0 && (
                <Box sx={{ display: 'flex', margin: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', margin: 4 }}>
                    <Box sx={{ width: '20%', margin: 0, display: 'flex', padding: 2, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', '& > *': { marginBottom: 0, } }}>
                        <Box sx={{ padding: 0 }}>
                            <Typography
                                variant="h5"
                                gutterBottom
                                align="left"
                                sx={{ paddingLeft: 0, textAlign: 'left' }}
                            >
                                {t('Itens_task')}
                            </Typography>

                            <Box sx={{ padding: 0 }}>
                                <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'left' }}>
                                    <li style={{ marginBottom: '10px', color: title ? 'green' : 'red' }}>
                                        {title ? t('title_task') : t('title_task_uncheck')}
                                    </li>
                                    <li style={{ marginBottom: '10px', color: summary ? 'green' : 'red' }}>
                                        {summary ? t('sum_task') : t('sum_task_uncheck')}
                                    </li>
                                    <li style={{ marginBottom: '10px', color: description && description.replace(/<[^>]+>/g, '').trim() !== '' ? 'green' : 'red' }}>
                                        {description && description.replace(/<[^>]+>/g, '').trim() !== ''
                                            ? t('desc_task')
                                            : t('desc_task_uncheck')}
                                    </li>
                                </ul>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ maxWidth: 800, width: '60%', margin: 0, padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', '& > *': { marginBottom: 0, } }}>
                        <TextField
                            label={t('Título da Tarefa')}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderColor: title ? 'green' : 'red',
                                },
                            }}
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
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderColor: summary ? 'green' : 'red',
                                },
                            }}
                        />

                        <div style={{ width: '100%', marginTop: '16.5px', marginBottom: '16px' }}>
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

                        {/* Botões de Voltar e Próximo */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', width: '100%' }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleBack}
                                disabled={activeStep === 0}
                                sx={{ maxWidth: '150px' }}
                            >
                                {t('Voltar')}
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNextinfob}
                                sx={{ maxWidth: '150px' }}
                            >
                                {t('Próximo')}
                            </Button>

                            <Snackbar
                                open={snackbarOpen}
                                autoHideDuration={3000}
                                onClose={handleCloseSnackbar}
                                anchorOrigin={{ vertical: 'botton', horizontal: 'right' }}
                            >
                                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                                    {snackbarMessage}
                                </Alert>
                            </Snackbar>

                        </Box>
                    </Box>
                    <Box sx={{ width: '20%', padding: 2 }}></Box>

                </Box>
            )}


            {activeStep === 1 && (
                <Box sx={{
                    margin: 0,
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '& > *': { marginBottom: 0 }
                }}>
                    <Box sx={{ margin: '0 auto', mt: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            {t('Selecionar Questionários')}
                        </Typography>

                        {/* Campo de pesquisa */}
                        <TextField
                            label={t('Pesquisar Questionários')}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <FormControl fullWidth>
                                {surveys
                                    .filter((survey) =>
                                        survey.title.toLowerCase().includes(searchTerm.toLowerCase())
                                    )

                                    .map((survey) => (
                                        <Box key={survey._id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Checkbox
                                                checked={selectedSurveys.includes(survey._id)} // Verificar pelo ID
                                                onChange={() => handleSelectSurvey(survey._id)} // Passar o ID
                                            />
                                            <ListItemText primary={survey.title} />
                                        </Box>
                                    ))}
                            </FormControl>
                        )}

                        {/* Exibir os questionários obrigatórios já selecionados */}
                        {selectedSurveys.length > 0 && (
                            <Typography variant="h6" gutterBottom>
                                {t('Questionários Selecionados')}
                            </Typography>
                        )}
                        <ul style={{ paddingLeft: 20 }}>
                            {selectedSurveys.map((_id, index) => (
                                <li key={index}>
                                    {surveys.find((s) => s._id === _id)?.title}
                                </li>
                            ))}
                        </ul>
                    </Box>

                    {/* Botões de navegação */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', width: '100%', maxWidth: 800 }}>
                        <Button variant="contained" color="secondary" onClick={handleBack} sx={{ maxWidth: '150px' }}>
                            {t('Voltar')}
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleNext} sx={{ maxWidth: '150px' }}>
                            {t('Próximo')}
                        </Button>
                    </Box>
                </Box>
            )}

            {activeStep === 2 && (
                <Box sx={{ maxWidth: 800, margin: '0 auto', mt: 4 }}>
                    <Typography variant="h6">{t('Revisão e Conclusão')}</Typography>
                    <Typography>{t('Título da Tarefa')}: {title}</Typography>

                    <Typography>{t('Descrição da Tarefa')}: {description.replace(/<[^>]+>/g, '')}</Typography>

                    <Typography>
                        {t('Questionários selecionados')}: {selectedSurveys.map(_id => surveys.find(s => s._id === _id)?.title).join(', ')}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', width: '100%' }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleBack}
                            sx={{ maxWidth: '150px' }}
                        >
                            {t('Voltar')}
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateTask}
                            disabled={isLoading}
                            fullWidth
                            sx={{ maxWidth: '200px' }}
                        >
                            {isLoading ? t('Criando...') : t('Criar')}
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export { CreateTasks };
