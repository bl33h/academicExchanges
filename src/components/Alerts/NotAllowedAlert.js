import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function DescriptionAlerts() {
    return (
        <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            Su cuenta no está habilitada para utilizar esta herramienta - <strong>Si esto es un error, contacte con la
            Unidad de Internacionalización</strong>
        </Alert>
    );
}