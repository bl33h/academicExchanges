import StudentForm from './StudentForm';
import {useParams} from "react-router-dom";

const EditStudent = () => {
    const {id} = useParams();

    return (
        <StudentForm id={id}/>
    )
}

export default EditStudent;