import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import '../styles/Instructions.css'; 

const Instructions = () => {
  return (
    <>
      <Typography variant="h6" gutterBottom className="instructions-text">
        Assista a seguir um vídeo com instruções de utilização deste sistema:
      </Typography>
      <Box component='div' className="instructions-box">
        <Box 
          className="instructions-iframe"
          component='iframe'
          src="https://www.youtube.com/embed/Q4C4ees0VLQ?rel=0&si=6_lCAUI5nbnHa_yJ"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
          allowFullScreen
        />
      </Box>
    </>
  );
};

export { Instructions };
