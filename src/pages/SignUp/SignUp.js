// https://github.com/mui/material-ui/blob/v5.13.4/docs/data/material/getting-started/templates/sign-up/SignUp.js
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import './SignUp.scss';
import {useState} from "react";
import {supabase} from "../../supabase/client";
import {isWhitelisted} from "../../supabase/AccountsQueries";
import NotAllowedAlert from "../../components/Alerts/NotAllowedAlert";
import UserAlreadyExistsAlert from "../../components/Alerts/UserAlreadyExistsAlert";
import {useNavigate} from "react-router-dom";
import {FormControl, InputAdornment, InputLabel, OutlinedInput} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";

export default function SignUp() {
    const [userAlreadyExists, setUserAlreadyExists] = useState(false);
    const [isWhitelistedUser, setIsWhitelistedUser] = useState(true);
    const [isPasswordLengthValid, setIsPasswordLengthValid] = useState(true);
    const [isNameFilled, setIsNameFilled] = useState(true);
    const [isLastNameFilled, setIsLastNameFilled] = useState(true);
    const [isEmailFilled, setIsEmailFilled] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const helper = "Este campo es obligatorio";
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const signUp = async (email, password, name, lastName) => {
        const {error} = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                name: name,
                lastName: lastName
            }
        });
        if (error) {
            console.log(error);
            setUserAlreadyExists(true);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const password = data.get('password');
        const confirmPassword = data.get('confirmPassword');
        const email = data.get('email');
        const name = data.get('name');
        const lastName = data.get('lastName');

        setIsPasswordLengthValid(password.length >= 6);
        setIsNameFilled(name.length > 0);
        setIsLastNameFilled(lastName.length > 0);
        setIsEmailFilled(email.length > 0);
        setPasswordsMatch(password === confirmPassword);

        // Checked again due to the async nature of the validations
        if (password.length >= 6
            && name.length > 0
            && lastName.length > 0
            && email.length > 0
            && password === confirmPassword
        ) {
            const whiteListed = await isWhitelisted(email);
            try {
                if (whiteListed) {
                    await signUp(email, password, name, lastName);
                    navigate('/');
                } else {
                    setIsWhitelistedUser(false);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className={"sign-up"}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: '#0b9e51'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Crear un Usuario
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Nombres"
                                    autoFocus
                                    {...(isNameFilled ? {} : {error: true, helperText: helper})}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Apellidos"
                                    name="lastName"
                                    autoComplete="family-name"
                                    {...(isLastNameFilled ? {} : {error: true, helperText: helper})}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Correo Institucional"
                                    name="email"
                                    autoComplete="email"
                                    {...(isEmailFilled ? {} : {error: true, helperText: helper})}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl
                                    sx={{width: '100%'}}
                                    variant="outlined"
                                    required
                                >
                                    <InputLabel htmlFor="password">Contraseña</InputLabel>
                                    <OutlinedInput
                                        id="password"
                                        name={"password"}
                                        type={showPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="Cambiar visibilidad de contraseña"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Contraseña"
                                        error={!passwordsMatch || !isPasswordLengthValid}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl
                                    sx={{width: '100%'}}
                                    variant="outlined"
                                    required
                                >
                                    <InputLabel htmlFor="password">Confirmar Contraseña</InputLabel>
                                    <OutlinedInput
                                        id="confirmPassword"
                                        name={"confirmPassword"}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="Cambiar visibilidad de contraseña"
                                                    onClick={handleClickShowConfirmPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff/> : <Visibility/>}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Confirmar Contraseña"
                                        error={!passwordsMatch || !isPasswordLengthValid}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="caption" color="error">
                                    {!isPasswordLengthValid && "La contraseña debe tener al menos 6 caracteres\t"}
                                    {!passwordsMatch && "Las contraseñas no coinciden"}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            className={"submit-button"}
                        >
                            Crear Usuario
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href={'./'} variant="body2">
                                    ¿Ya has creado tu usuario? Inicia Sesión
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                {!isWhitelistedUser && <NotAllowedAlert/>}
                {userAlreadyExists && <UserAlreadyExistsAlert/>}
            </Container>
        </div>
    );
}