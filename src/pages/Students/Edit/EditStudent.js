import StudentsForm from "../../../components/Forms/StudentsForm";
import {useParams} from "react-router-dom";

const EditStudent = () => {
    const {id} = useParams();

    return (
        <StudentsForm id={id}/>
    )
}

export default EditStudent;