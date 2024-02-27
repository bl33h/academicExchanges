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

    const [isYearEmpty, setIsYearEmpty] = useState(false);

    const [isSemesterEmpty, setIsSemesterEmpty] = useState(false);

    const [isStudentEmpty, setIsStudentEmpty] = useState(false);

    const [isUniversityEmpty, setIsUniversityEmpty] = useState(false);

    const [modalities, setModalities] = useState([]);
    const fetchModalities = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8001/modalities');
            const data = await response.json();
            const enumeratedData = data.map((item, index) => {
                return {
                    id: index + 1,
                    modality: item
                }
            });
            return enumeratedData;
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
    const [universities, setUniversities] = useState([]);

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
            const studentExists = true
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
                console.log("Creating exchange")
            } else {
                exchangeData.id = id;
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
                                        <ButtonCheckStudent
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

export default ExchangeForm;