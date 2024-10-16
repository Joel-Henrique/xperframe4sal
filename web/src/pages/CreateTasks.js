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
    MenuItem,
    Checkbox,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const { experimentId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState(''); 
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [summary, setSummary] = useState('');
    const [requiredSurveysIds, setRequiredSurveysIds] = useState([]);
    const [surveys, setSurveys] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openSurveyDialog, setOpenSurveyDialog] = useState(false); 

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const response = await api.get(`surveys`, {
                    headers: { Authorization: `Bearer ${user.accessToken} }` },
                });
                setSurveys(response.data);
            } catch (error) {
                console.error(t('Erro ao buscar os questionários'), error);
            }
        };

        fetchSurveys();
    }, [t]);

    //post
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
    

    //abrir janela de dialogo
    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleSelectSurvey = (surveyTitle) => {
        setRequiredSurveysIds((prev) => {
            if (prev.includes(surveyTitle)) {
                return prev.filter(id => id !== surveyTitle);
            } else {
                return [...prev, surveyTitle];
            }
        });
    };

    const handleOpenSurveyDialog = () => {
        setOpenSurveyDialog(true);
    };

    const handleCloseSurveyDialog = () => {
        setOpenSurveyDialog(false);
    };

    return (
        <Box sx={{ 
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            margin: '0 auto',
        }}>
           <Box sx={{ 
                width: '20%', 
                margin: 0, 
                display: 'flex',
                padding: 2, 
                flexDirection: 'column', 
                justifyContent: 'center',
                alignItems: 'flex-start', 
                '& > *': {  
                    marginBottom: 0, 
                }
            }}>
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
                            <li style={{ marginBottom: '10px', color: requiredSurveysIds.length > 0 ? 'green' : 'red' }}>
                                {requiredSurveysIds.length > 0 ? t('selected_taks1') : t('non_selected_taks1')}
                            </li>
                        </ul>
                    </Box>
                </Box>                    
                <Box sx={{ padding: 0 }}>
                    <Typography variant="h5" gutterBottom align="left" sx={{ paddingLeft: 0, textAlign: 'left' }}>
                        {t('selected_taks')}
                    </Typography>

                    {requiredSurveysIds.length > 0 ? (
                    <ul style={{ paddingLeft: 20 }}> 
                        {requiredSurveysIds.map((survey, index) => (
                            <li key={index}>
                                {survey}
                            </li>
                        ))}
                    </ul>
                    ) : (
                    <Typography variant="body1" gutterBottom align="left" color="textSecondary" sx={{ paddingLeft: 0, textAlign: 'left' }}>
                        {t('non_selected_taks')}
                    </Typography>
                    )}
                </Box> 
            </Box>

    
            <Box sx={{ 
                maxWidth: 800,
                width: '60%',
                margin: 0, 
                padding: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                alignItems: 'center',
                '& > *': {  
                    marginBottom: 0, 
                }
            }}>
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ padding: 4 }} >
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
                    <Dialog open={openSurveyDialog} onClose={handleCloseSurveyDialog} fullWidth maxWidth="sm">
                        <DialogTitle>
                            {t('Selecionar_Questionários')}
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseSurveyDialog}
                                sx={{ position: 'absolute', right: 8, top: 8 }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
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
                                        .map((survey, index) => (
                                            <MenuItem key={index} value={survey.title}>
                                                <Checkbox
                                                    checked={requiredSurveysIds.indexOf(survey.title) > -1}
                                                    onChange={() => handleSelectSurvey(survey.title)}  
                                                />
                                                <ListItemText primary={survey.title} />
                                            </MenuItem>
                                        ))}
                                </FormControl>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseSurveyDialog} color="primary">
                                {t('Fechar')}
                            </Button>
                        </DialogActions>
                </Dialog>
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
    
                <Box>
                    <Button 
                        variant="outlined" 
                        color={requiredSurveysIds.length > 0 ? 'success' : 'error'} 
                        gutterBottom 
                        align="center" 
                        onClick={handleOpenSurveyDialog}
                    >
                        {t('Selecionar_Questionários')}
                    </Button>
                </Box>
                
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    marginTop: 'auto',
                    width: '100%' 
                }}>
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
            <Box sx={{ 
                width: '20%', 
                padding: 2,
            }}>
            </Box>
        </Box>
    );
    
    
}

export { CreateTasks };
