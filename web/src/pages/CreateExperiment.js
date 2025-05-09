import React, { useState, useEffect, useRef } from "react";
import { api } from "../config/axios";
import { Typography, Stepper, Step, StepLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";

import CreateExperimentForm from "./components/CreateExperiment/CreateExperimentForm";
import CreateExperimentTask from "./components/CreateExperiment/CreateExperimentTask";
import CreateExperimentSurvey from "./components/CreateExperiment/CreateExperimentSurvey";
import StepContext from "./components/CreateExperiment/context/StepContextCreate";
import ConfirmCreateExperiment from "./components/CreateExperiment/ConfirmCreateExperiment";
import CreateExperimentICF from "./components/CreateExperiment/CreateExperimentICF";

const CreateExperiment = () => {
    const { t } = useTranslation();
    const [user] = useState(JSON.parse(localStorage.getItem("user")));
    const [ExperimentTitle, setExperimentTitle] = useState("");
    const [ExperimentTitleICF, setExperimentTitleICF] = useState("");
    const [ExperimentDescICF, setExperimentDescICF] = useState("");
    const [ExperimentType, setExperimentType] = useState("within-subject");
    const [BtypeExperiment, setBtypeExperiment] = useState("random");
    const [ExperimentDesc, setExperimentDesc] = useState("");
    const [ExperimentTasks, setExperimentTasks] = useState([]);
    const [ExperimentSurveys, setExperimentSurveys] = useState([]);

    const [step, setStep] = useState(0);
    const toast = useRef(null);

    const handleCreateExperiment = async () => {
        try {
            if (toast.current) {
                toast.current.clear();
                toast.current.show({
                    severity: "info",
                    summary: t("Creating experiment..."),
                    detail: (
                        <div style={{ width: "100%", paddingTop: "10px" }}>
                            <ProgressBar
                                mode="indeterminate"
                                style={{ height: "6px" }}
                            />
                        </div>
                    ),
                    life: 5000,
                    closable: false,
                });
            }

            const experimentIcf = {
                title: ExperimentTitleICF,
                description: ExperimentDescICF,
            };
            await api.post(
                `/experiments2`,
                {
                    ownerId: user.id,
                    name: ExperimentTitle,
                    summary: ExperimentDesc,
                    typeExperiment: ExperimentType,
                    betweenExperimentType: BtypeExperiment,
                    surveysProps: ExperimentSurveys,
                    tasksProps: ExperimentTasks,
                    icf: experimentIcf,
                },
                { headers: { Authorization: `Bearer ${user.accessToken}` } }
            );

            if (toast.current) {
                toast.current.clear();
                toast.current.show({
                    severity: "success",
                    summary: t("Success"),
                    detail: t("Experiment created successfully!"),
                    life: 3000,
                });
            }

            setTimeout(() => {
                setExperimentTitle("");
                setExperimentDesc("");
                setExperimentTasks([]);
                setExperimentSurveys([]);
                setStep(0);
            }, 1500);
        } catch (error) {
            if (toast.current) {
                toast.current.clear();
                toast.current.show({
                    severity: "error",
                    summary: t("Error"),
                    detail: t("Failed to create experiment."),
                    life: 3000,
                });
            }
            console.error(t("Error creating experiment"), error);
        }
    };

    useEffect(() => {
        if (step === 5) {
            handleCreateExperiment();
        }
    }, [step]);

    return (
        <>
            <Toast ref={toast} position="bottom-right" />

            <Typography variant="h4" component="h1" gutterBottom align="center">
                {t("Experiment_create")}
            </Typography>

            <Stepper activeStep={step} alternativeLabel>
                {[
                    t("step_1"),
                    t("ICF"),
                    t("step_3"),
                    t("step_2"),
                    t("step_5"),
                ].map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <StepContext.Provider
                value={{
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
                    ExperimentTasks,
                    setExperimentTasks,
                    ExperimentSurveys,
                    setExperimentSurveys,
                    ExperimentTitleICF,
                    setExperimentTitleICF,
                    ExperimentDescICF,
                    setExperimentDescICF,
                }}
            >
                {step === 0 && <CreateExperimentForm />}
                {step === 1 && <CreateExperimentICF />}
                {step === 2 && <CreateExperimentSurvey />}
                {step === 3 && <CreateExperimentTask />}
                {step === 4 && <ConfirmCreateExperiment />}
            </StepContext.Provider>
        </>
    );
};

export { CreateExperiment };
