import { useState } from 'react';
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
    IconButton,
    Grid,
    Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Add, Remove } from '@mui/icons-material';

const CreateSurveys = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('pre');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const questionTypes = [
        { value: 'open', label: 'Questão Aberta' },
        { value: 'multiple-selection', label: 'Seleção Múltipla' },
        { value: 'multiple-choices', label: 'Múltipla Escolha' },
    ];

    const surveyTypes = [
        { value: 'pre', label: 'Pré' },
        { value: 'demo', label: 'Demo' },
        { value: 'post', label: 'Pós' },
    ];

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Date.now(),
                statement: '',
                type: 'open',
                required: false,
                options: [], // Para tipos que possuem opções
                subQuestions: [], // Para subquestões
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

    const handleRemoveSubQuestion = (questionId, optionId) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        options: q.options.map((opt) =>
                            opt.id === optionId
                                ? {
                                    ...opt,
                                    subQuestion: null,
                                }
                                : opt
                        ),
                    }
                    : q
            )
        );
    };
//submeter questionario
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
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

        try {
            setLoading(true);
            await api.post('/searching-as-learning/surveys', payload);
            setLoading(false);
            setSnackbar({ open: true, message: 'Questionário criado com sucesso!', severity: 'success' });
            navigate('/surveys');
        } catch (error) {
            setLoading(false);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Erro ao criar o questionário',
                severity: 'error',
            });
        }
    };

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                {t('title')}
            </Typography>
            <form onSubmit={handleSubmit}>
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
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>label={t('surveyType')}</InputLabel>
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
                        <Paper key={q.id} sx={{ padding: 2, mb: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={11}>
                                    <TextField
                                        label={`Enunciado da Questão ${index + 1}`}
                                        //label={t('form.questionStatement',{ index: index + 1 })}
                                        //label={t('questionStatement')} {` ${index + 1}`}
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
                                            label={t('form.questionType')}
                                        >
                                            {questionTypes.map((qt) => (
                                                <MenuItem key={qt.value} value={qt.value}>
                                                    {qt.label}
                                                </MenuItem>

                                                //<MenuItem value="multiple-choice">{t('form.multipleChoice')}</MenuItem>
                                                //<MenuItem value="open-ended">{t('form.openEnded')}</MenuItem>
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
                                        <Typography variant="subtitle1">Opções</Typography>
                                        {q.options.map((opt, optIndex) => (
                                            <Box key={opt.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <TextField
                                                    label={`Opção ${optIndex + 1}`}
                                                    //label={t('form.option', { index: optIndex + 1 })}
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

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> :  t('createSurvey')}
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
    );
};

export { CreateSurveys };
