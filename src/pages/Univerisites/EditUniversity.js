import UniversityForm from "./UniversitiesForm";
import {useParams} from "react-router-dom";


const EditUniversity = () => {
    const {id} = useParams();
    return (
        <UniversityForm id={id}/>
    );
};

export default EditUniversity;