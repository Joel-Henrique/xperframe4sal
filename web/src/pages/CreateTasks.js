import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../config/axios';
import { Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress, Snackbar } from '@mui/material';




const CreateTasks = () => {
        const [taskName, setTaskName] = useState('');
        const [taskDescription, setTaskDescription] = useState('');
        const [taskType, setTaskType] = useState('');
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [openSnackbar, setOpenSnackbar] = useState(false);
        const [snackbarMessage, setSnackbarMessage] = useState('');
        const navigate = useNavigate();

        const handleSubmit = async (e) => {
            e.preventDefault();
            setIsSubmitting(true);

            try {
                const response = await api.post('/tasks', {
                    name: taskName,
                    description: taskDescription,
                    type: taskType,
                });

                setSnackbarMessage('Tarefa criada com sucesso!');
                setOpenSnackbar(true);
                setTimeout(() => {
                    navigate('/tasks');
                }, 1500);
            } catch (error) {
                console.error('Erro ao criar tarefa:', error);
                setSnackbarMessage('Erro ao criar tarefa. Tente novamente.');
                setOpenSnackbar(true);
            } finally {
                setIsSubmitting(false);
            }
        };

        return (
            <Box sx={{ width: '60%', margin: '0 auto', marginTop: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Criar Nova Tarefa
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Nome da Tarefa"
                        variant="outlined"
                        margin="normal"
                        required
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Descrição da Tarefa"
                        variant="outlined"
                        margin="normal"
                        multiline
                        minRows={3}
                        required
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                    />
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>Tipo da Tarefa</InputLabel>
                        <Select
                            value={taskType}
                            label="Tipo da Tarefa"
                            onChange={(e) => setTaskType(e.target.value)}
                        >
                            <MenuItem value={'search'}>Busca</MenuItem>
                            <MenuItem value={'questionnaire'}>Questionário</MenuItem>
                            <MenuItem value={'assignment'}>Trabalho</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            sx={{ width: 150 }}
                        >
                            {isSubmitting ? <CircularProgress size={24} /> : 'Criar Tarefa'}
                        </Button>
                    </Box>
                </form>
                <Snackbar
                    open={openSnackbar}
                    message={snackbarMessage}
                    autoHideDuration={2000}
                    onClose={() => setOpenSnackbar(false)}
                />
            </Box>
        );
    };
export { CreateTasks };