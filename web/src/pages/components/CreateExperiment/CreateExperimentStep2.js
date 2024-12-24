import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { api } from '../../../config/axios';
import StepContext from './context/StepContextCreate';
import {
    TextField,
    Button,
    Typography,
    Box,
    Checkbox,
    ListItemText,
    FormControl,
    Snackbar,
    Alert,
    CircularProgress,
    IconButton,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Paper,
    Dialog,
    DialogContent
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Add, Remove } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess'


const CreateExperimentStep2 = () => {
    const {
        step,
        setStep,
    } = useContext(StepContext);
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateQuestOpen, setIsCreateQuestOpen] = useState(false);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('pre');
    const [surveys, setSurveys] = useState([]);
    const [selectedSurveys, setSelectedSurveys] = useState([]);
    const [isLoadingSurvey, setIsLoadingSurvey] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [openSurveyIds, setOpenSurveyIds] = useState([]);
    const [questions, setQuestions] = useState([]);


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
        fetchSurveys();
    }, [user, t]);

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };


    const handleCreateSurvey = async (e) => {
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
            setIsLoadingSurvey(true);
            const response = await api.post(`surveys`,
                payload,
                { 'headers': { Authorization: `Bearer ${user.accessToken}` } }
            );

            setIsLoadingSurvey(false);
            setSnackbar({
                open: true,
                message: 'Questionnaire created successfully!',
                severity: 'success',
            });
            fetchSurveys();
        } catch (error) {
            setIsLoadingSurvey(false);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Error creating the questionnaire',
                severity: 'error',
            });
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




    const [isValidTitleSurvey, setIsValidTitleSurvey] = useState(true);
    const [isValidDescSurvey, setIsValidDescSurvey] = useState(true);

    const isValidFormSurvey = isValidTitleSurvey && title && isValidDescSurvey && description;

    const handleNameChangeTitleSurvey = (e) => {
        const inputName = e.target.value;
        setTitle(inputName);
        setIsValidTitleSurvey(inputName.trim() !== "");
    };
    const handleNameChangeDescSurvey = (e) => {
        const inputName = e.target.value;
        setDescription(inputName);
        setIsValidDescSurvey(inputName.trim() !== "");
    };




    return (
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

                    {isLoadingSurvey ? (
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
                            <form onSubmit={handleCreateSurvey}>
                                <TextField
                                    label={t('surveyTitle')}
                                    value={title}
                                    onChange={handleNameChangeTitleSurvey}
                                    fullWidth
                                    required
                                    margin="normal"
                                />
                                <TextField
                                    label={t('surveyDescription')}
                                    value={description}
                                    required
                                    onChange={handleNameChangeDescSurvey}
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

                                    <Button type="submit" variant="contained" color="primary" disabled={!isValidFormSurvey || isLoadingSurvey}>

                                        {isLoadingSurvey ? <CircularProgress size={24} /> : t('createSurvey')}
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
    )
}

export default CreateExperimentStep2;
