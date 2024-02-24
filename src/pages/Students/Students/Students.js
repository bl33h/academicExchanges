import Container from "@mui/material/Container";
import {Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import "./Students.scss"
import Table from '../Table/Table'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";


const Students = () => {
    const navigate = useNavigate();
    const handleRegister = () => {
        navigate("/estudiantes/new");
    }

    return (
        <Container
            maxWidth={"xl"}
            className={"students"}
        >
            <Paper className={"container"}>
                <Typography
                    variant={"h4"}
                    className={"title"}
                    sx={{fontFamily: "Roboto"}}
                >
                    Estudiantes
                </Typography>
                <Button
                    variant="contained"
                    color="success"
                    sx={{
                        width: "150px",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                    onClick={handleRegister}
                >
                    <PersonAddIcon/>
                    Registrar
                </Button>
            </Paper>
            <Table/>
        </Container>
    )
}

export default Students