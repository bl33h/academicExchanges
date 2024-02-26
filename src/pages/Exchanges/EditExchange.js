import ExchangeForm from "./ExchangeForm";
import {useParams} from "react-router-dom";


const EditExchange = () => {
    const {id} = useParams();
    return (
        <ExchangeForm id={id}/>
    );
};

export default EditExchange;