import React, { useState, useEffect, useContext } from 'react';
import StepContext from './context/StepContext';
import { api } from '../../../config/axios';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
const EditUserComponent = () => {
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
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [usersInExperiment, setUsersInExperiment] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            console.error('Usuário não autenticado.');
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [user, ExperimentId]);

    const fetchData = async () => {
        try {
            const response = await api.get(`experiments/${ExperimentId}/`, {
                headers: { Authorization: `Bearer ${user.accessToken}` },
            });
            const usersInExperimentIds = response.data.userProps;

            const allUsersResponse = await api.get(`users`, {
                headers: { Authorization: `Bearer ${user.accessToken}` },
            });
            const allUsersData = allUsersResponse.data;
            const usersInExperimentData = allUsersData.filter((usr) =>
                usersInExperimentIds.includes(usr.id)
            );

            const usersNotInExperiment = allUsersData.filter(
                (usr) => !usersInExperimentIds.includes(usr.id)
            );

            setAllUsers(usersNotInExperiment);
            setUsersInExperiment(usersInExperimentData);
        } catch (error) {
            console.error('Erro ao buscar dados dos usuários:', error);
        }
    };

    const addUserToExperiment = (userId) => {
        const userToAdd = allUsers.find((user) => user.id === userId);
        if (userToAdd) {
            setUsersInExperiment((prev) => [...prev, userToAdd]);
            setAllUsers((prev) => prev.filter((user) => user.id !== userId));
        }
    };

    const removeUserFromExperiment = (userId) => {
        const userToRemove = usersInExperiment.find((user) => user.id === userId);
        if (userToRemove) {
            setAllUsers((prev) => [...prev, userToRemove]);
            setUsersInExperiment((prev) => prev.filter((user) => user.id !== userId));
        }
    };

    const saveChanges = async () => {
        try {
            await api.patch(
                `experiments/${ExperimentId}`,
                { userIds: usersInExperiment.map((usr) => usr.id) },
                { headers: { Authorization: `Bearer ${user.accessToken}` } }
            );
            alert('Alterações salvas com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar alterações:', error);
            alert('Erro ao salvar alterações.');
        }
    };

    return (
        <div style={{ marginTop: 50, justifyContent: 'center' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    flexDirection: 'row',
                }}
            >
                <UserList
                    title={t('all_users')}
                    users={allUsers}
                    buttonAction={addUserToExperiment}
                    icon={<AddIcon />}
                    buttonType="add"
                />
                <UserList
                    title={t('users_in_experiment')}
                    users={usersInExperiment}
                    buttonAction={removeUserFromExperiment}
                    icon={<RemoveIcon />}
                    buttonType="delete"
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '30px',
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={saveChanges}
                    sx={{ width: '200px' }}
                >
                    {t('save')}
                </Button>
            </div>
        </div>
    );
};

const UserList = ({ title, users, buttonAction, buttonType }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const buttonStyles = {
        add: {
            backgroundColor: '#007bff',
            color: '#fff',
        },
        delete: {
            backgroundColor: '#ff4d4d',
            color: '#fff',
        },
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div
            style={{
                flex: 1,
                padding: '30px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                height: '350px',
                maxWidth: '450px',
                width: '100%',
                overflowY: 'auto',
                margin: '0 10px',
                backgroundColor: '#f9f9f9',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <h3 style={{ textAlign: 'center' }}>{title}</h3>
            <input
                type="text"
                placeholder={t('search_by_name_or_email')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    width: '100%',
                    padding: '15px',
                    marginBottom: '15px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontSize: '14px',
                }}
            />
            {filteredUsers.length ? (
                filteredUsers.map((user) => (
                    <div
                        key={user.id}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            padding: '10px 15px',
                            margin: '5px 0',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <strong>{user.name}</strong>
                            <br />
                            <small>{user.email}</small>
                        </div>
                        <IconButton
                            onClick={() => buttonAction(user.id)}
                            style={buttonStyles[buttonType]}
                        >
                            {buttonType === 'add' ? <AddIcon /> : <RemoveIcon />}
                        </IconButton>
                    </div>
                ))
            ) : (
                <p style={{ textAlign: 'center' }}>{t('no_users_found')}</p>
            )}
        </div>
    );
};

export default EditUserComponent;
