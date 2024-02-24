import UniversityForm from "../../../components/Forms/UniversityForm";
import {useParams} from "react-router-dom";


const EditUniversity = () => {
    const {id} = useParams();
    return (
        <UniversityForm id={id}/>
    );
};

export default EditUniversity;
