import Button from "@mui/material/Button";
import React from "react";
import Swal from 'sweetalert2'

const handleCheckStudent = async (studentId) => {
    try{
        const padded_id = studentId.toString().padStart(24, '0');
        const response = await fetch(`http://127.0.0.1:8001/students/${padded_id}`);
        const data = await response.json();
        if (data[1] != 404) {
            Swal.fire({
                title: 'Estudiante encontrado',
                text: `Nombre: ${data.name}`,
                icon: 'success',
                confirmButtonText: 'Ok'
            })
        } else {
            Swal.fire({
                title: 'Estudiante no encontrado',
                text: 'El estudiante no se encuentra registrado',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
        }
    } catch (error) {
        console.log(error);
    }
}

const ButtonCheckStudent = ({studentId}) => {
    return (
        <Button
            variant={"contained"}
            fullWidth
            required
            sx={{
                height: '100%',
            }}
            onClick={() => {
                handleCheckStudent(studentId);
            }}
        >
            Verificar
        </Button>
    )
}

export default ButtonCheckStudent;