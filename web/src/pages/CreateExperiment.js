import { useState, useEffect } from 'react';
import { api } from '../config/axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
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
    styled,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Add, Remove } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess'

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

const CreateExperiment = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [isCreateQuestOpen, setIsCreateQuestOpen] = useState(false);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const { t } = useTranslation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('pre');

    const [titleExperiment, settitleExperiment] = useState('');
    const [typeExperiment, settypeExperiment] = useState('between-subject');
    const [BtypeExperiment, setBtypeExperiment] = useState('random');
    const [descriptionExperiment, setdescriptionExperiment] = useState('');

    const [taskTitle, settaskTitle] = useState('');
    const [taskDescription, settaskDescription] = useState('');
    const [taskSummary, settaskSummary] = useState('');

    const [surveys, setSurveys] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedSurveys, setSelectedSurveys] = useState([]);
    const [selectedTasks, setSelectedTask] = useState([]);

    const [activeStep, setActiveStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openSurveyIds, setOpenSurveyIds] = useState([]);
    const [openTaskIds, setOpenTaskIds] = useState([]);

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const steps = [t('step_1'), t('step_2'), t('step_3'), t('step_4'), t('step_5')];

    const fetchTasks = async () => {
        try {
            const response = await api.get(`tasks`, {
                headers: { Authorization: `Bearer ${user.accessToken}` },
            });
            setTasks(response.data);
        } catch (error) {
            console.error(t('Error in Search'), error);
        }
    };
    const fetchExp = async () => {
        try {
            const response = await api.get(`experiments`, {
                headers: { Authorization: `Bearer ${user.accessToken}` },
            });
        } catch (error) {
            console.error(t('Error in Search'), error);
        }
    };
    const fetchUsers = async () => {
        try {
            const response = await api.get(`users`, {
                headers: { Authorization: `Bearer ${user.accessToken}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error(t('Error in Search'), error);
        }
    };

    const fetchSurveys = async () => {
        try {
            const response = await api.get(`surveys`, {
                headers: { Authorization: `Bearer ${user.accessToken}` },
            });
            setSurveys(response.data);
        } catch (error) {
            console.error(t('Error in Search'), error);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchUsers();
        fetchSurveys();
    }, [user, t]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleNextExperiment = () => {
        if (!titleExperiment) {
            setSnackbarOpen(true);
            setSnackbarMessage(t('titleExperiment_required'));
            setSnackbarSeverity('error');
            return;
        }

        if (!descriptionExperiment || descriptionExperiment.replace(/<[^>]+>/g, '').trim() === '') {
            setSnackbarOpen(true);
            setSnackbarMessage(t('descriptionExperiment_required'));
            setSnackbarSeverity('error');
            return;
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleCreateTask = async () => {
        try {
            setIsLoading(true);
            await api.post(
                `/tasks`,
                {
                    title: taskTitle,
                    summary: taskSummary,
                    description: taskDescription,
                },
                { headers: { Authorization: `Bearer ${user.accessToken}` } }
            );
            toggleCreateTask();
            fetchTasks();
            settaskTitle("");
            settaskSummary("");
            settaskDescription("");
            fetchTasks();
        } catch (error) {
            console.error(t('Error creating task'), error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateExp = async () => { //falta arrumar
        try {
            setIsLoading(true);
            await api.post(
                `/experiments`,
                {
                    name: titleExperiment,
                    description: descriptionExperiment,
                    type: typeExperiment,
                    surveysProps: selectedSurveys,
                    tasksProps: selectedTasks,
                    userProps: selectedUsers,
                },
                { headers: { Authorization: `Bearer ${user.accessToken}` } }
            );
            navigate('/CreateExperiment');
            toggleCreateExp();
            fetchExp();
        } catch (error) {
            console.error(t('Error creating task'), error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate_taskbtt = () => {
        if (!taskTitle) {
            return;
        }

        if (!taskSummary) {
            return;
        }

        if (!taskDescription || taskDescription.replace(/<[^>]+>/g, '').trim() === '') {
            return;
        }

        handleCreateTask();
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const toggleTaskDescription = (surveyId) => {
        if (openTaskIds.includes(surveyId)) {
            setOpenTaskIds(openTaskIds.filter((id) => id !== surveyId));
        } else {
            setOpenTaskIds([...openTaskIds, surveyId]);
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

    const handleSelectUser = (id) => {
        setSelectedUsers((prevSelectedUsers) =>
            prevSelectedUsers.includes(id)
                ? prevSelectedUsers.filter((selectedId) => selectedId !== id)
                : [...prevSelectedUsers, id]
        );
    };

    const handleSelectTasks = (id) => {
        setSelectedTask((prevsetSelectedTask) =>
            prevsetSelectedTask.includes(id)
                ? prevsetSelectedTask.filter((selectedId) => selectedId !== id)
                : [...prevsetSelectedTask, id]
        );
    };
    const toggleCreateTask = () => {
        setIsCreateTaskOpen((prev) => !prev);
    };
    const toggleCreateExp = () => {
        setIsCreateTaskOpen((prev) => !prev);
    };
    const toggleCreateQuest = () => {
        setIsCreateQuestOpen((prev) => !prev);
    };


    const questionTypes = [
        { value: 'open', label: t('open') },
        { value: 'multiple-selection', label: t('multiple_selection') },
        { value: 'multiple-choices', label: t('multiple_choices') },
    ];
    const surveyTypes = [
        { value: 'pre', label: t('pre') },
        { value: 'demo', label: t('demo') },
        { value: 'post', label: t('post') }
    ];
    const ExperimentTypes = [
        { value: 'between-subject', label: t('between-subject') },
        { value: 'within-subject', label: t('within-subject') },
    ];
    const betweenExperimentTypes = [
        { value: 'random', label: t('random') },
        { value: 'score_based', label: t('score_based') },
        { value: 'manual', label: t('manual') },
    ];

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Date.now(),
                statement: '',
                type: 'open',
                required: false,
                options: [],
                subQuestions: [],
            },
        ]);
    };

    const handleRemoveQuestion = (id) => {
        setQuestions(questions.filter((q) => q.id !== id));
    };

    const handleQuestionChange = (id, field, value) => {
        setQuestions(
            questions.map((q) =>
                q.id === id
                    ? {
                        ...q,
                        [field]: value,
                    }
                    : q
            )
        );
    };

    const handleAddOption = (questionId) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        options: [
                            ...q.options,
                            { id: Date.now(), statement: '', score: 0, subQuestion: null },
                        ],
                    }
                    : q
            )
        );
    };

    const handleRemoveOption = (questionId, optionId) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        options: q.options.filter((opt) => opt.id !== optionId),
                    }
                    : q
            )
        );
    };

    const handleOptionChange = (questionId, optionId, field, value) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        options: q.options.map((opt) =>
                            opt.id === optionId
                                ? {
                                    ...opt,
                                    [field]: value,
                                }
                                : opt
                        ),
                    }
                    : q
            )
        );
    };


    const handleSubmitquest = async (e) => {
        e.preventDefault();
        const name = title;
        const payload = {
            name,
            title,
            description,
            type,
            questions: questions.map((q) => {
                const question = {
                    statement: q.statement,
                    type: q.type,
                    required: q.required,
                };

                if (q.type === 'multiple-selection' || q.type === 'multiple-choices') {
                    question.options = q.options.map((opt) => {
                        const option = { statement: opt.statement };
                        if (q.type === 'multiple-choices') {
                            option.score = opt.score;
                        }
                        if (opt.subQuestion) {
                            option.subQuestion = {
                                statement: opt.subQuestion.statement,
                                type: opt.subQuestion.type,
                                required: opt.subQuestion.required,
                                options: opt.subQuestion.options.map((subOpt) => ({
                                    statement: subOpt.statement,
                                    score: subOpt.score,
                                })),
                            };
                        }
                        return option;
                    });
                }

                return question;
            }),
        };
        toggleCreateQuest();
        fetchSurveys();
        setTitle("");
        setDescription("");
        setQuestions([]);
        setType('pre');
        fetchSurveys();
        try {
            setLoading(true);
            const response = await api.post(`surveys`,
                payload,
                { 'headers': { Authorization: `Bearer ${user.accessToken}` } }
            );

            setLoading(false);
            setSnackbar({
                open: true,
                message: 'Questionnaire created successfully!',
                severity: 'success',
            });
            fetchSurveys();
        } catch (error) {
            setLoading(false);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Error creating the questionnaire',
                severity: 'error',
            });
        }
    };


    return (
        <Box sx={{ flexDirection: 'column', justifyContent: 'space-between', margin: 0 }}>

            <Typography variant="h4" component="h1" gutterBottom align="center">
                {t('Experiment_create')}
            </Typography>

            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/*experimento */}
            {activeStep === 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        marginTop: 10,
                    }}
                >
                    <Box
                        sx={{
                            width: '60%',
                            padding: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '8px',
                            boxShadow: 4,
                            mx: 'auto',
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                margin: 0,
                                padding: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                '& > *': {
                                    marginBottom: 0,
                                    width: '100%',
                                },
                            }}
                        >
                            <TextField
                                label={t('Experiment_title')}
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                value={titleExperiment}
                                onChange={(e) => settitleExperiment(e.target.value)}
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderColor: titleExperiment ? 'green' : 'red',
                                    },
                                }}
                            />

                            <FormControl fullWidth margin="normal">
                                <InputLabel>{t('Experiment_Type')}</InputLabel>
                                <Select
                                    value={typeExperiment}
                                    onChange={(e) => settypeExperiment(e.target.value)}
                                    label={t('ExperimentTypes')}
                                >
                                    {ExperimentTypes.map((stype) => (
                                        <MenuItem key={stype.value} value={stype.value}>
                                            {stype.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {typeExperiment === 'between-subject' && (
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>{t('Group_Separation_Method')}</InputLabel>
                                    <Select
                                        value={BtypeExperiment}
                                        onChange={(e) => setBtypeExperiment(e.target.value)}
                                        label={t('ExperimentTypesbetween')}
                                    >
                                        {betweenExperimentTypes.map((stype) => (
                                            <MenuItem key={stype.value} value={stype.value}>
                                                {stype.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}

                            <div style={{ width: '100%', marginTop: '16.5px', marginBottom: '16px' }}>
                                <CustomContainer>
                                    <ReactQuill
                                        theme="snow"
                                        value={descriptionExperiment}
                                        onChange={setdescriptionExperiment}
                                        placeholder={t('Experiment_Desc1')}
                                        required
                                    />
                                </CustomContainer>
                            </div>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', width: '100%' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleBack}
                                    disabled={activeStep === 0}
                                    sx={{ maxWidth: '150px' }}
                                >
                                    {t('back')}
                                </Button>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNextExperiment}
                                    sx={{ maxWidth: '150px' }}
                                >
                                    {t('next')}
                                </Button>
                            </Box>

                            <Snackbar
                                open={snackbarOpen}
                                autoHideDuration={3000}
                                onClose={handleCloseSnackbar}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            >
                                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '18%' }}>
                                    {snackbarMessage}
                                </Alert>
                            </Snackbar>
                        </Box>
                    </Box>
                </Box>
            )}


            {/*tarefa */}
            {activeStep === 1 && (
                <Box>
                    <Box
                        sx={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 10,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Box
                            sx={{
                                padding: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#f9f9f9',
                                borderRadius: '8px',
                                boxShadow: 4,
                                width: '60%',
                                marginX: 'auto'
                            }}
                        >
                            <TextField
                                label={t('search_task')}
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
                                    <Box
                                        sx={{
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                        }}
                                    >
                                        {tasks
                                            .filter((task) =>
                                                task.title.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map((task) => (
                                                <Box
                                                    key={task._id}
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        mb: 1,
                                                        padding: 1,
                                                        backgroundColor: '#ffffff',
                                                        borderRadius: '4px',
                                                        boxShadow: 1,
                                                        '&:hover': { backgroundColor: '#e6f7ff' }
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Checkbox
                                                                checked={selectedTasks.includes(task._id)}
                                                                onChange={() => handleSelectTasks(task._id)}
                                                            />
                                                            <ListItemText primary={task.title} sx={{ ml: 1 }} />
                                                        </Box>
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => toggleTaskDescription(task._id)}
                                                            sx={{ ml: 2 }}
                                                        >
                                                            {openTaskIds.includes(task._id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                        </IconButton>
                                                    </Box>

                                                    {openTaskIds.includes(task._id) && (
                                                        <Box
                                                            sx={{
                                                                marginTop: 1,
                                                                padding: 1,
                                                                backgroundColor: '#e8f5e9',
                                                                borderRadius: '4px'
                                                            }}
                                                        >
                                                            <Typography variant="body2">{task.description}</Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            ))}
                                    </Box>
                                </FormControl>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', width: '100%', mt: 2 }}>
                                <Box>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleBack}
                                        sx={{ maxWidth: 150, fontWeight: 'bold', boxShadow: 2 }}
                                    >
                                        {t('back')}
                                    </Button>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{ marginRight: 2 }}>
                                        <Button variant="contained" color="primary" onClick={toggleCreateTask}>
                                            {isCreateTaskOpen ? 'Cancelar' : 'Criar Tarefa'}
                                        </Button>
                                    </Box>
                                    <Box>
                                        <Button variant="contained" color="primary" onClick={handleNext} sx={{ maxWidth: '120px' }}>
                                            {t('next')}
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Dialog
                        open={isCreateTaskOpen}
                        onClose={toggleCreateTask}
                        fullWidth
                        maxWidth="lg"
                        sx={{
                            '& .MuiDialog-paper': {
                                backgroundColor: '#ffffff',
                                borderRadius: '8px',
                                boxShadow: 3,
                                padding: 4
                            }
                        }}
                    >
                        <DialogTitle>{t('task_creation')}</DialogTitle>
                        <DialogContent>
                            <form onSubmit={handleCreate_taskbtt}>
                                <TextField
                                    label={t('task_title')}
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={taskTitle}
                                    onChange={(e) => settaskTitle(e.target.value)}
                                    required
                                />
                                <TextField
                                    label={t('task_summary')}
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={4}
                                    value={taskSummary}
                                    onChange={(e) => settaskSummary(e.target.value)}
                                    required
                                    placeholder={'Forneça informações sobre o sumário da tarefa'}
                                />
                                <div style={{ width: '100%', marginTop: '16.5px', marginBottom: '16px' }}>
                                    <CustomContainer>
                                        <ReactQuill
                                            value={taskDescription}
                                            onChange={(content) => settaskDescription(content)}
                                            placeholder={t('task_Desc1')}
                                            required
                                        />
                                    </CustomContainer>
                                </div>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', width: '100%', mt: 2 }}>
                                <Button variant="contained" onClick={toggleCreateTask} color="primary">
                                    {'Cancelar'}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    onClick={handleCreate_taskbtt}
                                    disabled={isLoading}
                                >
                                    {'Criar'}
                                </Button>
                                </Box>
                            </form>

                            <Snackbar
                                        open={snackbar.open}
                                        autoHideDuration={6000}
                                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                                    >
                                        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                                            {snackbar.message}
                                        </Alert>
                                    </Snackbar>
                        </DialogContent>
                    </Dialog>
                </Box>


            )}

            {/*questionário */}
            {activeStep === 2 && (
                <Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            marginTop: 10,
                        }}
                    >
                        <Box
                            sx={{
                                width: '60%',
                                padding: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#f9f9f9',
                                borderRadius: '8px',
                                boxShadow: 4,
                                mx: 'auto',
                            }}
                        >
                            <TextField
                                label={t('search_survey')}
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
                                <FormControl fullWidth sx={{ maxHeight: 200, overflowY: 'auto' }}>
                                    {surveys
                                        .filter((survey) =>
                                            survey.title.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map((survey) => (
                                            <Box
                                                key={survey._id}
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    mb: 1,
                                                    padding: 1,
                                                    backgroundColor: '#ffffff',
                                                    borderRadius: '4px',
                                                    boxShadow: 1,
                                                    '&:hover': { backgroundColor: '#e6f7ff' }
                                                }}
                                            >
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
                                                        {openSurveyIds.includes(survey._id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                    </IconButton>
                                                </Box>

                                                {openSurveyIds.includes(survey._id) && (
                                                    <Box sx={{
                                                        mt: 1,
                                                        p: 1,
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

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, width: '100%' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleBack}
                                    sx={{ maxWidth: 150, fontWeight: 'bold', boxShadow: 2 }}
                                >
                                    {t('back')}
                                </Button>

                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={toggleCreateQuest}
                                        sx={{ mr: 2 }}
                                    >
                                        {t('create_survey')}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        sx={{ maxWidth: 120 }}
                                    >
                                        {t('next')}
                                    </Button>
                                </Box>
                            </Box>
                        </Box>


                        <Dialog
                            open={isCreateQuestOpen}
                            onClose={toggleCreateQuest}
                            fullWidth
                            maxWidth="lg"
                        >
                            <DialogContent sx={{
                                width: '100%', padding: 3, backgroundColor: '#f9f9f9', mx: 'auto', '& .MuiDialog-paper': {
                                    backgroundColor: '#f9f9f9',
                                }
                            }}>
                                <Box sx={{
                                    width: '100%', padding: 3, backgroundColor: '#f9f9f9', mx: 'auto', '& .MuiDialog-paper': {
                                        backgroundColor: '#f9f9f9',
                                    }
                                }}>
                                    <Typography variant="h4" gutterBottom align="center">
                                        {t('title')}
                                    </Typography>
                                    <form onSubmit={handleSubmitquest}>
                                        <TextField
                                            label={t('surveyTitle')}
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            fullWidth
                                            required
                                            margin="normal"
                                        />
                                        <TextField
                                            label={t('surveyDescription')}
                                            value={description}
                                            required
                                            onChange={(e) => setDescription(e.target.value)}
                                            fullWidth
                                            multiline
                                            rows={4}
                                            margin="normal"
                                        />
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel>{t('surveyType')}</InputLabel>
                                            <Select value={type} onChange={(e) => setType(e.target.value)} label={t('surveyType')}>
                                                {surveyTypes.map((stype) => (
                                                    <MenuItem key={stype.value} value={stype.value}>
                                                        {stype.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>


                                        <Box sx={{ mt: 4 }}>
                                            <Typography variant="h5" gutterBottom>
                                                {t('questions')}
                                            </Typography>
                                            {questions.map((q, index) => (
                                                <Paper key={q.id} sx={{ padding: 2, mb: 2, backgroundColor: '#f9f9f9' }}>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item xs={11}>
                                                            <TextField
                                                                label={t('questionStatement', { index: index + 1 })}
                                                                value={q.statement}
                                                                onChange={(e) => handleQuestionChange(q.id, 'statement', e.target.value)}
                                                                fullWidth
                                                                required
                                                            />
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <IconButton color="error" onClick={() => handleRemoveQuestion(q.id)}>
                                                                <Remove />
                                                            </IconButton>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormControl fullWidth>
                                                                <InputLabel>{t('questionType')}</InputLabel>
                                                                <Select
                                                                    value={q.type}
                                                                    onChange={(e) => handleQuestionChange(q.id, 'type', e.target.value)}
                                                                    label={t('questionType')}
                                                                >
                                                                    {questionTypes.map((qt) => (
                                                                        <MenuItem key={qt.value} value={qt.value}>
                                                                            {qt.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <FormControl fullWidth>
                                                                <InputLabel>{t('required')}</InputLabel>
                                                                <Select
                                                                    value={q.required}
                                                                    onChange={(e) => handleQuestionChange(q.id, 'required', e.target.value)}
                                                                    label={t('required')}
                                                                >
                                                                    <MenuItem value={false}>{t('no')}</MenuItem>
                                                                    <MenuItem value={true}>{t('yes')}</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>


                                                        {(q.type === 'multiple-selection' || q.type === 'multiple-choices') && (
                                                            <Grid item xs={12}>
                                                                <Typography variant="subtitle1">{t('options')}</Typography>
                                                                {q.options.map((opt, optIndex) => (
                                                                    <Box key={opt.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                        <TextField
                                                                            label={t('option', { index: optIndex + 1 })}
                                                                            value={opt.statement}
                                                                            onChange={(e) =>
                                                                                handleOptionChange(q.id, opt.id, 'statement', e.target.value)
                                                                            }
                                                                            fullWidth
                                                                            required
                                                                        />
                                                                        {q.type === 'multiple-choices' && (
                                                                            <TextField
                                                                                label={t('weight')}
                                                                                type="number"
                                                                                value={opt.score}
                                                                                onChange={(e) =>
                                                                                    handleOptionChange(q.id, opt.id, 'score', Number(e.target.value))
                                                                                }
                                                                                sx={{ width: 100, ml: 2 }}
                                                                                required
                                                                            />
                                                                        )}
                                                                        <IconButton
                                                                            color="error"
                                                                            onClick={() => handleRemoveOption(q.id, opt.id)}
                                                                            sx={{ ml: 2 }}
                                                                        >
                                                                            <Remove />
                                                                        </IconButton>
                                                                    </Box>
                                                                ))}
                                                                <Button
                                                                    variant="outlined"
                                                                    startIcon={<Add />}
                                                                    onClick={() => handleAddOption(q.id)}
                                                                >
                                                                    {t('addOption')}
                                                                </Button>
                                                            </Grid>
                                                        )}
                                                    </Grid>
                                                </Paper>
                                            ))}
                                            <Button variant="contained" startIcon={<Add />} onClick={handleAddQuestion}>
                                                {t('addQuestion')}
                                            </Button>
                                        </Box>


                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', width: '100%', mt: 2 }}>
                                            <Button variant="contained" onClick={toggleCreateQuest} color="primary">
                                                {'Cancelar'}
                                            </Button>
                                
                                            <Button type="submit" variant="contained" color="primary" disabled={loading}>
                                                {loading ? <CircularProgress size={24} /> : t('createSurvey')}
                                            </Button>
                                        </Box>
                                    </form>
                                    <Snackbar
                                        open={snackbar.open}
                                        autoHideDuration={6000}
                                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                                    >
                                        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                                            {snackbar.message}
                                        </Alert>
                                    </Snackbar>
                                </Box>
                            </DialogContent>
                        </Dialog>
                    </Box>
                </Box>
            )}

            {/*usuario */}
            {activeStep === 3 && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        marginTop: 10,
                    }}
                >
                    <Box
                        sx={{
                            width: '60%',
                            padding: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '8px',
                            boxShadow: 4,
                            mx: 'auto',
                        }}
                    >
                        <TextField
                            label={t('search_user')}
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
                            <FormControl fullWidth sx={{ maxHeight: 200, overflowY: 'auto' }}>
                                {users
                                    .filter((user) =>
                                        `${user.name} ${user.lastName} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
                                    )

                                    .map((user) => (
                                        <Box
                                            key={user.id}
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                mb: 1,
                                                padding: 1,
                                                backgroundColor: '#ffffff',
                                                borderRadius: '4px',
                                                boxShadow: 1,
                                                '&:hover': { backgroundColor: '#e6f7ff' }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Checkbox
                                                        checked={selectedUsers.includes(user.id)}
                                                        onChange={() => handleSelectUser(user.id)}
                                                    />
                                                    <ListItemText
                                                        primary={`${user.name} ${user.lastName} - ${user.email}`}
                                                        sx={{ ml: 1 }}
                                                    />
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                            </FormControl>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, width: '100%' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleBack}
                                sx={{ maxWidth: 150, fontWeight: 'bold', boxShadow: 2 }}
                            >
                                {t('back')}
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                                sx={{ maxWidth: 120 }}
                            >
                                {t('next')}
                            </Button>
                        </Box>

                        <Snackbar
                            open={snackbarOpen}
                            autoHideDuration={3000}
                            onClose={handleCloseSnackbar}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        >
                            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                                {snackbarMessage}
                            </Alert>
                        </Snackbar>
                    </Box>
                </Box>
            )}

            {activeStep === 4 && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        marginTop: 10,
                    }}
                >
                    <Box
                        sx={{
                            width: '60%',
                            padding: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '8px',
                            boxShadow: 4,
                            mx: 'auto',
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                            {t('revis_conc')}
                        </Typography>

                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12}>
                                <strong>{t('Experiment_title')}:</strong> {titleExperiment}
                            </Grid>
                            <Grid item xs={12}>
                                <strong>{t('typeExperiment1')}</strong>: {t(typeExperiment)}
                            </Grid>

                            {typeExperiment === 'between-subject' && (
                                <Grid item xs={12}>
                                    <strong>{t('Group_Separation_Method')}</strong>: {t(BtypeExperiment)}
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <strong>{t('Experiment_Desc')}:</strong> {descriptionExperiment.replace(/<[^>]+>/g, '')}
                            </Grid>
                            <Grid item xs={12}>
                                <strong>{t('selected_task')}:</strong> {selectedTasks.map(_id => tasks.find(s => s._id === _id)?.title).join(', ') || t('non_selected_task')}
                            </Grid>
                            <Grid item xs={12}>
                                <strong>{t('selected_surveys')}:</strong> {selectedSurveys.map(_id => surveys.find(s => s._id === _id)?.title).join(', ') || t('non_selected_survey')}
                            </Grid>
                            <Grid item xs={12}>
                                <strong>{t('selected_user')}:</strong> {selectedUsers
                                    .map(id => {
                                        const user = users.find(s => s.id === id);
                                        return user ? ` ${user.name} ${user.lastName} - ${user.email} ` : '';
                                    })
                                    .join(', ') || t('non_selected_user')}
                            </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, width: '100%' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleBack}
                                sx={{ maxWidth: 150, fontWeight: 'bold', boxShadow: 2 }}
                            >
                                {t('back')}
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCreateExp}
                                disabled={isLoading}
                                fullWidth
                                sx={{ maxWidth: 200, fontWeight: 'bold', boxShadow: 2 }}
                            >
                                {isLoading ? t('creating') : t('create')}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export { CreateExperiment };
