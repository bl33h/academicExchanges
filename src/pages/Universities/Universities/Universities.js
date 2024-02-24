import Container from "@mui/material/Container";
import {Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import Table from '../Table/Table';
import Button from "@mui/material/Button";
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import {useNavigate} from "react-router-dom";

const Universities = () => {
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate("/universidades/new");
    }

    return (
        <Container maxWidth="xl" className="students">
            <Paper className="container">
                <Typography variant="h4" className="title" sx={{fontFamily: "Roboto"}}>
                    Universidades
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
                    <DomainAddIcon/>
                    Registrar
                </Button>
            </Paper>
            <Table/>
        </Container>
    );
};

export default Universities;
