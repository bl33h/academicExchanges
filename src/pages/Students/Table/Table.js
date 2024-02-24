import * as React from 'react';
import {DataGrid, GridActionsCellItem, GridToolbar} from '@mui/x-data-grid';
import {getStudents} from "../../../supabase/StudentQueries";
import {useEffect, useState} from "react";
import LinearProgress from "@mui/material/LinearProgress";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const handleDelete = (id) => {
    alert(`Deleting student with id ${id}`);
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
                    window.location.href = `/estudiantes/edit/${params.id}`;
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
    {field: 'id', headerName: 'Carné', width: 100},
    {field: 'name', headerName: 'Nombre', width: 300},
    {
        field: 'mail',
        headerName: 'Correo',
        width: 250,
    },
    {
        field: 'career',
        headerName: 'Carrera',
        width: 200,
    },
    {
        field: 'faculty',
        headerName: 'Facultad',
        width: 100,
    },
    {
        field: 'gender',
        headerName: 'Género',
        width: 100,
    },
    {
        field: 'campus',
        headerName: 'Campus',
        width: 200,
    },
];

export default function Table() {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const students = await getStudents();
                setRows(students);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
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
