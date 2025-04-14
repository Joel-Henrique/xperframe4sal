import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../../config/axios';
import { Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Messages } from 'primereact/messages';
import styles from "../../../style/editUser.module.css"
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import UserList from './UserList';
import GroupSelector from './groupSelector';

const EditGroupArea = ({ExperimentId}) => {
    const { t } = useTranslation();
    const msgs = useRef(null);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [usersInExperiment, setUsersInExperiment] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const modalUserId = useRef(null);

    const groups = [
        {id: '1',groupName: "Grupo X", users: []},
        {id: '2',groupName: "Grupo X", users: []},
        {id: '3',groupName: "Grupo X", users: []},
        {id: '4',groupName: "Grupo X", users: []},
        {id: '5',groupName: "Grupo X", users: []},
        {id: '6',groupName: "Grupo X", users: []},
        {id: '7',groupName: "Grupo X", users: []},
    ]

    useEffect(() => {
        fetchData();
    }, [user, ExperimentId]);

    const fetchData = async () => {
        try {
            const response = await api.get(`user-experiments2/experiment/${ExperimentId.experimentId}/`, {
                headers: { Authorization: `Bearer ${user.accessToken}` },
            });
            const usersInExperimentData = response.data;

            setUsersInExperiment(usersInExperimentData);
        } catch (error) {
            console.error('Erro ao buscar dados dos usuários:', error);
        }
    };

   const saveChanges = () => {

   }

   const openModal = (userId) => {
        modalUserId.current = userId;
        setIsVisible(true);
   }

   const closeModal = () =>{
        setIsVisible(false);
   }

   const addUserToGroup = (userId, groupId) =>{
        closeModal();
   }

   const removeUserFromGroup = (userId) => {

   }

    return(
        <>
            <div style={{ justifyContent: 'center', justifyContent: 'center', display: 'flex', flexDirection: "row", width: "100%", marginTop: '20px', }}>
                <div className={styles.container}>
                    <div className={styles.userListContainer}>
                        <UserList
                            title={t('users_in_experiment')}
                            users={usersInExperiment}
                            buttonAction={openModal}
                            buttonType="add"
                        />
                        {groups.map(group => (
                            <UserList
                                key={group.id}
                                title={group.groupName}
                                users={group.users}
                                buttonAction={removeUserFromGroup}
                                buttonType="delete"
                            />
                        ))}
                    </div>
                    <div className={styles.buttonContainer}>
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
            </div>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 1000,
                }}
            >
                <Messages ref={msgs} />
            </Box>

            <GroupSelector 
                userId={modalUserId} 
                isVisible={isVisible}
                groups={groups}
                addUserToGroup={addUserToGroup}
                closeModal={closeModal}
            />
        </>
    )
}

export default EditGroupArea;