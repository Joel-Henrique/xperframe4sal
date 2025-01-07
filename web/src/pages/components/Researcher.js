import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../config/axios";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Typography,
    Divider,
    Skeleton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";

const ExperimentAccordion = ({
    experiment,
    expanded,
    onChange,
    onAccess,
    onEdit,
    isOwner,
    t,
}) => (
    <Accordion
        sx={{ marginBottom: "5px" }}
        elevation={3}
        expanded={expanded}
        onChange={onChange}
    >
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${experiment._id}-content`}
            id={`${experiment._id}-header`}
            sx={{
                "&:hover": {
                    backgroundColor: "lightgray",
                },
            }}
        >
            <Typography>{experiment.name}</Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
            <Typography
                dangerouslySetInnerHTML={{ __html: experiment.summary }}
            />
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "16px",
                }}
            >
                {isOwner && (
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ margin: "2px" }}
                        onClick={() => onEdit(experiment._id)}
                    >
                        {t("edit")}
                    </Button>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    style={{ margin: "2px" }}
                    onClick={() => onAccess(experiment._id)}
                >
                    {t("Access")}
                </Button>
            </div>
        </AccordionDetails>
    </Accordion>
);

const LoadingState = () => (
    <div>
        {[...Array(3)].map((_, index) => (
            <Skeleton
                key={index}
                variant="rectangular"
                height={80}
                style={{ marginBottom: "8px" }}
            />
        ))}
    </div>
);

const Researcher = () => {
    const navigate = useNavigate();
    const [experiments, setExperiments] = useState(null);
    const [experimentsOwner, setOwnerExperiments] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const { t } = useTranslation();

    useEffect(() => {
        const fetchAllExperiments = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const { data: allExperiments } = await api.get("experiments2", {
                    headers: { Authorization: `Bearer ${user.accessToken}` },
                });

                const participatedExperiments = [];
                const ownedExperiments = [];

                allExperiments.forEach((experiment) => {
                    if (experiment.ownerId === user.id) {
                        ownedExperiments.push(experiment);
                    } else if (experiment.userProps?.includes(user.id)) {
                        participatedExperiments.push(experiment);
                    }
                });

                setExperiments(participatedExperiments);
                setOwnerExperiments(ownedExperiments);

                if (ownedExperiments.length > 0) {
                    setExpanded(`panel-owner-0`);
                } else if (participatedExperiments.length > 0) {
                    setExpanded(`panel-0`);
                }
            } catch (err) {
                setError(t("error_loading_experiments"));
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllExperiments();
    }, [user.id, user.accessToken, t]);

    const handleCreateExperiment = () => navigate("/CreateExperiment");

    const handleAccessExperiment = (experimentId) => {
        navigate(`/experiments/${experimentId}/surveys`);
    };

    const handleEditExperiment = (experimentId) => {
        navigate(`/EditExperiment/${experimentId}`);
    };

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "16px",
                    marginBottom: "16px",
                }}
            >
                <Typography variant="h6" gutterBottom>
                    {t("researcher_experiments_title")}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateExperiment}
                >
                    {t("create_experiment_button")}
                </Button>
            </div>

            {isLoading && <LoadingState />}
            {error && (
                <Typography
                    variant="body1"
                    color="error"
                    style={{ marginTop: "16px" }}
                >
                    {error}
                </Typography>
            )}

            {experimentsOwner?.length > 0
                ? experimentsOwner.map((experiment, index) => (
                      <ExperimentAccordion
                          key={experiment._id}
                          experiment={experiment}
                          expanded={expanded === `panel-owner-${index}`}
                          onChange={handleChange(`panel-owner-${index}`)}
                          onAccess={handleAccessExperiment}
                          onEdit={handleEditExperiment}
                          isOwner={true}
                          t={t}
                      />
                  ))
                : !isLoading && <Typography>{t("no_experiments")}</Typography>}

            <Typography variant="h6" gutterBottom style={{ marginTop: "16px" }}>
                {t("see_experiment_list_title")}
            </Typography>

            {experiments?.length > 0
                ? experiments.map((experiment, index) => (
                      <ExperimentAccordion
                          key={experiment._id}
                          experiment={experiment}
                          expanded={expanded === `panel-${index}`}
                          onChange={handleChange(`panel-${index}`)}
                          onAccess={handleAccessExperiment}
                          onEdit={handleEditExperiment}
                          isOwner={false}
                          t={t}
                      />
                  ))
                : !isLoading && <Typography>{t("no_experiments")}</Typography>}
        </>
    );
};

export default Researcher;
