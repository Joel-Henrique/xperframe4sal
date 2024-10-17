import { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Typography,
    Box,
    Snackbar,
    Alert,
    CircularProgress,
    styled,
    Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const CustomContainer = styled('div')(({ theme }) => ({
    backgroundColor: '#fafafa',
    borderRadius: '8px',
    padding: '0px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
}));

const UserPanel = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    height: '200px',
    overflowY: 'auto',
    backgroundColor: '#f5f5f5',
}));

export default function AddUsersToExperiment() {
    const { t } = useTranslation();

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const addMockUsers = () => {
        const mockUsers = [
            { id: 1, name: 'Alice Johnson', email: 'alice.johnson@example.com' },
            { id: 2, name: 'Bob Smith', email: 'bob.smith@example.com' },
            { id: 3, name: 'Charlie Brown', email: 'charlie.brown@example.com' },
            { id: 4, name: 'Diana Prince', email: 'diana.prince@example.com' },
            { id: 5, name: 'Ethan Hunt', email: 'ethan.hunt@example.com' },
        ];
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
    };

    useEffect(() => {
        addMockUsers();
    }, []);

    const handleSearchNameChange = (e) => {
        setSearchName(e.target.value);
        filterUsers(e.target.value, searchEmail);
    };

    const handleSearchEmailChange = (e) => {
        setSearchEmail(e.target.value);
        filterUsers(searchName, e.target.value);
    };

    const filterUsers = (name, email) => {
        const filtered = users.filter((user) => {
            const matchesName = user.name.toLowerCase().includes(name.toLowerCase());
            const matchesEmail = user.email.toLowerCase().includes(email.toLowerCase());
            return matchesName && matchesEmail;
        });
        setFilteredUsers(filtered);
    };

    const handleDrop = (event) => {
        const userId = event.dataTransfer.getData('userId');
        const user = users.find((u) => u.id === parseInt(userId, 10));

        if (user && !selectedUsers.some((u) => u.id === user.id)) {
            setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user]);
            // Remover o usuário da lista de disponíveis
            setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
            setFilteredUsers((prevFilteredUsers) => prevFilteredUsers.filter((u) => u.id !== user.id));
        }
    };

    const handleDragStart = (event, user) => {
        event.dataTransfer.setData('userId', user.id);
    };

    const handleRemoveUser = (userId) => {
        const user = selectedUsers.find((u) => u.id === userId);
        setSelectedUsers((prevSelectedUsers) => prevSelectedUsers.filter((user) => user.id !== userId));
        // Re-adicionar o usuário à lista de disponíveis
        setUsers((prevUsers) => [...prevUsers, user]);
        setFilteredUsers((prevFilteredUsers) => [...prevFilteredUsers, user]);
    };

    const handleAddUsersToExperiment = async () => {
        try {
            setIsLoading(true);
            console.log('Usuários selecionados:', selectedUsers);
            setSnackbarSeverity('success');
            setSnackbarMessage('Usuários adicionados ao experimento com sucesso!');
        } catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMessage('Erro ao adicionar usuários. Tente novamente.');
        } finally {
            setIsLoading(false);
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                {t('Adicionar Usuários ao Experimento')}
            </Typography>

            {/* Campos de Filtro */}
            <TextField
                label={t('Filtrar por Nome')}
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchName}
                onChange={handleSearchNameChange}
            />

            <TextField
                label={t('Filtrar por E-mail')}
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchEmail}
                onChange={handleSearchEmailChange}
            />

            {/* Usuários Disponíveis */}
            <Typography variant="h6" gutterBottom>
                {t('Usuários Disponíveis')}
            </Typography>
            <UserPanel>
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <Box
                            key={user.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, user)}
                            sx={{
                                padding: '8px',
                                marginBottom: '8px',
                                backgroundColor: '#fff',
                                cursor: 'pointer',
                            }}
                        >
                            {`${user.name} (${user.email})`}
                        </Box>
                    ))
                ) : (
                    <Typography>{t('Nenhum usuário disponível')}</Typography>
                )}
            </UserPanel>

            {/* Painel de Usuários Selecionados */}
            <Typography variant="h6" gutterBottom>
                {t('Usuários Selecionados')}
            </Typography>
            <UserPanel
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                sx={{ minHeight: '150px', backgroundColor: '#e0e0e0' }}
            >
                {selectedUsers.length > 0 ? (
                    selectedUsers.map((user) => (
                        <Box
                            key={user.id}
                            sx={{
                                padding: '8px',
                                marginBottom: '8px',
                                backgroundColor: '#fff',
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <span>{`${user.name} (${user.email})`}</span>
                            <Button onClick={() => handleRemoveUser(user.id)}>{t('Remover')}</Button>
                        </Box>
                    ))
                ) : (
                    <Typography>{t('Arraste usuários aqui')}</Typography>
                )}
            </UserPanel>

            {/* Botão de Adicionar Usuários */}
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddUsersToExperiment}
                disabled={isLoading || selectedUsers.length === 0}
                fullWidth
                sx={{ marginTop: 2 }}
            >
                {isLoading ? <CircularProgress size={24} /> : t('Adicionar Usuários')}
            </Button>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
