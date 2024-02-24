import Container from "@mui/material/Container";
import * as React from "react";
import Typography from "@mui/material/Typography";

const NotFound = () => {
    return (
        <Container component="main" maxWidth="xs">
            <Typography component="h1" variant="h5">
                404 Not Found
            </Typography>
        </Container>
    );
}

export default NotFound;