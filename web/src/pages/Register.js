import React, { useState } from 'react';
import { api } from "../config/axios.js";
import { useNavigate } from 'react-router-dom';

import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Box,
} from '@mui/material';

import { Visibility, VisibilityOff } from '@mui/icons-material';

import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingIndicator } from '../components/LoadIndicator';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidName, setIsValidName] = useState(true);
  const [isValidLastName, setIsValidLastName] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    setIsValidEmail(emailRegex.test(inputEmail));
  };

  const handlePasswordChange = (e) => {
    const inputPassword = e.target.value;
    setPassword(inputPassword);
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\]*@#$%^<>'";|}{:,./?~()`&\-_+=![]).{6,}$/;
    setIsValidPassword(passwordRegex.test(inputPassword));
  }

  const handleNameChange = (e) => {
    const inputName = e.target.value;
    setName(inputName);
    setIsValidName(inputName ? true : false)
  };

  const handleLastNameChange = (e) => {
    const inputName = e.target.value;
    setLastName(inputName);
    setIsValidLastName(inputName ? true : false)
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async () => {
    if (!isValidEmail) {
      setAlertMessage("E-mail inválido. Verifique e tente novamente.")
      setMessageType('fail');
      return;
    }
    if (!isValidName) {
      setAlertMessage("Preecha seu nome.")
      setMessageType('fail');
      return;
    }
    if (!isValidLastName) {
      setAlertMessage("Preecha seu sobrenome.")
      setMessageType('fail');
      return;
    }
    if (!isValidPassword) {
      setAlertMessage(`Por favor, assegure-se de que sua senha seja composta por, no mínimo, 6 caracteres e inclua:
       - letras maiúsculas
       - letras minúsculas
       - números e 
       - caracteres especiais.`)
      setMessageType('fail');
      return;
    }

    setName(name.trim());
    setLastName(lastName.trim());
    setEmail(email.trim());

    const userData = { name, lastName, email, password };
    setIsLoading(true);
    try {
      let response = await api.post("/users", userData);
      if (response.data) {
        setAlertMessage("Seu cadastro foi realizado com sucesso! Por favor, retorne à página inicial para realizar o login.")
        setMessageType('success');
      }
    } catch (e) {
      setAlertMessage('Não foi possível efetuar o cadastro. Por favor, verifique todos os campos e tente novamente. Caso o erro persista entre em contato com o administrador deste serviço em "marcelo.oc.machado@gmail.com"');
      setMessageType('fail');
    } finally {
      setIsLoading(false);
    }

  };

  const isValidForm = isValidEmail && email && isValidPassword && password && isValidName && name && isValidLastName && lastName;

  return (
    <Container maxWidth="xs" style={{
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      height: '100vh',
      justifyContent: 'center',
      position: 'relative',
    }}>
      <Paper elevation={3} style={{ padding: '16px' }}>
        <Box component='form' disabled={isLoading}>
          <Typography variant="h4" align="center"
            style={{
              fontFamily: '"Google Sans","Noto Sans Myanmar UI", arial,sans-serif',
              fontWeight: 500,
              color: 'rgb(103,99,99)'
            }}
            sx={{ fontSize: { xs: '2.2rem', sm: '2.4rem' } }}
          >
            Criar conta
          </Typography>
          {isLoading ? (
            <LoadingIndicator size={50} /> // Exibir o indicador de carregamento do Material-UI
          ) : ""}
          {alertMessage && <ErrorMessage message={alertMessage} messageType={messageType} onClose={() => setAlertMessage(null)} />} {/* Pass onClose callback */}

          <TextField
            label="Nome"
            error={!isValidName}
            helperText={!isValidName ? 'Preencha o campo nome.' : ''}
            fullWidth
            margin="normal"
            variant="outlined"
            value={name}
            onChange={handleNameChange}
          />
          <TextField
            label="Sobrenome"
            error={!isValidLastName}
            helperText={!isValidLastName ? 'Preencha o campo sobrenome.' : ''}
            fullWidth
            margin="normal"
            variant="outlined"
            value={lastName}
            onChange={handleLastNameChange}
          />
          <TextField
            label="E-mail"
            type="email"
            error={!isValidEmail}
            helperText={!isValidEmail ? 'E-mail inválido.' : ''}
            fullWidth
            autoComplete="email"
            margin="normal"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
          />
          <TextField
            label="Senha"
            error={!isValidPassword}
            helperText={!isValidPassword ? 'Por favor, assegure-se de que sua senha seja composta por, no mínimo, 6 caracteres e inclua letras maiúsculas, letras minúsculas, números e caracteres especiais.' : ''}
            fullWidth
            autoComplete="current-password"
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                    title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleRegister}
            style={{ margin: '16px 0' }}
            disabled={!isValidForm || isLoading}
          >
            Cadastrar
          </Button>
          <Typography variant="body2" align="center" fontSize={15}>
            Já possui uma conta?{' '}
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

          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export { Register };