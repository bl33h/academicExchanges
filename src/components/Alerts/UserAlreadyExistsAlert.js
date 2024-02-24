import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function DescriptionAlerts() {
    return (
        <Alert severity="info">
            <AlertTitle>Info</AlertTitle>
            Usted ya tiene un usuario registrado en el sistema - <strong>Si esto es un error, contacte con la Unidad de
            Internacionalización</strong>
        </Alert>
    );
}