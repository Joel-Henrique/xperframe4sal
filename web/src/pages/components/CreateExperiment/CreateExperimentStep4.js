import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import StepContext from "./context/StepContextCreate";
import { api } from "../../../config/axios";
const CreateExperimentStep4 = () => {
    const { t } = useTranslation();
    const {
        step,
        setStep,
        ExperimentUsers,
        ExperimentTitle,
        ExperimentType,
        BtypeExperiment,
        ExperimentDesc,
        ExperimentTasks,
        ExperimentSurveys,
    } = useContext(StepContext);
    const [users, setUsers] = useState([]);
    const [user] = useState(JSON.parse(localStorage.getItem("user")));

    const handleCreate = () => {
        setStep(step + 1);
    };

    useEffect(() => {
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

        fetchUsers();
    }, [t, user.accessToken]);

    const handleBack = () => {
        setStep(step - 1);
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
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                    {t("revis_conc")}
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                        <strong>{t("Experiment_title")}:</strong>{" "}
                        {ExperimentTitle}
                    </Grid>
                    <Grid item xs={12}>
                        <strong>{t("typeExperiment1")}:</strong>{" "}
                        {t(ExperimentType)}
                    </Grid>

                    {ExperimentType === "between-subject" && (
                        <Grid item xs={12}>
                            <strong>{t("Group_Separation_Method")}:</strong>{" "}
                            {t(BtypeExperiment)}
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <strong>{t("Experiment_Desc")}:</strong>{" "}
                        {ExperimentDesc.replace(/<[^>]+>/g, "")}
                    </Grid>

                    <Grid item xs={12}>
                        <strong>{t("selected_task")}:</strong>{" "}
                        {ExperimentTasks.length > 0
                            ? ExperimentTasks.map((task) => task.title).join(
                                  ", "
                              )
                            : t("non_selected_task")}
                    </Grid>

                    <Grid item xs={12}>
                        <strong>{t("selected_surveys")}:</strong>{" "}
                        {ExperimentSurveys.length > 0
                            ? ExperimentSurveys.map(
                                  (survey) => survey.title
                              ).join(", ")
                            : t("non_selected_survey")}
                    </Grid>

                    <Grid item xs={12}>
                        <strong>{t("selected_user")}:</strong>{" "}
                        {ExperimentUsers.map((id) => {
                            const user = users.find((s) => s.id === id);
                            return user
                                ? ` ${user.name} ${user.lastName} - ${user.email} `
                                : "";
                        }).join(", ") || t("non_selected_user")}
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 4,
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
                        onClick={handleCreate}
                        sx={{ maxWidth: 200, fontWeight: "bold", boxShadow: 2 }}
                    >
                        {t("create")}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default CreateExperimentStep4;
