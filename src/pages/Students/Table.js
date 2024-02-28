import * as React from 'react';
import {DataGrid, GridActionsCellItem, GridToolbar} from '@mui/x-data-grid';
import {useEffect, useState} from "react";
import LinearProgress from "@mui/material/LinearProgress";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const handleDelete = async (id) => {
    const paddedId = String(id).padStart(24, '0');
    try {
        const response = await fetch('http://127.0.0.1:8001/students/' + paddedId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.ok) {
                alert('Estudiante eliminado correctamente')
                window.location.href = '/students';
            } else {
                console.error('Error:', response);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
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
                    const paddedId = String(params.id).padStart(24, '0');
                    window.location.href = `/students/edit/${paddedId}`;
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
];

export default function Table() {
    const [rows, setRows] = useState([]);
    const fetchData = async () => {
        try{
            const response = await fetch('http://127.0.0.1:8001/students');
            const data = await response.json();
            return data.map((student) => {
                return {
                    id: student._id.replace(/^0+/, ''),
                    name: student.name,
                    mail: student.email,
                    career: student.career.name,
                    faculty: student.career.faculty.name,
                }
            });
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        fetchData()
            .then((data) => {
                setRows(data);
            })
            .catch((error) => {
                console.error('Error fetching students:', error);
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