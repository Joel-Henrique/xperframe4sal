import React, { useState, useContext } from 'react';
import {
    Box,
    TextField,
    Button,
    FormControl,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    CircularProgress,
    ListItemText,
    styled,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import StepContext from './context/StepContextCreate';
import 'react-quill/dist/quill.snow.css';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

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
const CreateExperimentStep1 = () => {
    const { step, setStep, ExperimentTasks, setExperimentTasks } = useContext(StepContext);
    const { t } = useTranslation();
    const [isLoadingTask, setIsLoadingTask] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [openTaskIds, setOpenTaskIds] = useState([]);

    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);

    const [taskTitle, setTaskTitle] = useState("");
    const [taskSummary, setTaskSummary] = useState("");
    const [taskDescription, setTaskDescription] = useState("");

    const [editTaskIndex, setEditTaskIndex] = useState(null);
    const [taskTitleEdit, setTaskTitleEdit] = useState("");
    const [taskSummaryEdit, setTaskSummaryEdit] = useState("");
    const [taskDescriptionEdit, setTaskDescriptionEdit] = useState("");

    const [isValidTitleTask, setIsValidTitleTask] = React.useState(true);
    const [isValidSumaryTask, setIsValidSumaryTask] = React.useState(true);

    const [isValidTitleTaskEdit, setIsValidTitleTaskEdit] = React.useState(true);
    const [isValidSumaryTaskEdit, setIsValidSumaryTaskEdit] = React.useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [taskToDeleteIndex, setTaskToDeleteIndex] = useState(null);


    const handleOpenDeleteDialog = (index) => {
        setTaskToDeleteIndex(index);
        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
        setTaskToDeleteIndex(null);
    };

    const handleDeleteTask = () => {
        setExperimentTasks((prev) => prev.filter((_, i) => i !== taskToDeleteIndex));
        handleCloseDeleteDialog();
    };

    const handleNameChangeTitleTask = (e) => {
        const value = e.target.value;
        setTaskTitle(value);
        setIsValidTitleTask(value.trim().length > 0);
    };

    const handleNameChangeSumaryTask = (e) => {
        const value = e.target.value;
        setTaskSummary(value);
        setIsValidSumaryTask(value.trim().length > 0);
    };

    const handleNameChangeTitleTaskEdit = (e) => {
        const value = e.target.value;
        setTaskTitleEdit(value);
        setIsValidTitleTaskEdit(value.trim().length > 0);
    };

    const handleNameChangeSummaryTaskEdit = (e) => {
        const value = e.target.value;
        setTaskSummaryEdit(value);
        setIsValidSumaryTaskEdit(value.trim().length > 0);
    };


    const isValidFormTask = isValidTitleTask && taskTitle && isValidSumaryTask && taskSummary;
    const isValidFormTaskEdit = isValidTitleTaskEdit && taskTitleEdit && isValidSumaryTaskEdit && taskSummaryEdit;

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleCancelEditTask = () => {
        setTaskTitleEdit('');
        setTaskSummaryEdit('');
        setTaskDescriptionEdit('');
        setIsValidTitleTaskEdit(true);
        setIsValidSumaryTaskEdit(true);
        toggleEditTask();
    };
    const handleCancelTask = () => {
        setTaskTitle('');
        setTaskSummary('');
        setTaskDescription('');
        setIsValidTitleTask(true);
        setIsValidSumaryTask(true);
        toggleCreateTask();
    };

    const toggleCreateTask = () => setIsCreateTaskOpen((prev) => !prev);
    const toggleEditTask = () => setIsEditTaskOpen((prev) => !prev);

    const toggleTaskDescription = (index) => {
        setOpenTaskIds((prev) =>
            prev.includes(index) ? prev.filter((id) => id !== index) : [...prev, index]
        );
    };

    const handleCreateTask = (e) => {
        e.preventDefault();
        const newTask = {
            title: taskTitle,
            summary: taskSummary,
            description: taskDescription
        };
        setExperimentTasks((prev) => [...prev, newTask]);
        toggleCreateTask();
        setTaskTitle("");
        setTaskSummary("");
        setTaskDescription("");
    };

    const handleEditTaskSubmit = (e) => {
        e.preventDefault();
        const updatedTask = {
            title: taskTitleEdit,
            summary: taskSummaryEdit,
            description: taskDescriptionEdit
        };
        setExperimentTasks((prev) => {
            const updatedTasks = [...prev];
            updatedTasks[editTaskIndex] = updatedTask;
            return updatedTasks;
        });
        toggleEditTask();
    };

    const handleEditTask = (index) => {
        setEditTaskIndex(index);
        const task = ExperimentTasks[index];
        setTaskTitleEdit(task.title);
        setTaskSummaryEdit(task.summary);
        setTaskDescriptionEdit(task.description);
        toggleEditTask();
    };

    return (
        <Box>
            <Box
                sx={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10,
                    display: 'flex',
                    flexDirection: 'column'
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

                    {isLoadingTask ? (
                        <CircularProgress />
                    ) : (
                        <FormControl fullWidth>
                            <Box
                                sx={{
                                    maxHeight: '200px',
                                    overflowY: 'auto'
                                }}
                            >
                                {Array.isArray(ExperimentTasks) &&
                                    ExperimentTasks.filter((task) =>
                                        task.title.toLowerCase().includes(searchTerm.toLowerCase())
                                    ).map((task, index) => (
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
                                                    <ListItemText primary={task.title} sx={{ ml: 1 }} />
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
                                                        onClick={() => handleEditTask(index)}
                                                        sx={{ ml: 2 }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => toggleTaskDescription(index)}
                                                        sx={{ ml: 1 }}
                                                    >
                                                        {openTaskIds.includes(index) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                    </IconButton>
                                                </Box>
                                            </Box>

                                            {openTaskIds.includes(index) && (
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
                                                    dangerouslySetInnerHTML={{ __html: task.description }}
                                                />
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
                            onClick={handleDeleteTask}
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
                open={isEditTaskOpen}
                onClose={toggleEditTask}
                fullWidth
                maxWidth="lg"
                sx={{
                    '& .MuiDialog-paper': {
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        boxShadow: 3,
                        padding: 4,
                    },
                }}
            >
                <DialogTitle>{t('task_edit')}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleEditTaskSubmit}>
                        <TextField
                            label={t('task_title')}
                            error={!isValidTitleTaskEdit}
                            helperText={!isValidTitleTaskEdit ? t('invalid_name_message') : ''}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={taskTitleEdit}
                            onChange={handleNameChangeTitleTaskEdit}
                            required
                        />
                        <TextField
                            label={t('task_summary')}
                            error={!isValidSumaryTaskEdit}
                            helperText={!isValidSumaryTaskEdit ? t('invalid_name_message') : ''}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            value={taskSummaryEdit}
                            onChange={handleNameChangeSummaryTaskEdit}
                            required
                        />
                        <div style={{ width: '100%', marginTop: '16.5px', marginBottom: '16px' }}>
                            <CustomContainer>
                                <ReactQuill
                                    value={taskDescriptionEdit}
                                    onChange={(content) => setTaskDescriptionEdit(content)}
                                    placeholder={t('task_Desc1')}
                                />
                            </CustomContainer>
                        </div>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', width: '100%', mt: 2 }}>
                            <Button variant="contained" onClick={handleCancelEditTask} color="primary">
                                {t('cancel')}
                            </Button>
                            <Button variant="contained" color="primary" type="submit" disabled={!isValidFormTaskEdit || isLoadingTask}>
                                {t('save')}
                            </Button>
                        </Box>
                    </form>
                </DialogContent>
            </Dialog>

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
                    <form onSubmit={handleCreateTask}>
                        <TextField
                            label={t('task_title')}
                            error={!isValidTitleTask}
                            helperText={!isValidTitleTask ? t('invalid_name_message') : ''}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={taskTitle}
                            onChange={handleNameChangeTitleTask}
                            required
                        />
                        <TextField
                            label={t('task_summary')}
                            error={!isValidSumaryTask}
                            helperText={!isValidSumaryTask ? t('invalid_name_message') : ''}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            value={taskSummary}
                            onChange={handleNameChangeSumaryTask}
                            required
                        />
                        <div style={{ width: '100%', marginTop: '16.5px', marginBottom: '16px' }}>
                            <CustomContainer>
                                <ReactQuill
                                    value={taskDescription}
                                    onChange={(content) => setTaskDescription(content)}
                                    placeholder={t('task_Desc1')}
                                />
                            </CustomContainer>
                        </div>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', width: '100%', mt: 2 }}>
                            <Button variant="contained" onClick={handleCancelTask} color="primary">
                                {'Cancelar'}
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                onClick={handleCreateTask}
                                disabled={!isValidFormTask || isLoadingTask}
                            >
                                {'Criar'}
                            </Button>
                        </Box>
                    </form>
                </DialogContent>
            </Dialog>
        </Box>
    );
};
export default CreateExperimentStep1;
