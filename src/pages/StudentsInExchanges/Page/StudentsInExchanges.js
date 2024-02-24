import Container from "@mui/material/Container";
import {Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import Table from '../Table/Table';
import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {useNavigate} from "react-router-dom";

const StudentsInExchanges = () => {
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate("/estudiantes-de-intercambio/new");
    }

    return (
        <Container maxWidth="xl" className="students">
            <Paper className="container">
                <Typography variant="h4" className="title" sx={{fontFamily: "Roboto"}}>
                    Estudiantes de Intercambio
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
                    <AddCircleIcon/>
                    Registrar
                </Button>
            </Paper>
            <Table/>
        </Container>
    );
};

export default StudentsInExchanges;