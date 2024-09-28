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


const Contact = () => {

  const [expanded, setExpanded] = useState(`panel-0`);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  }

  return (
    <>
      <Accordion
        sx={{ marginBottom: '5px' }}
        elevation={3}
        expanded={(expanded === `panel-0`)}
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
            Pesquisadores:
          </Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <Box sx={{ display: 'flex' }}>
            <MailIcon />
            <Typography noWrap sx={{ marginLeft: 1 }}>Marcelo Machado - marcelo.machado@edu.unirio.br</Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <MailIcon />
            <Typography noWrap sx={{ marginLeft: 1 }}>Sean Wolfgand Matsui Siqueira - sean@uniriotec.br</Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <MailIcon />
            <Typography noWrap sx={{ marginLeft: 1 }}>Jairo Francisco de Souza - jairo.souza@ice.ufjf.br</Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion
        sx={{ marginBottom: '5px' }}
        elevation={3}
        expanded={(expanded === `panel-1`)}
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
            Comitê de Ética em Pesquisa, CEP-UNIRIO:
          </Typography>
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <Box sx={{ display: 'flex' }}>
            <MailIcon />
            <Typography noWrap sx={{ marginLeft: 1 }}>cep@unirio.br</Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <LocalPhoneIcon />
            <Typography noWrap sx={{ marginLeft: 1 }}> +55 21 2542-7796 </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

    </>
  );
};

export { Contact };