import {supabase} from './client';

const transformCountriesList = (countriesList) => {
    const sortedData = countriesList.sort((a, b) => {
        return a.nombre.localeCompare(b.nombre)
    });

    return sortedData.map((country) => {
        return {
            id: country.id,
            name: country.nombre,
        }
    })
}

const getCountriesList = async () => {
    const {data, error} = await supabase
        .from('paises')
        .select(`
            id,
            nombre
        `)
    if (error) {
        throw error;
    } else {
        return transformCountriesList(data);
    }
}

export {
    getCountriesList
}