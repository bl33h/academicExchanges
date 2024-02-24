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
import {Autocomplete, FormControl, InputLabel, Select} from "@mui/material";
import {getUniversities} from "../../supabase/UniversitiesQueries";
import {getModalities, getStates} from "../../supabase/MiscellaneousQueries";
import {getExchangeById, insertStudentInExchange, updateExchange} from "../../supabase/ExchangeQueries";
import {doesStudentExist} from "../../supabase/StudentQueries";
import CheckStudentButton from "../../components/Buttons/CheckStudent";
import Swal from 'sweetalert2'

const EditExchange = ({id = -1}) => {
    const navigate = useNavigate();
    const isNewExchange = id === -1;

    const [errorOccurred, setErrorOccurred] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [firstTry, setFirstTry] = useState(true);

    const [exchange, setExchange] = useState({
        year: '',
        semester: '',
        studentId: '',
        universityName: '',
        universityId: null,
        modalityName: '',
        modalityId: '',
        stateName: '',
        stateId: '',
        cycle: '',
        date: '',
        coursesUvg: '',
        coursesExchange: '',
        comments: '',
    });
    useEffect(() => {
        if (!isNewExchange) {
            getExchangeById(id).then((exchange) => {
                setExchange({
                    year: exchange.year,
                    semester: exchange.semester,
                    studentId: exchange.student_id,
                    universityName: exchange.university,
                    universityId: exchange.university_id,
                    modalityName: exchange.modality,
                    modalityId: exchange.modality_id,
                    stateName: exchange.state,
                    stateId: exchange.state_id,
                    cycle: exchange.cycle,
                    date: exchange.date,
                    coursesUvg: exchange.coursesUvg,
                    coursesExchange: exchange.coursesExchange,
                    comments: exchange.comments,
                })

            }).catch((error) => {
                setErrorOccurred(true);
                setError(error);
            })
        }
    }, []);

    const [isYearEmpty, setIsYearEmpty] = useState(false);
    useEffect(() => {
        if (!firstTry) {
            setIsYearEmpty(exchange.year === '');
        }
    }, [exchange.year, firstTry])

    const [isSemesterEmpty, setIsSemesterEmpty] = useState(false);
    useEffect(() => {
        if (!firstTry) {
            setIsSemesterEmpty(exchange.semester === '');
        }
    }, [exchange.semester, firstTry])

    const [isStudentEmpty, setIsStudentEmpty] = useState(false);
    useEffect(() => {
        if (!firstTry) {
            setIsStudentEmpty(exchange.studentId === '');
        }
    }, [exchange.studentId, firstTry]);

    const [isUniversityEmpty, setIsUniversityEmpty] = useState(false);
    useEffect(() => {
        if (!firstTry) {
            setIsUniversityEmpty(exchange.universityId === '');
        }
    }, [exchange.universityId, firstTry]);

    const [modalities, setModalities] = useState([]);
    const [states, setStates] = useState([]);
    const [universities, setUniversities] = useState([]);
    useEffect(() => {
        getModalities()
            .then((modalities) => {
                setModalities(modalities);
            })
            .catch((error) => {
                setErrorOccurred(true);
                setError(error);
            })

        getStates()
            .then((states) => {
                setStates(states);
            })
            .catch((error) => {
                setErrorOccurred(true);
                setError(error);
            })

        getUniversities()
            .then((universities) => {
                const transformedUniversities = universities.map((university) => {
                    return {
                        label: university.name,
                        id: university.id,
                    }
                });
                setUniversities(transformedUniversities);
            })
            .catch((error) => {
                setErrorOccurred(true);
                setError(error);
            })
    }, []);
    useEffect(() => {
        if (modalities.length > 0 && states.length > 0 && universities.length > 0) {
            setLoading(false);
        }
    }, [modalities, states, universities]);

    const isDataValid = () => {
        return exchange.year !== '' &&
            exchange.semester !== '' &&
            exchange.studentId !== ''
    }

    const handleSubmit = async (event) => {
        setFirstTry(false);
        event.preventDefault();
        try {
            if (!isDataValid()) {
                throw new Error("Hay campos vacíos")
            }
            const studentExists = await doesStudentExist(exchange.studentId);
            if (!studentExists) {
                setIsStudentEmpty(true);
                throw new Error("El estudiante no existe");
            }
            const exchangeData = {
                year: exchange.year,
                semester: exchange.semester,
                studentId: exchange.studentId,
                universityId: exchange.universityId,
            }
            exchangeData.modalityId = exchange.modalityId === "" ? null : exchange.modalityId;
            exchangeData.stateId = exchange.stateId === "" ? null : exchange.stateId;
            exchangeData.cycle = exchange.cycle === "" ? null : exchange.cycle;
            exchangeData.date = exchange.date === "" ? null : exchange.date;
            exchangeData.coursesUvg = exchange.coursesUvg === "" ? null : exchange.coursesUvg;
            exchangeData.coursesExchange = exchange.coursesExchange === "" ? null : exchange.coursesExchange;
            exchangeData.comments = exchange.comments === "" ? null : exchange.comments;
            if (isNewExchange) {
                insertStudentInExchange(exchangeData)
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Muy Bien!',
                            text: 'Intercambio registrado exitosamente',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        setTimeout(() => {
                            navigate('/estudiantes-de-intercambio');
                        }, 1500);
                    }).catch((error) => {
                    setErrorOccurred(true);
                    setError(error);
                });
            } else {
                exchangeData.id = id;
                updateExchange(exchangeData)
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Muy Bien!',
                            text: 'Intercambio actualizado exitosamente',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        setTimeout(() => {
                            navigate('/estudiantes-de-intercambio');
                        }, 1500);
                    })
                    .catch((error) => {
                        setErrorOccurred(true);
                        setError(error);
                    });
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
                                            value={exchange.year}
                                            InputLabelProps={{shrink: true}}
                                            helperText={isYearEmpty ? 'Este campo es requerido' : ''}
                                            onChange={(e) => {
                                                setExchange({...exchange, year: e.target.value});
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
                                            value={exchange.semester}
                                            InputLabelProps={{shrink: true}}
                                            error={isSemesterEmpty}
                                            helperText={isSemesterEmpty ? 'Este campo es requerido' : ''}
                                            onChange={(e) => {
                                                setExchange({...exchange, semester: e.target.value});
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
                                            value={exchange.studentId}
                                            InputLabelProps={{shrink: true}}
                                            error={isStudentEmpty}
                                            helperText={isStudentEmpty? 'Este campo es requerido' : ''}
                                            onChange={(e) => {
                                                setExchange({...exchange, studentId: e.target.value});
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={3} sm={3}>
                                        <CheckStudentButton
                                            studentId={exchange.studentId}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Autocomplete
                                            disablePortal
                                            required
                                            fullWidth
                                            id="university"
                                            name="university"
                                            value={exchange.universityName ? exchange.universityName : null}
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
                                                        universityId: value.id,
                                                        universityName: value.label,
                                                    }));
                                                } else {
                                                    setExchange((prevExchange) => ({
                                                        ...prevExchange,
                                                        universityId: null,
                                                        universityName: "",
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
                                                value={exchange.modalityId ? exchange.modalityId : ''}
                                                label="modalities"
                                                onChange={(event) => {
                                                    const selectedModality = modalities.find((modality) => modality.id === event.target.value);
                                                    setExchange((prevExchange) => ({
                                                        ...prevExchange,
                                                        modalityName: selectedModality ? selectedModality.modality : '',
                                                        modalityId: selectedModality ? selectedModality.id : ''
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
                                                value={exchange.stateId ? exchange.stateId : ''}
                                                label="Estado"
                                                onChange={(event) => {
                                                    const selectedState = states.find((state) => state.id === event.target.value);
                                                    setExchange((prevExchange) => ({
                                                        ...prevExchange,
                                                        stateId: selectedState ? selectedState.id : '',
                                                        stateName: selectedState ? selectedState.state : ''
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
                                            name="cycle"
                                            fullWidth
                                            id="cycle"
                                            label="Ciclo"
                                            value={exchange.cycle}
                                            InputLabelProps={{shrink: true}}
                                            onChange={(e) => {
                                                setExchange({...exchange, cycle: e.target.value});
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            name="date"
                                            fullWidth
                                            id="date"
                                            label="Fecha Viaje"
                                            value={exchange.date}
                                            InputLabelProps={{shrink: true}}
                                            onChange={(e) => {
                                                setExchange({...exchange, date: e.target.value});
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <TextField
                                            fullWidth
                                            id="coursesUvg"
                                            label="Cursos UVG"
                                            name="coursesUvg"
                                            value={exchange.coursesUvg}
                                            InputLabelProps={{shrink: true}}
                                            onChange={(e) => setExchange({...exchange, coursesUvg: e.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6}>
                                        <TextField
                                            fullWidth
                                            id="coursesExchange"
                                            label="Cursos Intercambio"
                                            name="coursesExchange"
                                            value={exchange.coursesExchange}
                                            InputLabelProps={{shrink: true}}
                                            onChange={(e) => setExchange({
                                                ...exchange,
                                                coursesExchange: e.target.value
                                            })}
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
                                            onChange={(e) => setExchange({...exchange, comments: e.target.value})}
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

export default EditExchange;