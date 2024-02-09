import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { api } from "../config/axios.js";

import {
  Container,
  Paper,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Box,
} from '@mui/material';

import { Visibility, VisibilityOff } from '@mui/icons-material';

import { ErrorMessage } from '../components/ErrorMessage.js';
import { LoadingIndicator } from '../components/LoadIndicator.js';


const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [email, setEmail] = useState(searchParams.get('email') || null);
  const [token, setToken] = useState(searchParams.get('token') || null);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [differentPasswords, setDifferentPasswords] = useState(false);
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (e) => {
    const inputPassword = e.target.value;
    setPassword(inputPassword);
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\]*@#$%^<>'";|}{:,./?~()`&\-_+=![]).{6,}$/;
    setIsValidPassword(passwordRegex.test(inputPassword));
  };

  const handleRepeatPasswordChange = (e) => {
    const inputPassword = e.target.value;
    setRepeatPassword(inputPassword);
    setDifferentPasswords(password !== inputPassword);
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEdit = async () => {
    if (!isValidPassword) {
      setAlertMessage(`Por favor, assegure-se de que sua senha seja composta por, no mínimo, 6 caracteres e inclua:
       - letras maiúsculas
       - letras minúsculas
       - números e 
       - caracteres especiais.`)
      setMessageType('fail');
      return;
    }

    if (differentPasswords) {
      setAlertMessage(`Senhas diferentes. Por favor, assegure-se de que os campos a seguir tenham a mesma senha.`)
      setMessageType('fail');
    }

    let userData = { email, token, password };

    setIsLoading(true);
    try {
      await api.post(`/users/reset-password`, userData);
      setIsLoading(false);
      setAlertMessage("Sua senha foi alterada com sucesso!.")
      setMessageType('success');
    } catch (error) {
      setIsLoading(false);
      setAlertMessage(`Não foi possível alterar o cadastro ${error.response.data.message}`);
      setMessageType('fail');
    }
  };


  return (
    <>
      <Container maxWidth="xs" style={{
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        height: '80vh',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          {isLoading && <LoadingIndicator size={50} />}
          {alertMessage && <ErrorMessage message={alertMessage} messageType={messageType} onClose={() => setAlertMessage(null)} />} {/* Pass onClose callback */}
          <Box component="form" disabled={isLoading}>
            <TextField
              label="Senha"
              error={!isValidPassword}
              helperText={!isValidPassword ? 'Por favor, assegure-se de que sua senha seja composta por, no mínimo, 6 caracteres e inclua letras maiúsculas, letras minúsculas, números e caracteres especiais.' : ''}
              fullWidth
              margin="normal"
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Repita a senha"
              error={differentPasswords}
              helperText={differentPasswords ? 'Insira a mesma senha digitada no campo anterior.' : ''}
              fullWidth
              margin="normal"
              type='password'
              value={repeatPassword}
              onChange={handleRepeatPasswordChange}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleEdit}
              style={{ margin: '16px 0' }}
              disabled={isLoading || !isValidPassword || differentPasswords || (password.length === 0 && repeatPassword.length === 0)}
            >
              Alterar Senha
            </Button>
            <Button onClick={() => navigate('/')} style={{
              cursor: 'pointer',
              fontWeight: 700,
              backgroundColor: 'transparent',
              textAlign: 'right',
              padding: '2px 3px',

            }}
              sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
            >
              Entre com sua conta aqui
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export { ResetPassword };