
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button , Container } from '@mui/material';
import { api } from '../config/axios';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Typography,
} from '@mui/material';


const CreateTasks = () => {
        const { t } = useTranslation();
        const navigate = useNavigate();
        const [taskData, setTaskData] = useState({
            title: '',
            description: '',
            startDate: '',
            endDate: '',
        });
        const [isSubmitting, setIsSubmitting] = useState(false);

        const handleChange = (e) => {
            setTaskData({
                ...taskData,
                [e.target.name]: e.target.value,
            });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setIsSubmitting(true);

            try {
                await api.post('/tasks', taskData, {
                    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).accessToken}` },
                });
                navigate('/tasks');
            } catch (error) {
                console.error('Erro ao criar tarefa:', error);
                setIsSubmitting(false);
            }
        };

        const handleCancel = () => {
            navigate('/tasks');
        };

        return (
            <Container maxWidth="sm">
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('create_task_title', { defaultValue: 'Criar Nova Tarefa' })}
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        required
                        name="title"
                        label={t('task_title_label', { defaultValue: 'Título da Tarefa' })}
                        value={taskData.title}
                        onChange={handleChange}
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        required
                        name="description"
                        label={t('task_description_label', { defaultValue: 'Descrição da Tarefa' })}
                        value={taskData.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        required
                        type="date"
                        name="startDate"
                        label={t('task_start_date_label', { defaultValue: 'Data de Início' })}
                        InputLabelProps={{ shrink: true }}
                        value={taskData.startDate}
                        onChange={handleChange}
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        required
                        type="date"
                        name="endDate"
                        label={t('task_end_date_label', { defaultValue: 'Data de Término' })}
                        InputLabelProps={{ shrink: true }}
                        value={taskData.endDate}
                        onChange={handleChange}
                        margin="normal"
                    />

                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button variant="outlined" color="secondary" onClick={handleCancel} style={{ marginRight: '8px' }}>
                            {t('cancel_button_label', { defaultValue: 'Cancelar' })}
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                            {isSubmitting ? t('creating_button_label', { defaultValue: 'Criando...' }) : t('create_button_label', { defaultValue: 'Criar' })}
                        </Button>
                    </Box>
                </form>
            </Container>
        );
    };

    export default CreateTasks;


export { CreateTasks };