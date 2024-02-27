import * as React from 'react';
import {useEffect, useState} from 'react';
import {DataGrid, GridActionsCellItem, GridToolbar} from '@mui/x-data-grid';
// import {getUniversities, deleteUniversity} from "../../../supabase/UniversitiesQueries";
import LinearProgress from '@mui/material/LinearProgress';
import "./Table.scss";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
            console.log('Eliminando', id)
            // deleteUniversity(id).then(() => {
            //     Swal.fire({
            //         position: 'center',
            //         icon: 'success',
            //         title: 'Universidad Eliminada',
            //         showConfirmButton: false,
            //         timer: 1500
            //     })
            //     setTimeout(() => {
            //         window.location.reload();
            //     }, 1500);
            // }).catch((error) => {
            //     Swal.fire({
            //         position: 'center',
            //         icon: 'error',
            //         title: `${error.message}`,
            //         showConfirmButton: false,
            //         timer: 1500
            //     })
            // })
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
                    window.location.href = `/universities/edit/${params.id}`;
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
    {field: 'name', headerName: 'Nombre', width: 350},
    {field: 'short_name', headerName: 'Nombre Corto', width: 200},
    {field: 'country', headerName: 'País', width: 300},
];

export default function Table() {
    const [rows, setRows] = useState([]);
    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8001/universities');
            const data = await response.json();
            return data.map((university) => {
                return {
                    id: university._id,
                    name: university.name,
                    short_name: university.acronym,
                    country: university.country.name,
                }
            });
        }
        catch (error) {
            console.error('Error:', error);
        }
    }
    useEffect(() => {
        fetchData().then((data) => {
            setRows(data);
        }).catch((error) => {
            console.error('Error fetching universities:', error)
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