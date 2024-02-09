import React, { useEffect, useState } from 'react';
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
import { ConfirmDialog } from '../components/ConfirmDialog.js';

import { Visibility, VisibilityOff } from '@mui/icons-material';

import { ErrorMessage } from '../components/ErrorMessage.js';
import { LoadingIndicator } from '../components/LoadIndicator.js';
import { CustomSnackbar } from '../components/CustomSnackbar';
import { useNavigate } from 'react-router-dom';


const Account = () => {
  const storedUser = localStorage.getItem('user');
  const navigate = useNavigate();
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  let [name, setName] = useState('');
  let [lastName, setLastName] = useState('');
  let [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('success');
  const [redirect, setRedirect] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidName, setIsValidName] = useState(true);
  const [isValidLastName, setIsValidLastName] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [enableEditButton, setEnableEditButton] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);


  useEffect(() => {
    if (user) {
      setName(user.name);
      setLastName(user.lastName);
      setEmail(user.email);
    }
  }, [user]);

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const isValid = emailRegex.test(inputEmail) && inputEmail.length > 0;
    if (inputEmail !== user.email && isValid) {
      setEnableEditButton(true);
    } else {
      setEnableEditButton(false);
    }
    setIsValidEmail(isValid);
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
    if (inputName !== user.name && inputName.length > 0) {
      setEnableEditButton(true);
    } else {
      setEnableEditButton(false);
    }
    setIsValidName(inputName ? true : false)
  };

  const handleLastNameChange = (e) => {
    const inputName = e.target.value;
    setLastName(inputName);
    if (inputName !== user.lastName) {
      setEnableEditButton(true);
    } else {
      setEnableEditButton(false);
    }
    setIsValidLastName(inputName ? true : false)
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEdit = async () => {
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

    name = name.trim()
    setName(name);
    lastName = lastName.trim()
    setLastName(lastName);
    email = email.trim()
    setEmail(email);

    let userData = { name, lastName, email, password };

    userData = Object.assign(userData, user);

    setIsLoading(true);
    try {
      let response = await api.patch(`/users/${user.id}`, userData, { 'headers': { Authorization: `Bearer ${user.accessToken}` } });
      setIsLoading(false);
      const expirationTime = user.expirationTime;
      setUser({ ...userData, expirationTime });
      localStorage.setItem('user', JSON.stringify({ ...userData, expirationTime }));
      if (response.data) {
        setAlertMessage("Seu cadastro foi atualizado com sucesso!.")
        setMessageType('success');
        setEnableEditButton(false)
      }
    } catch (e) {
      setIsLoading(false);
      setAlertMessage('Não foi possível atualizar o cadastro. Por favor, verifique todos os campos e tente novamente. Caso o erro persista entre em contato com o administrador deste serviço em "marcelo.oc.machado@gmail.com"');
      setMessageType('fail');
    }
  };

  const handleDeleteAllData = async () => {
    try {

      setConfirmDialogOpen(false);

      await api.patch(`users/${user.id}/delete-data`);
      setShowSnackBar(true);
      setIsSuccess(true);
      setSeverity('success');
      setMessage(null);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const openDeleteDialog = () => {
    setConfirmDialogOpen(true);
  }

  const closeDeleteDialog = () => {
    setConfirmDialogOpen(false);
  }

  const handleCloseSuccessSnackbar = async () => {
    setShowSnackBar(false);
    if (isSuccess) {
      setIsSuccess(false);
      await new Promise(resolve => setTimeout(resolve, 500));
      setRedirect(true);
    }
  };

  useEffect(() => {
    if (redirect) {
      navigate(`/experiments`);
    }
  }, [redirect, navigate]);

  return (
    <>
      <CustomSnackbar open={showSnackBar} handleClose={handleCloseSuccessSnackbar} time={1500} message={message} severity={severity} slide={true} variant="filled" showLinear={true} />
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteAllData}
        title="Tem certeza?"
        content="Você terá todos os seus dados de experimentos apagados."
      />
      <Box sx={{ flexFlow: 1, textAlign: 'right' }}>
        <Button color='error' variant='contained' onClick={openDeleteDialog}>
          Apagar todos meus dados
        </Button>
      </Box>
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
          <form onSubmit={handleEdit} disabled={isLoading}>

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
              autoComplete="email"
              error={!isValidEmail}
              helperText={!isValidEmail ? 'E-mail inválido.' : ''}
              fullWidth
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
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              style={{ margin: '16px 0' }}
              disabled={!enableEditButton || isLoading}
            >
              Editar
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export { Account };