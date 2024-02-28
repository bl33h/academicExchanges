import React, { useState, useEffect } from 'react';
import { Typography, Box,  Paper, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Swal from "sweetalert2";

const ExchangeDetails = () => {
  const { id } = useParams();
  const [exchangeDetails, setExchangeDetails] = useState(null);
  const [university, setUniversity] = useState(null);

  const [text, setText] = useState('');

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const fetchUniversities = async () => {
    const response = await fetch('http://127.0.0.1:8001/universities/by_name/' + exchangeDetails.university);
    const university = await response.json();
    setUniversity(university);
  }

  const updateExchange = async (newExchange, id) => {
    try {
        const response = await fetch('http://127.0.0.1:8001/exchanges/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newExchange)
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

  const  handleNewComment = async () => {
    const rows = text.split('\n');
    const newComment = rows.filter((row) => row !== '');
    const newComments = exchangeDetails.comments.concat(newComment);
    fetchUniversities();
    const newExchange = {
        student_id : exchangeDetails.id.padStart(24, '0'),
        university_id : university?._id,
        details: {
            year: exchangeDetails.year,
            semester: exchangeDetails.semester,
            modality: exchangeDetails.modality,
            status: exchangeDetails.state,
            start_date: exchangeDetails.date,
            end_date: exchangeDetails.end_date,
            comments: newComments,
        }
    }
    const id = exchangeDetails.ex_id;
    updateExchange(newExchange, id).then(() => {
        Swal.fire({
            icon: 'success',
            title: '¡Muy Bien!',
            text: 'Comentarios agregados exitosamente',
            showConfirmButton: false,
            timer: 1500
        });
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }).catch((error) => {
        console.log(error)
    });
    

}

  const fetchExchange = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8001/exchanges/${id}`);
      const data = await response.json();
      const exchangeDetails = {
        ex_id: data._id ?? 'N/A',
        id: data.student.carnet.replace(/^0+/, '') ?? 'N/A',
        year: data.details.year ?? 'N/A',
        semester: data.details.semester ?? 'N/A',
        student: data.student.name ?? 'N/A',
        modality: data.details.modality ?? 'N/A',
        university: data.university.name ?? 'N/A',
        state: data.details.status ?? 'N/A',
        date: data.details.start_date ?? 'N/A',
        end_date: data.details.end_date ?? 'N/A',
        comments: data.details.comments ?? [],
      };
      setExchangeDetails(exchangeDetails);
    } catch (error) {
      console.error('Error fetching exchange details:', error);
    }
  };

  useEffect(() => {
    fetchExchange();
  }, []);

  return (
    <Box>
      <Paper sx={{ marginLeft: 2, marginRight: 2 }}>
        <Typography variant="h2" gutterBottom  sx={{ fontWeight: 'bold', marginLeft: 5}}>
            Exchange Details
        </Typography>
      </Paper>
      <Paper sx={{ marginLeft: 5, marginRight: 5 }}>
        <Typography variant="h4" gutterBottom  sx={{ fontWeight: 'bold', ml:5 }}>
            ID:
        </Typography>
        <Typography variant="h4" gutterBottom  sx={{ ml:10 }}>
            {exchangeDetails?.id}
        </Typography>
        <Typography variant="h4" gutterBottom  sx={{ fontWeight: 'bold', ml:5 }}>
            Student:
        </Typography>
        <Typography variant="h4" gutterBottom  sx={{ ml:10 }}>
            {exchangeDetails?.student}
        </Typography>
      </Paper>
      <Paper sx={{ marginLeft: 5, marginRight: 5 }}>
        <Typography variant="h4" gutterBottom  sx={{ fontWeight: 'bold', ml:5 }}>
            Year:
        </Typography>
        <Typography variant="h4" gutterBottom  sx={{ ml:10 }}>
            {exchangeDetails?.year}
        </Typography>
        <Typography variant="h4" gutterBottom  sx={{ fontWeight: 'bold', ml:5 }}>
            Semester:
        </Typography>
        <Typography variant="h4" gutterBottom  sx={{ ml:10 }}>
            {exchangeDetails?.semester}
        </Typography>
        <Typography variant="h4" gutterBottom  sx={{ fontWeight: 'bold', ml:5 }}>
            University:
        </Typography>
        <Typography variant="h4" gutterBottom  sx={{ ml:10 }}>
            {exchangeDetails?.university}
        </Typography>
      </Paper>
      <Paper sx={{ marginLeft: 5, marginRight: 5 }}>
        <Typography variant="h4" gutterBottom  sx={{ fontWeight: 'bold', ml:5 }}>
            Modality:
        </Typography>
        <Typography variant="h4" gutterBottom  sx={{ ml:10 }}>
            {exchangeDetails?.modality}
        </Typography>
        <Typography variant="h4" gutterBottom  sx={{ fontWeight: 'bold', ml:5 }}>
            Date:
        </Typography>
        <Typography variant="h4" gutterBottom  sx={{ ml:10 }}>
            {exchangeDetails?.date}
        </Typography>
      </Paper>
      <Paper sx={{ marginLeft: 5 }}>
        <Typography variant="h4" gutterBottom  sx={{ fontWeight: 'bold', ml:5 }}>
            Comments:
        </Typography>
        {exchangeDetails?.comments.map((comment, index) => (
            <Typography variant="h4" gutterBottom  sx={{ ml:5 }}>
                {index + 1} - {comment}
            </Typography>
        ))}
      </Paper>
      <Paper sx={{ marginLeft: 5, marginRight: 5 }}>
        <TextField
        multiline
        rows={3}
        onChange={handleChange}
        label="Add Comment"
        sx={{ margin: 4, width:'95%' }} 
        />
        <Button
            variant="contained"
            color="success"
            sx={{
                width: "150px",
                marginLeft: 4,
                marginBottom: 2,
            }}
            onClick = {handleNewComment}
        >
            <AddCircleIcon/>
            Registrar
        </Button>
      </Paper>
    </Box>
  );
};

export default ExchangeDetails;
