import React from 'react';
import { useState, useContext, useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import StepContext from './context/StepContext';
import {
    TextField,
    Button,
    Typography,
    Box,
    ListItemText,
    DialogTitle,
    FormControl,
    Snackbar,
    Alert,
    CircularProgress,
    IconButton,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Dialog,
    DialogContent,
    Checkbox,
    FormControlLabel,
    Grid2
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Add, CancelOutlined, Done, Remove } from '@mui/icons-material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { api } from '../../../config/axios';

const EditExperimentStep2 = () => {
    const [
        step,
        setStep,
        ExperimentTitle,
        setExperimentTitle,
        ExperimentType,
        setExperimentType,
        BtypeExperiment,
        setBtypeExperiment,
        ExperimentDesc,
        setExperimentDesc,
        ExperimentId
    ] = useContext(StepContext);
    const [ExperimentSurveys, setExperimentSurveys] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateQuestOpen, setIsCreateQuestOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('pre');
    const [isLoadingSurvey, setIsLoadingSurvey] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [openSurveyIds, setOpenSurveyIds] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [isValidTitleSurvey, setIsValidTitleSurvey] = useState(true);
    const [isValidDescSurvey, setIsValidDescSurvey] = useState(true);
    const isValidFormSurvey = isValidTitleSurvey && title && isValidDescSurvey && description;
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [SurveyToDeleteId, setSurveyToDeleteId] = useState(null);
    const [editedSurvey, setEditedSurvey] = useState(null);
    const [IndexId, setIndexId] = useState(null);

    const generateRandomId = () => `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    useEffect(() => {
        fetchSurvey();
    }, [user, t]);
    const handleOpenDeleteDialog = (index) => {
        setSurveyToDeleteId(ExperimentSurveys[index])
        setIsDeleteDialogOpen(true);
    };
    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    };

    const handleDeleteSurvey = async () => {
        try {
            await api.delete(`/survey2/${SurveyToDeleteId._id}`, {
                headers: { Authorization: `Bearer ${user.accessToken}` },
            });
            handleCloseDeleteDialog();
            fetchSurvey();
        } catch (error) {
            console.error(t('Error in Search'), error);
        }
    };

    const fetchSurvey = async () => {
        try {
            const response = await api.get(`survey2`, {
                headers: { Authorization: `Bearer ${user.accessToken}` },
            });
            const filteredsurveys = response.data
            setExperimentSurveys(filteredsurveys);
        } catch (error) {
            console.error(t('Error in Search'), error);
        }
    };


    const handleCreateSurvey = async (e) => {
        e.preventDefault();
        const payload = {
            name: title,
            experimentId: ExperimentId,
            title,
            description,
            type,
            questions: questions.map(({ statement, type, required, options }) => ({
                statement,
                type,
                required,
                otherStatement: "string",
                helperText: "string",
                ...(type === 'multiple-selection' || type === 'multiple-choices'
                    ? {
                        options: options.map(({ statement, subquestion, score }) => ({
                            statement,
                            ...(subquestion
                                ? {
                                    subquestion: {
                                        statement: subquestion.statement,
                                        type: subquestion.type,
                                        required: subquestion.required,
                                        options: (subquestion.options ?? []).map(({ statement, score }) => ({
                                            statement,
                                            score,
                                        })),
                                    },
                                }
                                : {}),
                            score: score ? score : 0,
                        })),
                    }
                    : {options: [
                        {
                            statement: '',
                            score: 0
                        }
                    ]}),
            })),
        };

        try {
            questions.map(question => {
                if(question.type === 'multiple-selection' || question.type === 'multiple-choices'){
                    if(question.options.length === 0)
                        throw new Error("Need to create options");
                }
            })
            const response = await api.post(`survey2`, payload, {
                headers: { Authorization: `Bearer ${user.accessToken}` },
            });

            console.log(t('Survey created successfully'), response.data);
            setTitle('');
            setDescription('');
            setQuestions([]);
            setType('pre');
            toggleCreateQuest();
            fetchSurvey();
        } catch (error) {
            console.error(t('Error in Create Survey'), error);
        }
    };


    const toggleSurveyDescription = (surveyId) => {
        if (openSurveyIds.includes(surveyId)) {
            setOpenSurveyIds(openSurveyIds.filter((id) => id !== surveyId));
        } else {
            setOpenSurveyIds([...openSurveyIds, surveyId]);
        }
    };

    const toggleCreateQuest = () => {
        setIsCreateQuestOpen((prev) => !prev);
    };
    const toggleEditQuest = () => {
        setIsEditDialogOpen((prev) => !prev);
    };

    const handleEditQuestion = (questionId, field, value) => {
        setEditedSurvey((prev) => ({
            ...prev,
            questions: prev.questions.map((q) =>
                q.id === questionId ? { ...q, [field]: value } : q
            ),
        }));
    };

    const handleAddQuestionEdit = () => {
        setEditedSurvey((prev) => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    id: generateRandomId(),
                    statement: '',
                    type: 'open',
                    required: false,
                    options: [],
                },
            ],
        }));
    };

    const handleRemoveQuestionEdit = (id) => {
        setEditedSurvey((prev) => ({
            ...prev,
            questions: prev.questions.filter((q) => q.id !== id),
        }));
    };

    const handleAddOptionEdit = (questionId) => {
        setEditedSurvey((prev) => ({
            ...prev,
            questions: prev.questions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        options: [
                            ...q.options,
                            { id: generateRandomId(), statement: '', score: 0, subquestion: null },
                        ],
                    }
                    : q
            ),
        }));
    };

    const handleRemoveOptionEdit = (questionId, optionId) => {
        setEditedSurvey((prev) => ({
            ...prev,
            questions: prev.questions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        options: q.options.filter((opt) => opt.id !== optionId),
                    }
                    : q
            ),
        }));
    };

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: generateRandomId(),
                statement: '',
                type: 'open',
                required: false,
                options: [],
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
                            { id: generateRandomId(), statement: '', score: 0, subquestion: null },
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

    const handleOptionChange = (questionId, optionId, key, value) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        options: q.options.map((opt) =>
                            opt.id === optionId ? { ...opt, [key]: value } : opt
                        ),
                    }
                    : q
            )
        );
    };

    const handleEditOption = (questionId, optionId, field, value) => {
        setEditedSurvey((prev) => ({
            ...prev,
            questions: prev.questions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        options: q.options.map((opt) =>
                            opt.id === optionId ? { ...opt, [field]: value } : opt
                        ),
                    }
                    : q
            ),
        }));
    };

    const handleEditSurveysave = async (event) => {
        event.preventDefault();

        try {
            setExperimentSurveys((prev) => {
                const updatedSurveys = [...prev];
                updatedSurveys[IndexId] = editedSurvey;
                return updatedSurveys;
            });
            await api.patch(`/survey2/${editedSurvey._id}`, editedSurvey, {
                headers: { Authorization: `Bearer ${user.accessToken}` },
            });

            toggleEditQuest();
            fetchSurvey();
        } catch (error) {
            console.error('Erro na atualização da tarefa:', error);
        }
    };

    const addIdOnSurvey = (questions) => {
        if (!questions || !Array.isArray(questions)) return;
    
        questions.forEach((question) => {
            question.id = generateRandomId();
    
            if (question.options && Array.isArray(question.options)) {
                question.options.forEach((option) => {
                    option.id = generateRandomId(); 
    
                    if (option.subquestion && option.subquestion.options) {
                        addIdOnSurvey(option.subquestion.options);
                    }
                });
            }
        });
    };

    const handleEditSurvey = (index) => {
        setIndexId(index);
        let surveyToEdit = ExperimentSurveys[index];
        if (surveyToEdit) {
            addIdOnSurvey(surveyToEdit.questions);
            setEditedSurvey(surveyToEdit);
            setIsEditDialogOpen(true);
        }
    };

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
                        width: {xs: '100%',sm:'60%'},
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
                            {Array.isArray(ExperimentSurveys) &&
                                ExperimentSurveys.filter((survey) =>
                                    survey.title.toLowerCase().includes(searchTerm.toLowerCase())
                                ).map((survey, index) => (
                                    <Box
                                        key={index}
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
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <ListItemText primary={survey.title} sx={{ ml: 1 }} />
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleOpenDeleteDialog(index)}
                                                    sx={{ ml: 1 }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleEditSurvey(index)}
                                                    sx={{ ml: 2 }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => toggleSurveyDescription(index)}
                                                    sx={{ ml: 1 }}
                                                >
                                                    {openSurveyIds.includes(index) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                </IconButton>
                                            </Box>
                                        </Box>

                                        {openSurveyIds.includes(index) && (
                                            <Box
                                                sx={{
                                                    marginTop: 0,
                                                    padding: 1,
                                                    backgroundColor: '#E8E8E8',
                                                    borderRadius: '4px',
                                                    maxHeight: '150px',
                                                    overflowY: 'auto',
                                                    wordBreak: 'break-word',
                                                }}
                                                dangerouslySetInnerHTML={{ __html: survey.description }}
                                            />
                                        )}
                                    </Box>
                                ))}
                        </FormControl>
                    )}

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 2,
                            width: '100%',
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={toggleCreateQuest}
                            sx={{ mr: 2 }}
                        >
                            {t('create_survey')}
                        </Button>
                    </Box>

                </Box>
                <Dialog
                    open={isDeleteDialogOpen}
                    onClose={handleCloseDeleteDialog}
                    fullWidth
                    maxWidth="xs"
                    sx={{
                        '& .MuiDialog-paper': {
                            backgroundColor: '#f9fafb',
                            borderRadius: '12px',
                            boxShadow: 5,
                            padding: 4,
                        },
                    }}
                >
                    <DialogTitle
                        sx={{
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            color: '#111827',
                            textAlign: 'center',
                            paddingBottom: '8px',
                        }}
                    >
                        {t('confirm_delete')}
                    </DialogTitle>
                    <DialogContent
                        sx={{
                            textAlign: 'center',
                            color: '#6b7280',
                        }}
                    >
                        <Box sx={{ marginBottom: 3 }}>
                            <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.5 }}>
                                {t('delete_confirmation_message')}
                            </p>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={handleCloseDeleteDialog}
                                sx={{
                                    borderColor: '#d1d5db',
                                    color: '#374151',
                                    ':hover': {
                                        backgroundColor: '#f3f4f6',
                                    },
                                }}
                            >
                                {t('cancel')}
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDeleteSurvey}
                                sx={{
                                    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
                                }}
                            >
                                {t('delete')}
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>

                <Dialog
                    open={isCreateQuestOpen}
                    onClose={toggleCreateQuest}
                    fullWidth
                    sx={{'& .MuiDialog-paper': {
                        margin: {xs: 0, sm: 32},
                        height: {xs: '100vh', sm:'100%'},
                        maxWidth: {xs: '100vw', sm: 'calc(100% - 64px)'},
                        width: {xs: '100vw', sm: 'calc(100% - 64px)'},
                        }
                    }}
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
                                            <Grid2 container spacing={2} alignItems="center">
                                                <Grid2 item xs={11}>
                                                    <TextField
                                                        label={t('questionStatement', { index: index + 1 })}
                                                        value={q.statement}
                                                        onChange={(e) => handleQuestionChange(q.id, 'statement', e.target.value)}
                                                        fullWidth
                                                        required
                                                    />
                                                </Grid2>
                                                <Grid2 item xs={1}>
                                                    <IconButton color="error" onClick={() => handleRemoveQuestion(q.id)}>
                                                        <Remove />
                                                    </IconButton>
                                                </Grid2>
                                                <Grid2 item xs={6}>
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
                                                </Grid2>
                                                <Grid2 item xs={6}>
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
                                                </Grid2>

                                                {(q.type === 'multiple-selection' || q.type === 'multiple-choices') && (
                                                    <Grid2 item xs={12}>
                                                        <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                                                            {t('options')}
                                                        </Typography>
                                                        {q.options.map((opt, optIndex) => (
                                                            <Box key={opt.id} sx={{ mb: 2 }}>

                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
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
                                                                            value={opt.score || 0}
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

                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                checked={opt.subquestion !== null}
                                                                                onChange={(e) =>
                                                                                    handleOptionChange(q.id, opt.id, 'subquestion', e.target.checked ? { statement: '', type: 'open', required: false } : null)
                                                                                }
                                                                            />
                                                                        }
                                                                        label={t('hasSubquestion')}
                                                                    />

                                                                    {opt.subquestion !== null && (
                                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, ml: 2, marginTop: 2 }}>
                                                                            <Box>
                                                                                <TextField
                                                                                    label={t('subquestion_E')}
                                                                                    value={opt.subquestion.statement}
                                                                                    onChange={(e) =>
                                                                                        handleOptionChange(q.id, opt.id, 'subquestion', {
                                                                                            ...opt.subquestion,
                                                                                            statement: e.target.value
                                                                                        })
                                                                                    }
                                                                                    fullWidth
                                                                                    required
                                                                                />
                                                                            </Box>

                                                                            <FormControl fullWidth>
                                                                                <InputLabel>{t('subquestionType')}</InputLabel>
                                                                                <Select
                                                                                    value={opt.subquestion.type}
                                                                                    onChange={(e) =>
                                                                                        handleOptionChange(q.id, opt.id, 'subquestion', { ...opt.subquestion, type: e.target.value })
                                                                                    }
                                                                                    label={t('subquestionType')}
                                                                                >
                                                                                    {questionTypes.map((qt) => (
                                                                                        <MenuItem key={qt.value} value={qt.value}>
                                                                                            {qt.label}
                                                                                        </MenuItem>
                                                                                    ))}
                                                                                </Select>
                                                                            </FormControl>

                                                                            {opt.subquestion.type === 'multiple-selection' && (

                                                                                <Box>
                                                                                    <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>
                                                                                        {t('options')}
                                                                                    </Typography>
                                                                                    {opt.subquestion.options?.map((subOpt, subOptIndex) => (
                                                                                        <Box key={subOpt.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                                                            <TextField
                                                                                                label={t('option', { index: subOptIndex + 1 })}
                                                                                                value={subOpt.statement}
                                                                                                onChange={(e) =>
                                                                                                    handleOptionChange(q.id, opt.id, 'subquestion', {
                                                                                                        ...opt.subquestion,
                                                                                                        options: opt.subquestion.options.map((o, i) =>
                                                                                                            i === subOptIndex ? { ...o, statement: e.target.value } : o
                                                                                                        ),
                                                                                                    })
                                                                                                }
                                                                                                fullWidth
                                                                                                required
                                                                                            />
                                                                                            <IconButton
                                                                                                color="error"
                                                                                                onClick={() =>
                                                                                                    handleOptionChange(q.id, opt.id, 'subquestion', {
                                                                                                        ...opt.subquestion,
                                                                                                        options: opt.subquestion.options.filter((_, i) => i !== subOptIndex),
                                                                                                    })
                                                                                                }
                                                                                            >
                                                                                                <Remove />
                                                                                            </IconButton>
                                                                                        </Box>
                                                                                    ))}
                                                                                    <Button
                                                                                        variant="outlined"
                                                                                        startIcon={<Add />}
                                                                                        onClick={() =>
                                                                                            handleOptionChange(q.id, opt.id, 'subquestion', {
                                                                                                ...opt.subquestion,
                                                                                                options: [
                                                                                                    ...(opt.subquestion.options || []),
                                                                                                    { id: generateRandomId(), statement: '' },
                                                                                                ],
                                                                                            })
                                                                                        }
                                                                                    >
                                                                                        {t('addOption')}
                                                                                    </Button>
                                                                                </Box>
                                                                            )}

                                                                            {opt.subquestion.type === 'multiple-choices' && (
                                                                                <Box>
                                                                                    {opt.subquestion.options?.map((subOpt, subOptIndex) => (
                                                                                        <Box key={subOpt.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                                                            <TextField
                                                                                                label={t('option', { index: subOptIndex + 1 })}
                                                                                                value={subOpt.statement}
                                                                                                onChange={(e) =>
                                                                                                    handleOptionChange(q.id, opt.id, 'subquestion', {
                                                                                                        ...opt.subquestion,
                                                                                                        options: opt.subquestion.options.map((o, i) =>
                                                                                                            i === subOptIndex ? { ...o, statement: e.target.value } : o
                                                                                                        ),
                                                                                                    })
                                                                                                }
                                                                                                fullWidth
                                                                                                required
                                                                                            />
                                                                                            <TextField
                                                                                                label={t('weight')}
                                                                                                type="number"
                                                                                                value={subOpt.score || 0}
                                                                                                onChange={(e) =>
                                                                                                    handleOptionChange(q.id, opt.id, 'subquestion', {
                                                                                                        ...opt.subquestion,
                                                                                                        options: opt.subquestion.options.map((o, i) =>
                                                                                                            i === subOptIndex ? { ...o, score: Number(e.target.value) } : o
                                                                                                        ),
                                                                                                    })
                                                                                                }
                                                                                                sx={{ width: 100 }}
                                                                                                required
                                                                                            />
                                                                                            <IconButton
                                                                                                color="error"
                                                                                                onClick={() =>
                                                                                                    handleOptionChange(q.id, opt.id, 'subquestion', {
                                                                                                        ...opt.subquestion,
                                                                                                        options: opt.subquestion.options.filter((_, i) => i !== subOptIndex),
                                                                                                    })
                                                                                                }
                                                                                            >
                                                                                                <Remove />
                                                                                            </IconButton>
                                                                                        </Box>
                                                                                    ))}
                                                                                    <Button
                                                                                        variant="outlined"
                                                                                        startIcon={<Add />}
                                                                                        onClick={() =>
                                                                                            handleOptionChange(q.id, opt.id, 'subquestion', {
                                                                                                ...opt.subquestion,
                                                                                                options: [
                                                                                                    ...(opt.subquestion.options || []),
                                                                                                    { id: generateRandomId(), statement: '', score: 0 },
                                                                                                ],
                                                                                            })
                                                                                        }
                                                                                    >
                                                                                        {t('addOption')}
                                                                                    </Button>
                                                                                </Box>
                                                                            )}
                                                                        </Box>
                                                                    )}
                                                                </Box>
                                                            </Box>
                                                        ))}
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<Add />}
                                                            onClick={() => handleAddOption(q.id)}
                                                        >
                                                            {t('addOption')}
                                                        </Button>
                                                    </Grid2>
                                                )}
                                            </Grid2>
                                        </Paper>
                                    ))}
                                    <Button variant="contained" startIcon={<Add />} onClick={handleAddQuestion}>
                                        {t('addQuestion')}
                                    </Button>
                                </Box>


                                <Box sx={{ display: {xs: 'flex', sm: 'none'}, justifyContent: 'space-between', marginTop: 'auto', width: '100%', mt: 2 }}>
                                    <Button variant="contained" onClick={toggleCreateQuest} color="primary">
                                        <CancelOutlined/>
                                    </Button>
                                    <Button type="submit" variant="contained" color="primary" disabled={!isValidFormSurvey || isLoadingSurvey}>
                                        {isLoadingSurvey ? <CircularProgress size={24} /> : <Done/>}
                                    </Button>
                                </Box>
                                <Box sx={{ display: {xs: 'none', sm: 'flex'}, justifyContent: 'space-between', marginTop: 'auto', width: '100%', mt: 2 }}>
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

                {isEditDialogOpen &&
                    <Dialog
                        open={isEditDialogOpen}
                        onClose={toggleEditQuest}
                        fullWidth
                        maxWidth="lg"
                    >
                        <DialogContent sx={{ backgroundColor: '#f9f9f9', padding: 3 }}>
                            <Typography variant="h4" gutterBottom align="center">
                                {t('editSurvey')}
                            </Typography>
                            <form onSubmit={handleEditSurveysave}>
                                <TextField
                                    label={t('surveyTitle')}
                                    value={editedSurvey.title}
                                    onChange={(e) => setEditedSurvey({ ...editedSurvey, title: e.target.value })}
                                    fullWidth
                                    required
                                    margin="normal"
                                />
                                <TextField
                                    label={t('surveyDescription')}
                                    value={editedSurvey.description}
                                    onChange={(e) => setEditedSurvey({ ...editedSurvey, description: e.target.value })}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    required
                                    margin="normal"
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>{t('surveyType')}</InputLabel>
                                    <Select
                                        value={editedSurvey.type}
                                        onChange={(e) => setEditedSurvey({ ...editedSurvey, type: e.target.value })}
                                        label={t('surveyType')}
                                    >
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
                                    {editedSurvey.questions.map((q, index) => (
                                        <Paper key={q.id} sx={{ padding: 2, mb: 2 }}>
                                            <Grid2 container spacing={2} alignItems="center">
                                                <Grid2 item xs={11}>
                                                    <TextField
                                                        label={t('questionStatement', { index: index + 1 })}
                                                        value={q.statement}
                                                        onChange={(e) =>
                                                            handleEditQuestion(q.id, 'statement', e.target.value)
                                                        }
                                                        fullWidth
                                                        required
                                                    />
                                                </Grid2>
                                                <Grid2 item xs={1}>
                                                    <IconButton color="error" onClick={() => handleRemoveQuestionEdit(q.id)}>
                                                        <Remove />
                                                    </IconButton>
                                                </Grid2>
                                                <Grid2 item xs={6}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>{t('questionType')}</InputLabel>
                                                        <Select
                                                            value={q.type}
                                                            onChange={(e) => handleEditQuestion(q.id, 'type', e.target.value)}
                                                            label={t('questionType')}
                                                        >
                                                            {questionTypes.map((qt) => (
                                                                <MenuItem key={qt.value} value={qt.value}>
                                                                    {qt.label}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid2>
                                                <Grid2 item xs={6}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>{t('required')}</InputLabel>
                                                        <Select
                                                            value={q.required}
                                                            onChange={(e) => handleEditQuestion(q.id, 'required', e.target.value)}
                                                            label={t('required')}
                                                        >
                                                            <MenuItem value={false}>{t('no')}</MenuItem>
                                                            <MenuItem value={true}>{t('yes')}</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid2>

                                                {(q.type === 'multiple-selection' || q.type === 'multiple-choices') && (
                                                    <Grid2 item xs={12}>
                                                        <Typography variant="subtitle1" sx={{ marginBottom: 2 }}>{t('options')}</Typography>

                                                        {q.options.map((opt, optIndex) => (
                                                            <Box key={opt.id} sx={{ mb: 2 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                    <TextField
                                                                        label={t('option', { index: optIndex + 1 })}
                                                                        value={opt.statement}
                                                                        onChange={(e) =>
                                                                            handleEditOption(q.id, opt.id, 'statement', e.target.value)
                                                                        }
                                                                        fullWidth
                                                                        required
                                                                    />
                                                                    {q.type === 'multiple-choices' && (
                                                                        <TextField
                                                                            label={t('weight')}
                                                                            type="number"
                                                                            value={opt.score || 0}
                                                                            onChange={(e) =>
                                                                                handleEditOption(q.id, opt.id, 'score', Number(e.target.value))
                                                                            }
                                                                            sx={{ width: 100, ml: 2 }}
                                                                            required
                                                                        />
                                                                    )}
                                                                    <IconButton
                                                                        color="error"
                                                                        onClick={() => handleRemoveOptionEdit(q.id, opt.id)}
                                                                        sx={{ ml: 2 }}
                                                                    >
                                                                        <Remove />
                                                                    </IconButton>
                                                                </Box>

                                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                checked={opt.subquestion !== null}
                                                                                onChange={(e) =>
                                                                                    handleEditOption(q.id, opt.id, 'subquestion', e.target.checked ? '' : null)
                                                                                }
                                                                            />
                                                                        }
                                                                        label={t('hasSubquestion')}
                                                                    />
                                                                    {opt.subquestion !== null && (
                                                                        <TextField
                                                                            label={t('subquestion')}
                                                                            value={opt.subquestion}
                                                                            onChange={(e) =>
                                                                                handleEditOption(q.id, opt.id, 'subquestion', e.target.value)
                                                                            }
                                                                            fullWidth
                                                                            required
                                                                            sx={{ flex: 1, ml: 2 }}
                                                                        />
                                                                    )}
                                                                </Box>
                                                            </Box>
                                                        ))}

                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<Add />}
                                                            onClick={() => handleAddOptionEdit(q.id)}
                                                        >
                                                            {t('addOption')}
                                                        </Button>
                                                    </Grid2>
                                                )}
                                            </Grid2>
                                        </Paper>
                                    ))}
                                    <Button variant="contained" startIcon={<Add />} onClick={handleAddQuestionEdit}>
                                        {t('addQuestion')}
                                    </Button>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                    <Button variant="outlined" onClick={toggleEditQuest}>
                                        {t('cancel')}
                                    </Button>
                                    <Button type="submit" variant="contained" color="primary">
                                        {t('save')}
                                    </Button>
                                </Box>
                            </form>
                        </DialogContent>
                    </Dialog>
                }
            </Box>
        </Box>
    )
}

export default EditExperimentStep2;
