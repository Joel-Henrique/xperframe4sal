import { Accordion, AccordionDetails, AccordionSummary, Button, Divider, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ExperimentAccordion = ({ experiment, expanded, onChange, onAccess, onEdit, onDelete, onEdituser, isOwner, t }) => (
  <Accordion
    sx={{ marginBottom: '5px' }}
    elevation={3}
    expanded={expanded}
    onChange={onChange}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls={`${experiment._id}-content`}
      id={`${experiment._id}-header`}
      sx={{
        wordBreak: 'break-word',
        '&:hover': {
          backgroundColor: 'lightgray',
        },
      }}
    >
      <Typography>{experiment.name}</Typography>
    </AccordionSummary>
    <Divider />
    <AccordionDetails>
      <Typography
        style={{ wordBreak: 'break-word' }}
        dangerouslySetInnerHTML={{ __html: experiment.summary }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
        <Button
          variant="contained"
          color="primary"
          style={{ margin: '2px' }}
          onClick={() => onAccess(experiment._id)}
        >
          {t('Access')}
        </Button>

        {isOwner && (
          <>
            <Button
              variant="contained"
              color="primary"
              style={{ margin: '2px' }}
              onClick={() => onEdituser(experiment._id)}
            >
              {t('edit_user')}
            </Button>

            <Button
              variant="contained"
              color="primary"
              style={{ margin: '2px' }}
              onClick={() => onEdit(experiment._id)}
            >
              {t('edit')}
            </Button>

            <Button
            variant="contained"
            color="primary"
            style={{ margin: '2px', background: '#D32F2F' }}
            onClick={() => onDelete(experiment._id)}
          >
            {t('delete')}
          </Button>
          </>
        )}
      </div>
    </AccordionDetails>
  </Accordion>
);

export {ExperimentAccordion}