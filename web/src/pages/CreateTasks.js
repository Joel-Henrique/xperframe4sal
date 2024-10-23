// React e Hooks
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// API
import { api } from '../config/axios';

// Editor de Texto
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


import { // Material UI - Componentes e Ícones
    TextField,
    Button,
    Typography,
    Box,
    Stepper,
    Step,
    StepLabel,
    Checkbox,
    ListItemText,
    FormControl,
    Snackbar,
    Alert,
    CircularProgress,
    IconButton,
    styled
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

// Tradução
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
    const [searchTerm, setSearchTerm] = useState('');
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [summary, setSummary] = useState('');
    const [surveys, setSurveys] = useState([]);
    const [selectedSurveys, setSelectedSurveys] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openSurveyIds, setOpenSurveyIds] = useState([]);
    const steps = [ t('step_1'), t('step_2'),  t('step_3') ];

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
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleNextinfob = () => {
        if (!title) {
            setSnackbarOpen(true);
            setSnackbarMessage(t('task_title_required'));
            setSnackbarSeverity('error');
            return;
        }

        if (!summary) {
            setSnackbarOpen(true);
            setSnackbarMessage(t('task_summary_required'));
            setSnackbarSeverity('error');
            return;
        }

        if (!description || description.replace(/<[^>]+>/g, '').trim() === '') {
            setSnackbarOpen(true);
            setSnackbarMessage(t('task_description_required'));
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
                    requiredSurveysIds: selectedSurveys,
                },
                { headers: { Authorization: `Bearer ${user.accessToken}` } }
            );
            navigate(`/experiments`);
        } catch (error) {
            console.error(t('Erro ao criar a tarefa'), error);
        } finally {
            setIsLoading(false);
        }
    };
    const toggleSurveyDescription = (surveyId) => {
        if (openSurveyIds.includes(surveyId)) {
            setOpenSurveyIds(openSurveyIds.filter((id) => id !== surveyId));
        } else {
            setOpenSurveyIds([...openSurveyIds, surveyId]);
        }
    };
    const handleSelectSurvey = (id) => {
        setSelectedSurveys((prevSelectedSurveys) =>
            prevSelectedSurveys.includes(id)
                ? prevSelectedSurveys.filter((selectedId) => selectedId !== id) 
                : [...prevSelectedSurveys, id]
        );
    };
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
                    margin: 10,
                    padding: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    boxShadow: 4,
                    width: '100%',
                    maxWidth: 800,
                    marginX: 'auto'
                }}>
                    {/* Campo de pesquisa */}
                    <TextField
                        label={t('Pesquisar Questionários')}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ mb: 3 }}
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
                                    <Box key={survey._id} sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        mb: 1,
                                        padding: 1,
                                        backgroundColor: '#ffffff',
                                        borderRadius: '4px',
                                        boxShadow: 1,
                                        '&:hover': { backgroundColor: '#e6f7ff' }
                                    }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Checkbox
                                                    checked={selectedSurveys.includes(survey._id)}
                                                    onChange={() => handleSelectSurvey(survey._id)}
                                                />
                                                <ListItemText primary={survey.title} sx={{ ml: 1 }} />
                                            </Box>
                                            <IconButton
                                                color="primary"
                                                onClick={() => toggleSurveyDescription(survey._id)}
                                                sx={{ ml: 2 }}
                                            >
                                                {openSurveyIds.includes(survey._id) ? <RemoveIcon /> : <AddIcon />}
                                            </IconButton>
                                        </Box>

                                        {/* Exibir descrição logo abaixo da tarefa */}
                                        {openSurveyIds.includes(survey._id) && (
                                            <Box sx={{
                                                marginTop: 1,
                                                padding: 1,
                                                backgroundColor: '#e8f5e9',
                                                borderRadius: '4px'
                                            }}>
                                                <Typography variant="body2">{survey.description}</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                ))}
                        </FormControl>
                    )}

                    {/* Botões de navegação */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', width: '100%', mt: 2 }}>
                        <Button variant="outlined" color="secondary" onClick={handleBack} sx={{ maxWidth: '120px', borderRadius: '20px' }}>
                            {t('Voltar')}
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleNext} sx={{ maxWidth: '120px', borderRadius: '20px' }}>
                            {t('Próximo')}
                        </Button>
                    </Box>
                </Box>

            )}

            {activeStep === 2 && (
                <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                        {t('revis_conc')}
                    </Typography>

                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        <strong>{t('Título da Tarefa')}:</strong> {title}
                    </Typography>

                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        <strong>{t('desc_task1')}:</strong> {description.replace(/<[^>]+>/g, '')}
                    </Typography>

                    <Typography variant="subtitle1" sx={{ mb: 3 }}>
                        <strong>{t('selected_taks')}:</strong> {selectedSurveys.map(_id => surveys.find(s => s._id === _id)?.title).join(', ')}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleBack}
                            sx={{ maxWidth: 150, fontWeight: 'bold', boxShadow: 2 }}
                        >
                            {t('Voltar')}
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCreateTask}
                            disabled={isLoading}
                            fullWidth
                            sx={{ maxWidth: 200, fontWeight: 'bold', boxShadow: 2 }}
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
