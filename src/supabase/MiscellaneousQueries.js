import {supabase} from './client';

const getModalities = async () => {
    const {data, error} = await supabase
        .from('modalidades')
        .select('*')

    if (error) {
        throw error;
    } else {
        return data.map((modality) => {
            return {
                modality: modality.modalidad,
                id: modality.id,
            }
        });
    }
}

const getStates = async () => {
    const {data, error} = await supabase
        .from('estados')
        .select('*')

    if (error) {
        throw error;
    } else {
        return data.map((state) => {
            return {
                state: state.estado,
                id: state.id,
            }
        });
    }
}

export {
    getStates,
    getModalities,
}