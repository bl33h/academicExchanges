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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SaveIcon from '@mui/icons-material/Save';
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
// import {
//     doesStudentExist,
//     getCampuses,
//     getGenders,
//     getStudentById,
//     insertStudent,
//     updateStudent
// } from "../../supabase/StudentQueries";
// import {getCareersByFaculty, getFaculties} from "../../supabase/CareersQueries";
import EditIcon from '@mui/icons-material/Edit';
import Swal from "sweetalert2";


const StudentsForm = ({id = -1}) => {
    const isNewStudent = id === -1;
    const [student, setStudent] = useState({
        id: "",
        name: "",
        mail: "",
        facultyId: "",
        careerId: "",
    });
    const getStudentById = async (id) => {
        try {
            const response = await fetch('http://127.0.0.1:8001/students/' + id);
            return await response.json();
        } catch (error) {
            console.log('Error:', error);
        }
    }
    useEffect(() => {
        if (!isNewStudent) {
            getStudentById(id).then((student) => {
                console.log(student)
                // Remove the initial 0s from the id
                student.id = student.carnet.replace(/^0+/, '');
                setStudent({
                    id: student.id,
                    name: student.name,
                    mail: student.email,
                    facultyId: student.career.faculty._id,
                    careerId: student.career_id,
                })
            }).catch((error) => {
                setErrorOccurred(true);
                setError(error);
            })
        }
    }, []);

    const [errorOccurred, setErrorOccurred] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [firstTry, setFirstTry] = useState(true);

    const [isIdEmpty, setIsIdEmpty] = useState(false);
    useEffect(() => {
        if (!firstTry) {
            setIsIdEmpty(student.id === "")
        }
    }, [student.id, firstTry]);

    const [isNameEmpty, setIsNameEmpty] = useState(false);
    useEffect(() => {
        if (!firstTry) {
            setIsNameEmpty(student.name === "")
        }
    }, [student.name, firstTry]);

    const [isFacultyEmpty, setIsFacultyEmpty] = useState(false);
    useEffect(() => {
        if (!firstTry) {
            setIsFacultyEmpty(student.facultyId === "")
        }
    }, [student.facultyId, firstTry]);

    const [isCareerEmpty, setIsCareerEmpty] = useState(false);
    useEffect(() => {
        if (!firstTry) {
            setIsCareerEmpty(student.careerId === "")
        }
    }, [student.careerId, firstTry]);

    const [isMailEmpty, setIsMailEmpty] = useState(false);
    useEffect(() => {
        if (!firstTry) {
            setIsMailEmpty(student.mail === "")
        }
    }, [student.mail, firstTry]);


    const [faculties, setFaculties] = useState([]);
    const fetchFaculties = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8001/careers/');
            const data = await response.json();
            return data.map((faculty) => {
                return {
                    id: faculty._id,
                    short_name: faculty.short_name,
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }
    useEffect(() => {
        fetchFaculties().then(
            (faculties) => {
                setFaculties(faculties);
            }
        )
    }, []);

    const [careers, setCareers] = useState([]);
    const fetchCareers = async (facultyId) => {
        if (facultyId === "") {
            return [];
        }
        try {
            const response = await fetch('http://127.0.0.1:8001/careers/' + facultyId);
            const data = await response.json();
            return data.map((career) => {
                return {
                    id: career._id,
                    name: career.name,
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }
    useEffect(() => {
        fetchCareers(student.facultyId).then(
            (careers) => {
                setCareers(careers);
            }
        )
    }, [student.facultyId]);

    // Checks if all the data has been fetched
    useEffect(() => {
        if (faculties.length > 0) {
            setLoading(false);
        }
    }, [faculties, careers]);

    const navigate = useNavigate();


    const isDataValid = () => {
        return student.id !== "" && student.name !== "" && student.mail !== "" && student.facultyId !== "" && student.careerId !== "";
    }

    const doesStudentExist = async (id) => {
        try {
            const response = await fetch('http://127.0.0.1:8001/students/' + id);
            const data = await response.json();
            return data[1] !== 404;
        } catch (error) {
            console.error('Error:', error);

        }
    }

    const insertStudent = async (student) => {
        try {
            console.log(student)
            const response = await fetch('http://127.0.0.1:8001/students/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(student)
            });
            return response.json();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const updateStudent = async (student) => {
        try {
            const response = await fetch('http://127.0.0.1:8001/students/' + student.carnet, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(student)
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFirstTry(false);
        try {
            // Pad the student id
            const new_student = {
                ...student,
                carnet: student.id.padStart(24, '0'),
                careerId: student.careerId.padStart(24, '0')
            }
            if (isNewStudent) {
                const doesExist = await doesStudentExist(new_student.id);
                if (doesExist) { // Rise error
                    throw new Error(`El estudiante con carné "${id}" ya existe`);
                }

                if (!isDataValid()) {
                    throw new Error('Hay campos vacíos');
                }
                insertStudent({
                    carnet: new_student.carnet,
                    name: new_student.name,
                    email: new_student.mail,
                    career_id: new_student.careerId,
                }).then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Muy Bien!',
                        text: 'Estudiante registrado exitosamente',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setTimeout(() => {
                        navigate('/students');
                    }, 1500);
                }).catch((error) => {
                    setErrorOccurred(true);
                    setError(error);
                })
            } else {
                updateStudent({
                    carnet: new_student.carnet,
                    name: new_student.name,
                    email: new_student.mail,
                    career_id: new_student.careerId,
                }).then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Muy Bien!',
                        text: 'Estudiante actualizado exitosamente',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setTimeout(() => {
                        navigate('/students');
                    }, 1500);
                }).catch((error) => {
                    console.log(error)
                    setErrorOccurred(true);
                    setError(error);
                })
            }
        } catch (error) {
            setErrorOccurred(true);
            setError(error);
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
                <div className={"new-student"}>
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
                                {isNewStudent ? <PersonAddIcon/> : <EditIcon/>}
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                {isNewStudent ? 'Registrar Estudiante' : 'Editar Estudiante'}
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            name="id"
                                            required
                                            fullWidth
                                            id="id"
                                            label="Carné del Estudiante"
                                            value={student.id}
                                            autoFocus
                                            error={isIdEmpty}
                                            helperText={isIdEmpty ? 'Este campo es requerido' : ''}
                                            onChange={(e) => {
                                                setStudent({...student, id: e.target.value});
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            id="name"
                                            required
                                            fullWidth
                                            label="Nombre del Estudiante"
                                            name="name"
                                            value={student.name}
                                            error={isNameEmpty}
                                            helperText={isNameEmpty ? 'Este campo es requerido' : ''}
                                            onChange={(e) => {
                                                setStudent({...student, name: e.target.value})
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            id="mail"
                                            required
                                            fullWidth
                                            label="Correo del Estudiante"
                                            name="mail"
                                            value={student.mail}
                                            error={isMailEmpty}
                                            helperText={isMailEmpty ? 'Este campo es requerido' : ''}
                                            onChange={(e) => {
                                                setStudent({...student, mail: e.target.value})
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            id="faculty"
                                            select
                                            label="Facultad"
                                            fullWidth
                                            name="faculty"
                                            value={student.facultyId}
                                            error={isFacultyEmpty}
                                            helperText={isFacultyEmpty ? 'Este campo es requerido' : ''}
                                            onChange={(e) => {
                                                setStudent({...student, facultyId: e.target.value});
                                            }}
                                        >
                                            {faculties ? (
                                                faculties.map((faculty) => (
                                                    <MenuItem key={faculty.id} value={faculty.id}>
                                                        {faculty.short_name}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem value="">
                                                    No hay facultades disponibles
                                                </MenuItem>
                                            )}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            id="career"
                                            select
                                            label="Carrera"
                                            fullWidth
                                            name="career"
                                            value={student.careerId}
                                            error={isCareerEmpty}
                                            helperText={isCareerEmpty ? 'Este campo es requerido' : ''}
                                            onChange={(e) => {
                                                setStudent({...student, careerId: e.target.value});
                                            }}
                                        >
                                            {careers ? (
                                                careers.map((career) => (
                                                    <MenuItem key={career.id} value={career.id}>
                                                        {career.name}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem value="">
                                                    No hay carreras disponibles
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
};

export default StudentsForm;