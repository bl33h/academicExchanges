import Button from "@mui/material/Button";
import React from "react";
import Swal from 'sweetalert2'
import {getStudentById} from "../../supabase/StudentQueries";

const handleCheckStudent = async (studentId) => {
    await getStudentById(studentId).then((student) => {
        Swal.fire({
            position: 'center',
            icon: 'info',
            title: `${student.id}: ${student.name}`,
            showConfirmButton: false,
            timer: 1500
        })
    }).catch((error) => {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: `No se encontró el estudiante con carnet ${studentId}`,
            showConfirmButton: false,
            timer: 1500
        })
    });
}

const CheckStudentButton = ({studentId}) => {
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

export default CheckStudentButton;