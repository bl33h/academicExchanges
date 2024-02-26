import Button from "@mui/material/Button";
import React from "react";
import Swal from 'sweetalert2'

const handleCheckStudent = async (studentId) => {
    console.log("CHECKING STUDENT ID: ", studentId);
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