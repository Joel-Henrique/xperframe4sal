import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
  Divider,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MailIcon from '@mui/icons-material/Mail';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { useTranslation } from 'react-i18next'; 

const Contact = () => {
  const { t } = useTranslation(); 
  const [expanded, setExpanded] = useState(`panel-0`);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Accordion
        sx={{ marginBottom: '5px' }}
        elevation={3}
        expanded={expanded === `panel-0`}
        onChange={handleChange(`panel-0`)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-0bh-content`}
          id={`panel-0bh-header`}
          sx={{
            '&:hover': {
              backgroundColor: 'lightgray',
            },
          }}
        >
          <Typography component="div">
            {t('researchers')}
          </Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <Box sx={{ display: 'flex' }}>
            <MailIcon />
            <Typography noWrap sx={{ marginLeft: 1 }}>{t('marcelo')}</Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <MailIcon />
            <Typography noWrap sx={{ marginLeft: 1 }}>{t('sean')}</Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <MailIcon />
            <Typography noWrap sx={{ marginLeft: 1 }}>{t('jairo')}</Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion
        sx={{ marginBottom: '5px' }}
        elevation={3}
        expanded={expanded === `panel-1`}
        onChange={handleChange(`panel-1`)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel-1bh-content`}
          id={`panel-1bh-header`}
          sx={{
            '&:hover': {
              backgroundColor: 'lightgray',
            },
          }}
        >
          <Typography component="div">
            {t('ethicsCommittee')}
          </Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <Box sx={{ display: 'flex' }}>
            <MailIcon />
            <Typography noWrap sx={{ marginLeft: 1 }}>{t('cepEmail')}</Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <LocalPhoneIcon />
            <Typography noWrap sx={{ marginLeft: 1 }}>{t('cepPhone')}</Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export { Contact };
