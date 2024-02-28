import React, {useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveIcon from '@mui/icons-material/Save';
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import ButtonCheckStudent from "../../components/ButtonCheckStudent";
import {Autocomplete, FormControl, InputLabel, Select} from "@mui/material";
import Swal from 'sweetalert2'

const ExchangeForm = ({id = -1}) => {
    const navigate = useNavigate();
    const isNewExchange = id === -1;

    const [errorOccurred, setErrorOccurred] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [firstTry, setFirstTry] = useState(true);

    const [exchange, setExchange] = useState({
        id: id ? id : '',
        student_id: '',
        university_name: '',
        university_id: '',
        details: {
            year: '',
            semester: '',
            status: '',
            start_date: '',
            end_date: '',
            comments: [],
        }
    });

    const [isYearEmpty, setIsYearEmpty] = useState(false);

    const [isSemesterEmpty, setIsSemesterEmpty] = useState(false);

    const [isStudentEmpty, setIsStudentEmpty] = useState(false);

    const [isUniversityEmpty, setIsUniversityEmpty] = useState(false);

    const [modalities, setModalities] = useState([]);
    const fetchModalities = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8001/modalities');
            const data = await response.json();
            return data.map((item, index) => {
                return {
                    id: index + 1,
                    modality: item
                }
            });
        } catch (error) {
            setErrorOccurred(true);
            setError(error);
        }
    }
    useEffect(() => {
        fetchModalities().then((data) => {
            setModalities(data);
        }).catch((error) => {
            setErrorOccurred(true);
            setError(error);
        });
    }, []);

    const [states, setStates] = useState([]);
    const fetchStates = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8001/status');
            const data = await response.json();
            return data.map((item, index) => {
                return {
                    id: index + 1,
                    state: item
                }
            });
        } catch (error) {
            setErrorOccurred(true);
            setError(error);
        }
    }
    useEffect(() => {
        fetchStates().then((data) => {
            setStates(data);
        }).catch((error) => {
            setErrorOccurred(true);
            setError(error);
        });
    }, []);

    const [universities, setUniversities] = useState([]);
    const fetchUniversities = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8001/universities');
            const data = await response.json();
            return data.map((university) => {
                return {
                    id: university._id,
                    label: university.name,
                }
            });

        } catch (error) {
            setErrorOccurred(true);
            setError(error);
        }
    }
    useEffect(() => {
        fetchUniversities().then((data) => {
            setUniversities(data);
        }).catch((error) => {
            setErrorOccurred(true);
            setError(error);
        });
    }, []);

    // Check if all the data has been fetched
    useEffect(() => {
        if (modalities.length > 0 && states.length > 0 && universities.length > 0) {
            setLoading(false);
        }
    }, [modalities, states, universities]);

    const isDataValid = () => {
        return exchange.student_id !== '' && exchange.university_id !== '';
    }


    const insertExchange = async (exchange) => {
        try {
            const response = await fetch('http://127.0.0.1:8001/exchanges', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(exchange)
            });
        } catch (error) {
            setErrorOccurred(true);
            setError(error);
        }
    }

    const handleSubmit = async (event) => {
        setFirstTry(false);
        event.preventDefault();
        console.log(exchange)

        try {
            if (!isDataValid()) {
                throw new Error("Hay campos vacíos")
            }
            const studentExists = true
            if (!studentExists) {
                setIsStudentEmpty(true);
                throw new Error("El estudiante no existe");
            }
            if (isNewExchange) {
                const exchange_to_insert = {
                    student_id: exchange.student_id,
                    university_id: exchange.university_id,
                    details: {
                        year: exchange.details.year,
                        semester: exchange.details.semester,
                        modality: exchange.details.modality,
                        status: exchange.details.status,
                        start_date: exchange.details.start_date,
                        end_date: exchange.details.end_date,
                        comments: exchange.details.comments,
                    }
                }
                insertExchange(exchange_to_insert).then(() => {
                    Swal.fire({
                        title: 'Intercambio registrado',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        navigate("/exchanges");
                    });
                }).catch((error) => {
                    setErrorOccurred(true);
                    setError(error);
                });
            } else {
                exchange.id = id;
                console.log("Editing exchange with id:", id)
            }
        } catch (error) {
            setErrorOccurred(true);
            setError(error)
        }
    }

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
                <div className={"new-exchange"}>
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
                                {isNewExchange ? <AddCircleIcon/> : <EditIcon/>}
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                {isNewExchange ? "Registrar Intercambio" : "Editar Intercambio"}
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} sm={6}>
                                        <TextField
                                            name="year"
                                            id="year"
                                            label="Año"
                                            required
                                            fullWidth
                                            autoFocus
                                            error={isYearEmpty}
                                            value={exchange.details.year}
                                            InputLabelProps={{shrink: true}}
                                            helperText={isYearEmpty ? 'Este campo es requerido' : ''}
                                            onChange={(e) => {
                                                setExchange({
                                                    ...exchange,
                                                    details: {...exchange.details, year: e.target.value}
                                                });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <TextField
                                            fullWidth
                                            required
                                            id="semester"
                                            label="Semestre"
                                            name="semester"
                                            value={exchange.details.semester}
                                            InputLabelProps={{shrink: true}}
                                            error={isSemesterEmpty}
                                            helperText={isSemesterEmpty ? 'Este campo es requerido' : ''}
                                            onChange={(e) => {
                                                setExchange({
                                                    ...exchange,
                                                    details: {...exchange.details, semester: e.target.value}
                                                });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={9} sm={9}>
                                        <TextField
                                            fullWidth
                                            required
                                            id="student"
                                            label="Carné del Estudiante"
                                            name="student"
                                            value={exchange.student_id}
                                            InputLabelProps={{shrink: true}}
                                            error={isStudentEmpty}
                                            helperText={isStudentEmpty ? 'Este campo es requerido' : ''}
                                            onChange={(e) => {
                                                setExchange({...exchange, student_id: e.target.value});
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={3} sm={3}>
                                        <ButtonCheckStudent
                                            studentId={exchange.student_id}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Autocomplete
                                            disablePortal
                                            required
                                            fullWidth
                                            id="university"
                                            name="university"
                                            value={exchange.university_name ? exchange.university_name : null}
                                            isOptionEqualToValue={(option, value) => option.label === value}
                                            options={universities}
                                            renderInput={(params) =>
                                                <TextField {...params}
                                                           label="Universidad"
                                                           error={isUniversityEmpty}
                                                           helperText={isUniversityEmpty ? 'Este campo es requerido' : ''}
                                                />
                                            }
                                            onChange={(event, value) => {
                                                if (value) {
                                                    setExchange((prevExchange) => ({
                                                        ...prevExchange,
                                                        university_id: value.id,
                                                        university_name: value.label,
                                                    }));
                                                } else {
                                                    setExchange((prevExchange) => ({
                                                        ...prevExchange,
                                                        university_id: null,
                                                        university_name: "",
                                                    }));
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id="modalities-label">Modalidad</InputLabel>
                                            <Select
                                                labelId="modalities-label"
                                                id="modalities"
                                                value={exchange.details.modality_id ? exchange.details.modality_id : ''}
                                                label="modalities"
                                                onChange={(event) => {
                                                    const selectedModality = modalities.find((modality) => modality.id === event.target.value);
                                                    setExchange((prevExchange) => ({
                                                        ...prevExchange,
                                                        details: {
                                                            ...prevExchange.details,
                                                            modality: selectedModality ? selectedModality.modality : '',
                                                            modality_id: selectedModality ? selectedModality.id : ''
                                                        }
                                                    }));
                                                }}
                                            >
                                                {modalities.map((modality) => (
                                                    <MenuItem key={modality.id} value={modality.id}>
                                                        {modality.modality}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <FormControl fullWidth>
                                            <InputLabel id="states-label">Estado</InputLabel>
                                            <Select
                                                labelId="states-label"
                                                id="states"
                                                value={exchange.details.status_id ? exchange.details.status_id : ''}
                                                label="Estado"
                                                onChange={(event) => {
                                                    const selectedState = states.find((state) => state.id === event.target.value);
                                                    setExchange((prevExchange) => ({
                                                        ...prevExchange,
                                                        details: {
                                                            ...prevExchange.details,
                                                            status: selectedState ? selectedState.state : '',
                                                            status_id: selectedState ? selectedState.id : ''
                                                        }
                                                    }));
                                                }}
                                            >
                                                {states.map((state) => (
                                                    <MenuItem key={state.id} value={state.id}>
                                                        {state.state}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            name="start_date"
                                            fullWidth
                                            id="start_date"
                                            label="Fecha Inicio"
                                            value={exchange.start_date}
                                            InputLabelProps={{shrink: true}}
                                            onChange={(e) => {
                                                setExchange({
                                                    ...exchange,
                                                    details: {...exchange.details, start_date: e.target.value}
                                                });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            name="end_date"
                                            fullWidth
                                            id="end_date"
                                            label="Fecha Fin"
                                            value={exchange.end_date}
                                            InputLabelProps={{shrink: true}}
                                            onChange={(e) => {
                                                setExchange({
                                                    ...exchange,
                                                    details: {...exchange.details, end_date: e.target.value}
                                                });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            id="comments"
                                            name={"comments"}
                                            label="Comentarios"
                                            multiline
                                            fullWidth
                                            rows={4}
                                            defaultValue={exchange.comments}
                                            onChange={(e) => setExchange({
                                                ...exchange,
                                                details: {
                                                    ...exchange.details,
                                                    comments: [e.target.value]
                                                }
                                            })}
                                        />
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
};

export default ExchangeForm;