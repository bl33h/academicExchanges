import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
// import {doesUniversityExist, getUniversityById, insertUniversity} from "../../supabase/UniversitiesQueries";
// import {getCountriesList} from "../../supabase/GeoQueries";
import CircularProgress from '@mui/material/CircularProgress';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import SaveIcon from '@mui/icons-material/Save';
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from '@mui/icons-material/Edit';
import Swal from 'sweetalert2'


const UniversityForm = ({id = -1}) => {
        const navigate = useNavigate();

        const isNewUniversity = id === -1;

        const [errorOccurred, setErrorOccurred] = useState(false);
        const [error, setError] = useState(null);
        const [loading, setLoading] = useState(false);
        const [firstTry, setFirstTry] = useState(true);

        const [university, setUniversity] = useState({
            name: '',
            shortName: '',
            countryId: '',
        });
        const getUniversityById = async (id) => {
            try {
                const response = await fetch(`http://127.0.0.1:8001/universities/` + id);
                return await response.json();
            } catch (error) {
                console.error('Error:', error);

            }
        }
        useEffect(() => {
            if (!isNewUniversity) {
                getUniversityById(id).then((university) => {
                    console.log('university:', university);
                    setUniversity({
                        name: university.name,
                        shortName: university.acronym,
                        countryId: university.country_id,
                    });
                    setLoading(false);
                }).catch((error) => {
                    setErrorOccurred(true);
                    setError(error);
                });
            } else {
                setLoading(false);
            }
        }, []);

        const [isNameEmpty, setIsNameEmpty] = useState(false);
        useEffect(() => {
            if (!firstTry) {
                setIsNameEmpty(university.name === '');
            }
        }, [university.name]);

        const [isCountryEmpty, setIsCountryEmpty] = useState(false);
        useEffect(() => {
            if (!firstTry) {
                setIsCountryEmpty(university.countryId === '');
            }
        }, [university.countryId]);

        const [countries, setCountries] = useState([]);
        const fetchCountries = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8001/countries');
                const data = await response.json();
                return data.map((country) => {
                    return {
                        id: country._id,
                        name: country.name,
                    }
                });
            } catch (error) {
                console.error('Eror:', error);
            }
        }
        useEffect(() => {
            fetchCountries().then((countriesList) => {
                setCountries(countriesList);
                setLoading(false);
            });
        }, []);

        const insertUniversity = async (university) => {
            try {
                const response = await fetch('http://127.0.0.1:8001/universities', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(university),
                });
                return await response.json();
            } catch (error) {
                console.error('Error:', error);
            }
        }

        const doesUniversityExist = async (name) => {
            try {
                const response = await fetch(`http://127.0.0.1:8001/universities/by_name/` + name);
                const data = await response.json();
                console.log(data[1])
                return data[1] != 404;
            } catch (error) {
                console.error('Error:', error);
            }
        }

        const updateUniversity = async (university) => {
            try {
                const response = await fetch(`http://127.0.0.1:8001/universities/` + id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(university),
                });
            } catch (error) {
                console.error('Error:', error);

            }
        }

        const handleSubmit = async (event) => {
            event.preventDefault();
            setFirstTry(false);
            if (university.name !== '' && university.countryId !== '') {
                try {
                    if (isNewUniversity) {
                        const doesExist = await doesUniversityExist(university.name);
                        if (doesExist) {
                            throw new Error(`Ya existe una universidad con el nombre ${university.name}`);
                        } else {
                            await insertUniversity({
                                name: university.name,
                                acronym: university.shortName,
                                country_id: university.countryId,
                            });
                            Swal.fire({
                                icon: 'success',
                                title: '¡Muy Bien!',
                                text: 'Universidad registrada exitosamente',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            setTimeout(() => {
                                navigate('/universities');
                            }, 1500);
                        }
                    } else {
                        await updateUniversity({
                            name: university.name,
                            acronym: university.shortName,
                            country_id: university.countryId,
                        });
                        Swal.fire({
                            icon: 'success',
                            title: '¡Muy Bien!',
                            text: 'Universidad actualizada exitosamente',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setTimeout(() => {
                            navigate('/universities');
                        }, 1500);
                    }
                } catch (error) {
                    setErrorOccurred(true);
                    setError(error);
                }
            }
        };

        return (
            <>
                {errorOccurred && (
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {error.message}
                    </Alert>
                )}
                {loading && !errorOccurred ? (
                    <div className="loading">
                        <CircularProgress/>
                    </div>
                ) : (
                    <div className={"edit-university"}>
                        <Container component="main" maxWidth="xs">
                            <Box
                                sx={{
                                    marginTop: 8,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Avatar sx={{m: 1, bgcolor: '#0b9e51'}}>
                                    {isNewUniversity ? <DomainAddIcon/> : <EditIcon/>}
                                </Avatar>
                                <Typography component="h1" variant="h5">
                                    {isNewUniversity ? 'Nueva Universidad' : 'Editar Universidad'}
                                </Typography>
                                <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12}>
                                            <TextField
                                                name="name"
                                                required
                                                fullWidth
                                                id="name"
                                                label="Nombre de la Universidad"
                                                value={university.name}
                                                autoFocus
                                                InputLabelProps={{shrink: true}}
                                                error={isNameEmpty}
                                                helperText={isNameEmpty ? 'Este campo es requerido' : ''}
                                                onChange={(e) => {
                                                    setUniversity({...university, name: e.target.value});
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                id="short_name"
                                                label="Nombre Corto"
                                                name="short_name"
                                                value={university.shortName}
                                                InputLabelProps={{shrink: true}}
                                                onChange={(e) => setUniversity({...university, shortName: e.target.value})}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                id="countries"
                                                select
                                                label="País"
                                                fullWidth
                                                name="countries"
                                                value={university.countryId}
                                                error={isCountryEmpty}
                                                helperText={isCountryEmpty ? 'Este campo es requerido' : ''}
                                                onChange={(e) => {
                                                    setUniversity({...university, countryId: e.target.value});
                                                }}
                                            >
                                                {countries ? (
                                                    countries.map((country) => (
                                                        <MenuItem key={country.id} value={country.id}>
                                                            {country.name}
                                                        </MenuItem>
                                                    ))
                                                ) : (
                                                    <MenuItem value="">
                                                        No hay países disponibles
                                                    </MenuItem>
                                                )}
                                            </TextField>

                                        </Grid>
                                    </Grid>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{
                                            mt: 3,
                                            mb: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        className={"submit-button"}
                                        color={"success"}
                                    >
                                        Guardar
                                        <SaveIcon sx={{marginLeft: '0.5rem'}}/>
                                    </Button>
                                </Box>
                            </Box>
                        </Container>
                    </div>
                )}
            </>
        );
    }
;

export default UniversityForm;