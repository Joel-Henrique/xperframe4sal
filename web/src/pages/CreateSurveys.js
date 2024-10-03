import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    Checkbox,
    ListItemText,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const CreateSurveys = () => {
    const { t } = useTranslation();

    return (
        <Box sx={{ maxWidth: 500, margin: '0 auto', padding: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                {t('Criação de Questionarios')}
            </Typography>
        </Box>
    );
};

export { CreateSurveys };
