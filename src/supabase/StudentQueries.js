import {supabase} from './client';

const insertStudent = async ({id, name, mail, career_id, gender, campus_id}) => {
    const {error} = await supabase
        .from('estudiantes')
        .insert([
            {
                carnet: id,
                nombre: name,
                correo: mail,
                id_carrera: career_id,
                id_genero: gender,
                id_campus: campus_id
            }
        ])

    if (error) {
        throw new Error(`Error inserting student with id ${id}: ${error.message}`);
    }
}

const doesStudentExist = async (id) => {
    const {data, error} = await supabase
        .from('estudiantes')
        .select()
        .eq('carnet', id)
    if (error) {
        throw new Error(`Error checking if student with id ${id} exists: ${error.message}`);
    } else {
        return data.length > 0;
    }
}

const getStudentById = async (id) => {
    const intRegex = /^\d+$/;
    if (!intRegex.test(id)) {
        throw new Error(`'${id}' no es un carné válido`);
    }
    const {data, error} = await supabase
        .from('estudiantes')
        .select(`
            carnet,
            nombre,
            correo,
            generos(
                id,
                genero
            ),
            carreras(
                id,
                nombre,
                facultades(
                    id,
                    nombre_corto
                 )
            ),
            campus(
                id,
                nombre
            )
        `)
        .eq('carnet', id)
        .single()

    if (error) {
        throw new Error(`Error getting student with id ${id}: ${error.message}`);
    } else {
        const transformedData = {
            id: data.carnet,
            name: data.nombre,
            mail: data.correo,
            gender_id: data.generos.id,
            gender: data.generos.genero,
            career: data.carreras.nombre,
            career_id: data.carreras.id,
            faculty: data.carreras.facultades.nombre_corto,
            faculty_id: data.carreras.facultades.id,
            campus: data.campus.nombre,
            campus_id: data.campus.id,
        }
        if (transformedData.length === 0) {
            throw new Error(`El estudiante con el carné '${id}' no existe`);
        } else {
            return transformedData;
        }
    }
}

const getStudents = async () => {
    const {data, error} = await supabase
        .from('estudiantes')
        .select(`
            carnet,
            nombre,
            correo,
            generos(
                genero
            ),
            carreras(
                nombre,
                facultades(
                    nombre_corto
                 )
            ),
            campus(
                nombre
            )
        `)

    if (error) {
        throw new Error(`Error getting students: ${error.message}`);
    } else {
        return data.map(({carnet, nombre, correo, generos, carreras, campus}) => ({
            id: carnet,
            name: nombre,
            mail: correo,
            gender: generos.genero,
            career: carreras.nombre,
            faculty: carreras.facultades.nombre_corto,
            campus: campus.nombre,
        }));
    }
}

const updateStudent = async ({id, name, mail, career_id, gender_id, campus_id}) => {
    const {error} = await supabase
        .from('estudiantes')
        .update({
            carnet: id,
            nombre: name,
            correo: mail,
            id_carrera: career_id,
            id_genero: gender_id,
            id_campus: campus_id,
        })
        .eq('carnet', id)

    if (error) {
        throw new Error(`Error updating student with id ${id}: ${error.message}`);
    }
}

const getGenders = async () => {
    const {data, error} = await supabase
        .from('generos')
        .select('id, genero')

    if (error) {
        throw new Error('Error fetching genders')
    }

    return data;
}

const getCampuses = async () => {
    const {data, error} = await supabase
        .from('campus')
        .select('id, nombre')

    if (error) {
        throw new Error('Error fetching campuses')
    }

    return data;
}

export {
    updateStudent,
    getStudents,
    getStudentById,
    doesStudentExist,
    insertStudent,
    getGenders,
    getCampuses,
};