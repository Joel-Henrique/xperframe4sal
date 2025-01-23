import React, { useState, useEffect, useRef } from "react";
import { api } from "../../config/axios";
import { Button, IconButton, Typography, Box } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Messages } from "primereact/messages";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const EditUser = (ExperimentId) => {
    const msgs = useRef(null);
    const [user] = useState(JSON.parse(localStorage.getItem("user")));
    const { t } = useTranslation();
    const [usersInExperiment, setUsersInExperiment] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        fetchData();
    }, [user, ExperimentId]);

    const fetchData = async () => {
        try {
            const response = await api.get(
                `user-experiments2/experiment/${ExperimentId.experimentId}/`,
                {
                    headers: { Authorization: `Bearer ${user.accessToken}` },
                }
            );
            const usersInExperimentData = response.data;
            const allUsersResponse = await api.get(`users2`, {
                headers: { Authorization: `Bearer ${user.accessToken}` },
            });
            const allUsersData = allUsersResponse.data;
            //const usersInExperimentData = allUsersData.filter((usr) =>
            //   usersInExperimentIds.includes(usr.id)
            //);

            const usersNotInExperiment = allUsersData.filter(
                (usr) =>
                    !usersInExperimentData.some((user) => user.id === usr.id)
            );
            console.log(usersInExperimentData);
            console.log(usersNotInExperiment);

            setAllUsers(usersNotInExperiment);
            setUsersInExperiment(usersInExperimentData);
        } catch (error) {
            console.error("Erro ao buscar dados dos usuários:", error);
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
        const userToRemove = usersInExperiment.find(
            (user) => user.id === userId
        );
        if (userToRemove) {
            setAllUsers((prev) => [...prev, userToRemove]);
            setUsersInExperiment((prev) =>
                prev.filter((user) => user.id !== userId)
            );
        }
    };

    const saveChanges = async () => {
        try {
            await api.patch(
                `experiments/${ExperimentId.experimentId}`,
                { userIds: usersInExperiment.map((usr) => usr.id) },
                { headers: { Authorization: `Bearer ${user.accessToken}` } }
            );
            if (msgs.current) {
                msgs.current.clear();
                setTimeout(() => {
                    msgs.current.show({
                        severity: "success",
                        summary: t("Success"),
                        life: 3000,
                    });
                }, 100);
            }
        } catch (error) {
            msgs.current.clear();
            if (msgs.current) {
                msgs.current.show({
                    severity: "error",
                    summary: t("error"),
                    life: 3000,
                });
            }
            console.error("Erro ao salvar alterações:", error);
        }
    };

    return (
        <div>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                align="center"
                marginBottom={5}
                marginTop={5}
            >
                {t("edit_user")}
            </Typography>
            <div
                style={{
                    marginTop: 50,
                    justifyContent: "center",
                    justifyContent: "space-between",
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                }}
            >
                <div style={{ width: "20%" }} />
                <div style={{ width: "60%" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "20px",
                            flexDirection: "row",
                        }}
                    >
                        <UserList
                            title={t("all_users")}
                            users={allUsers}
                            buttonAction={addUserToExperiment}
                            icon={<AddIcon />}
                            buttonType="add"
                        />
                        <UserList
                            title={t("users_in_experiment")}
                            users={usersInExperiment}
                            buttonAction={removeUserFromExperiment}
                            icon={<RemoveIcon />}
                            buttonType="delete"
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "30px",
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={saveChanges}
                            sx={{ width: "200px" }}
                        >
                            {t("save")}
                        </Button>
                    </div>
                </div>
                <div style={{ width: "20%" }} />
            </div>
            <Box
                sx={{
                    position: "fixed",
                    bottom: 16,
                    right: 16,
                    zIndex: 1000,
                }}
            >
                <Messages ref={msgs} />
            </Box>
        </div>
    );
};

const UserList = ({ title, users, buttonAction, buttonType }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");
    const buttonStyles = {
        add: {
            backgroundColor: "#007bff",
            color: "#fff",
        },
        delete: {
            backgroundColor: "#ff4d4d",
            color: "#fff",
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
                padding: "30px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                height: "350px",
                maxWidth: "450px",
                width: "100%",
                overflowY: "auto",
                margin: "0 10px",
                backgroundColor: "#f9f9f9",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <h3 style={{ textAlign: "center" }}>{title}</h3>
            <input
                type="text"
                placeholder={t("search_by_name_or_email")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    width: "100%",
                    padding: "15px",
                    marginBottom: "15px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    textAlign: "center",
                    fontSize: "14px",
                }}
            />
            {filteredUsers.length ? (
                filteredUsers.map((user) => (
                    <div
                        key={user.id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            padding: "10px 15px",
                            margin: "5px 0",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            backgroundColor: "#fff",
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
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
                            {buttonType === "add" ? (
                                <AddIcon />
                            ) : (
                                <RemoveIcon />
                            )}
                        </IconButton>
                    </div>
                ))
            ) : (
                <p style={{ textAlign: "center" }}>{t("no_users_found")}</p>
            )}
        </div>
    );
};

export default EditUser;
