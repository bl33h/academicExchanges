import {supabase} from './client';

const getFaculties = async () => {
    const {data, error} = await supabase
        .from('facultades')
        .select(`
            id,
            nombre,
            nombre_corto
        `)

    if (error) {
        throw new Error(`Error al obtener las facultades: ${error.message}`)
    } else {
        return data.map(({id, nombre, nombre_corto}) => ({
            id,
            name: nombre,
            short_name: nombre_corto,
        }));
    }
}

const getCareersByFaculty = async (facultyId) => {
    if (!facultyId) return;
    const {data, error} = await supabase
        .from('carreras')
        .select(`
            id,
            nombre
        `)
        .eq('id_facultad', facultyId)

    if (error) {
        throw error;
    } else {
        return data.map(({id, nombre}) => ({
            id,
            name: nombre,
        }));
    }
}

const getCareerById = async (id) => {
    const {data, error} = await supabase
        .from('carreras')
        .select(`
            id,
            nombre,
            facultades (
                id,
                nombre
        `)
        .eq('id', id)
        .single()

    if (error) {
        throw error;
    } else {
        return {
            career_id: data.id,
            career_name: data.nombre,
            faculty_id: data.facultades.id,
            faculty_name: data.facultades.nombre,
        };
    }
}

const updateStudent = async ({id, name, mail, career_id, gender}) => {
    const {error} = await supabase
        .from('estudiantes')
        .update({
            carnet: id,
            nombre: name,
            correo: mail,
            id_carrera: career_id,
            genero: gender
        })
        .eq('carnet', id)

    if (error) {
        throw error;
    }
}


export {
    updateStudent,
    getFaculties,
    getCareersByFaculty,
    getCareerById,
};