import React from "react";
import { useState, useContext, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import StepContext from "./context/StepContextCreate";
import { api } from "../../../config/axios";
import {
    TextField,
    Button,
    Box,
    ListItemText,
    FormControl,
    CircularProgress,
    Checkbox,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const CreateExperimentStep3 = () => {
    const { step, setStep, ExperimentUsers, setExperimentUsers } =
        useContext(StepContext);
    const [user] = useState(JSON.parse(localStorage.getItem("user")));
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoadingUser, setIsLoadingUser] = useState(false);
    const [users, setUsers] = useState([]);

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get(`users2`, {
                headers: { Authorization: `Bearer ${user.accessToken}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error(t("Error in Search"), error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [user, t]);

    const handleSelectUser = (id) => {
        setExperimentUsers((ExperimentUsers) =>
            ExperimentUsers.includes(id)
                ? ExperimentUsers.filter((selectedId) => selectedId !== id)
                : [...ExperimentUsers, id]
        );
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                marginTop: 10,
            }}
        >
            <Box
                sx={{
                    width: "60%",
                    padding: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    boxShadow: 4,
                    mx: "auto",
                }}
            >
                <TextField
                    label={t("search_user")}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 3 }}
                />

                {isLoadingUser ? (
                    <CircularProgress />
                ) : (
                    <FormControl
                        fullWidth
                        sx={{ maxHeight: 200, overflowY: "auto" }}
                    >
                        {users
                            .filter((user) =>
                                `${user.name} ${user.lastName} ${user.email}`
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                            )

                            .map((user) => (
                                <Box
                                    key={user.id}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        mb: 1,
                                        padding: 1,
                                        backgroundColor: "#ffffff",
                                        borderRadius: "4px",
                                        boxShadow: 1,
                                        "&:hover": {
                                            backgroundColor: "#e6f7ff",
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Checkbox
                                                checked={ExperimentUsers.includes(
                                                    user.id
                                                )}
                                                onChange={() =>
                                                    handleSelectUser(user.id)
                                                }
                                            />
                                            <ListItemText
                                                primary={`${user.name} ${user.lastName} - ${user.email}`}
                                                sx={{ ml: 1 }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                    </FormControl>
                )}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                        width: "100%",
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleBack}
                        sx={{ maxWidth: 150, fontWeight: "bold", boxShadow: 2 }}
                    >
                        {t("back")}
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        sx={{ maxWidth: 120 }}
                    >
                        {t("next")}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default CreateExperimentStep3;
