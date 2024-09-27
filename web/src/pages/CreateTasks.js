import React from 'react';
import {
    Box,
    Typography,
} from '@mui/material';


const CreateTasks = () => {

    return (
        <>
            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.0rem', sm: '1.2rem', marginBottom: 30 } }}>
                Criação de tarefas
            </Typography>

        </>
    );
};

export { CreateTasks };