import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

const NotFoundPage = () => {
  return (
    <Container maxWidth="sm">
      <Box mt={8} textAlign="center">
        <ErrorOutline color="error" style={{ fontSize: 100 }} />
        <Typography variant="h4" gutterBottom>
          404 - Página não encontrada
        </Typography>
        <Typography variant="body1">
          Oops, a página que você está procurando não existe.
        </Typography>
        <Link to="/">
          <Button variant="contained" color="primary">
            Volte para página inicial
          </Button>
        </Link>
      </Box>
    </Container>
  );
};

export { NotFoundPage };