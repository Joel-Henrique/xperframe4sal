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
    const [groups, setGroups] = useState([]);
    const [usersInExperiment, setUsersInExperiment] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const modalUserId = useRef(null);

    useEffect(() => {
        fetchUserData();
        fetchGroupsData();
    }, [user, ExperimentId]);

    const fetchUserData = async () => {
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

    const fetchGroupsData = async () => { 
        try {
            const response = await api.get(`task2/experiment/${ExperimentId.experimentId}/`, {
                headers: { Authorization: `Bearer ${user.accessToken}` },
            });

            const tasks = response.data;
            const generatedGroups = [];

            for (const task of tasks) {
                const response = await api.get(`user-task2/task/${task._id}/users`, {
                    headers: { Authorization: `Bearer ${user.accessToken}` },
                });

                const users = response.data;

                generatedGroups.push({
                    id: task._id,
                    groupName: task.title,
                    users: [...users],
                })
            }

            setGroups([...generatedGroups])
        }catch (error){
            console.error('Erro ao buscar dados das Tarefas: ', error)
        }
    }

   const saveChanges = () => {

   }

   const openModal = (userId) => {
        modalUserId.current = userId;
        setIsVisible(true);
   }

   const closeModal = () =>{
        setIsVisible(false);
   }

   const addUserToGroup = async (userId, groupId) =>{
        try {
            await api.post(
                '/user-task2',
                {
                    userId: userId,
                    taskId: groupId
                },
                {headers: { Authorization: `Bearer ${user.accessToken}` }}
            )
        } catch (error) {
            console.error('Erro ao alocar usuário na tarefa: ', error)
        }
        closeModal()
   }

   const removeUserFromGroup = async (userId) => {
        try {
            const group = groups.find(group =>
                group.users.some(user => user._id === userId)
            );

            await api.delete(
                `/user-task2?userId=${userId}&taskId=${group.id}`,
                {headers: { Authorization: `Bearer ${user.accessToken}` }}
            )
        } catch (error) {
            console.error('Erro ao remover usuário na tarefa: ', error)
        }
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
                            buttonType="change"
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
                userId={modalUserId.current} 
                isVisible={isVisible}
                groups={groups}
                addUserToGroup={addUserToGroup}
                closeModal={closeModal}
            />
        </>
    )
}

export default EditGroupArea;