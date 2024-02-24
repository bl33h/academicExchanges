import {supabase} from './client';

// Transforms the data according to universities table
const transformUniversities = (data) => {
    const filteredData = data.filter((obj) => 'id' in obj);

    return filteredData.map(({id, nombre, nombre_corto, paises}) => ({
        id,
        name: nombre,
        short_name: nombre_corto,
        country: paises.nombre,
    }));

};

const transformUniversity = (data) => {
    return data.map(({id, nombre, nombre_corto, paises}) => ({
        id,
        name: nombre,
        short_name: nombre_corto,
        country: paises.nombre,
        country_id: paises.id,
        continent: paises.continentes.nombre,
    }));
}

const getUniversities = async () => {
    const {data, error} = await supabase
        .from('universidades')
        .select(`
            id,
            nombre,
            nombre_corto,
            paises(
                nombre
            )
        `)

    if (error) {
        throw error;
    } else {
        return transformUniversities(data);
    }
}

const getUniversityById = async (id) => {
    const {data, error} = await supabase
        .from('universidades')
        .select(`
            id,
            nombre,
            nombre_corto,
            paises(
                id,
                nombre,
                continentes(
                    nombre
                )
            )
        `)
        .eq('id', id)
    if (error) {
        throw error;
    } else {
        if (data.length === 0) {
            throw new Error(`No university with id ${id}`);
        }
        return transformUniversity(data)[0];
    }
}

const updateUniversity = async ({id, name, short_name, country_id}) => {
    const {error} = await supabase
        .from('universidades')
        .update({
            nombre: name,
            nombre_corto: short_name,
            id_pais: country_id,
        })
        .eq('id', id)

    if (error) {
        throw error;
    }
}

const insertUniversity = async ({name, short_name, country_id}) => {
    const {error} = await supabase
        .from('universidades')
        .insert({
            nombre: name,
            nombre_corto: short_name,
            id_pais: country_id,
        })

    if (error) {
        throw new Error(`Error inserting university: ${error.message}`);
    }
}

const doesUniversityExist = async (name) => {
    const {data, error} = await supabase
        .from('universidades')
        .select()
        .ilike('nombre', name)

    if (error) {
        throw error;
    } else {
        return data.length > 0;
    }
}

const deleteUniversity = async (id) => {
    const {error} = await supabase
        .from('universidades')
        .delete()
        .eq('id', id)

    if (error) {
        throw error;
    }
}

export {
    getUniversities,
    getUniversityById,
    updateUniversity,
    insertUniversity,
    doesUniversityExist,
    deleteUniversity
};