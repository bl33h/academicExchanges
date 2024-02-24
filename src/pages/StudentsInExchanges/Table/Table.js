import * as React from 'react';
import {useEffect, useState} from 'react';
import {DataGrid, GridActionsCellItem, GridToolbar} from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import {getStudentsInExchanges, deleteExchange} from "../../../supabase/ExchangeQueries";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2'


const handleDelete = (id) => {
    Swal.fire({
        title: '¿Estás seguro que quieres elimnarlo?',
        text: "Esta acción es irreversible",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            deleteExchange(id).then(() => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Intercambio eliminado',
                    showConfirmButton: false,
                    timer: 1500
                })
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }).catch((error) => {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: `${error.message}`,
                    showConfirmButton: false,
                    timer: 1500
                })
            })
        }
    })
}

const columns = [
    {
        field: 'actions',
        type: 'actions',
        width: 20,
        getActions: (params) => [
            <GridActionsCellItem
                icon={<EditIcon/>}
                label="Editar"
                onClick={() => {
                    window.location.href = `/estudiantes-de-intercambio/edit/${params.id}`;
                }}
                showInMenu
            />,
            <GridActionsCellItem
                icon={<DeleteIcon/>}
                label="Eliminar"
                onClick={() => {
                    handleDelete(params.id)
                }}
                showInMenu
            />,
        ],
    },
    {
        field: 'year',
        headerName: 'Año',
        width: 60,
        type: 'number',
    },
    {
        field: 'semester',
        headerName: 'Semestre',
        width: 80,
        type: 'number',
    },
    {
        field: 'student',
        headerName: 'Estudiante',
        width: 200,
    },
    {
        field: 'modality',
        headerName: 'Modalidad',
        width: 100,
    },
    {
        field: 'cycle',
        headerName: 'Ciclo',
        width: 150,
    },
    {
        field: 'university',
        headerName: 'Universidad a visitar',
        width: 225,
    },
    {
        field: 'state',
        headerName: 'Estado de Nominación',
        width: 175,
    },
    {
        field: 'date',
        headerName: 'Fecha de Viaje',
        width: 130,
    },
    {
        field: 'coursesUvg',
        headerName: 'Cursos UVG',
        width: 100,
    },
    {
        field: 'coursesExchange',
        headerName: 'Cursos de Intercambio',
        width: 100,
    },
    {
        field: 'comments',
        headerName: 'Comentarios',
        width: 100,
    },
];

export default function Table() {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        getStudentsInExchanges()
            .then((data) => {
                setRows(data);
            })
            .catch((error) => {
                console.error('Error fetching students in exchanges:', error)
            });
    }, []);

    return (
        <>
            {rows.length === 0 ? (
                <LinearProgress/>
            ) : (
                <div style={{height: '85', width: '100%'}}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {page: 0, pageSize: 15},
                            },
                        }}
                        pageSizeOptions={[15, 25, 50]}
                        disableRowSelectionOnClick={true}
                        slots={{toolbar: GridToolbar}}
                    />
                </div>
            )}
        </>
    );
}
