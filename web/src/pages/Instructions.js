import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';


const Instructions = () => {

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.0rem', sm: '1.2rem', marginBottom: 30 } }}>
        Assista a seguir um vídeo com instruções de utilização deste sistema:
      </Typography>
      <Box component='div' sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: { sm: 654, xs: 360 }, height: { sm: 375, xs: 205 } }} component='iframe' src="https://www.youtube.com/embed/Q4C4ees0VLQ?rel=0&si=6_lCAUI5nbnHa_yJ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;" allowFullScreen />
      </Box>
    </>
  );
};

export { Instructions };