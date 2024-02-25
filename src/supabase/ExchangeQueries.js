import {supabase} from './client';

const getStudentsInExchanges = async () => {
    const {data, error} = await supabase
        .from('intercambios')
        .select(`
            id,
            anio,
            semestre,
            estudiantes(
                carnet,
                nombre
            ),
            modalidades(
                id,
                modalidad
            ),
            ciclo,
            universidades(
                id,
                nombre
            ),
            estados(
                id,
                estado
            ),
            fecha_viaje,
            cursos_uvg,
            cursos_intercambio,
            comentarios
        `);

    if (error) {
        throw error;
    } else {
        return data.map((student) => {
            return {
                id: student.id,
                year: student.anio,
                semester: student.semestre,
                student: student.estudiantes?.nombre,
                student_id: student.estudiantes?.carnet ?? '',
                modality: student.modalidades?.modalidad ?? '',
                modality_id: student.modalidades?.id ?? '',
                cycle: student.ciclo ?? '',
                university: student.universidades?.nombre ?? '',
                university_id: student.universidades?.id ?? '',
                state: student.estados?.estado ?? '',
                state_id: student.estados?.id ?? '',
                date: student.fecha_viaje ?? '',
                coursesUvg: student.cursos_uvg ?? '',
                coursesExchange: student.cursos_intercambio ?? '',
                comments: student.comentarios ?? '',
            }
        });
    }
};


const insertStudentInExchange = async ({
                                           year,
                                           semester,
                                           studentId,
                                           universityId,
                                           modalityId = null,
                                           stateId = null,
                                           cycle = null,
                                           date = null,
                                           coursesUvg = null,
                                           coursesExchange = null,
                                           comments = null
                                       }) => {
    const {error} = await supabase
        .from('intercambios')
        .insert([
            {
                anio: year,
                semestre: semester,
                id_estudiante: studentId,
                id_universidad: universityId,
                id_modalidad: modalityId,
                id_estado: stateId,
                ciclo: cycle,
                fecha_viaje: date,
                cursos_uvg: coursesUvg,
                cursos_intercambio: coursesExchange,
                comentarios: comments,
            }
        ]);

    if (error) {
        throw error;
    }
}

const getExchangeById = async (id) => {
    const {data, error} = await supabase
        .from('intercambios')
        .select(`
            id,
            anio,
            semestre,
            estudiantes(
                carnet,
                nombre
            ),
            modalidades(
                id,
                modalidad
            ),
            ciclo,
            universidades(
                id,
                nombre
            ),
            estados(
                id,
                estado
            ),
            fecha_viaje,
            cursos_uvg,
            cursos_intercambio,
            comentarios
        `)
        .eq('id', id);

    if (error) {
        throw error;
    } else {
        const student = data[0];

        return {
            id: student.id,
            year: student.anio,
            semester: student.semestre,
            student: student.estudiantes?.nombre,
            student_id: student.estudiantes?.carnet ?? '',
            modality: student.modalidades?.modalidad ?? '',
            modality_id: student.modalidades?.id ?? '',
            cycle: student.ciclo ?? '',
            university: student.universidades?.nombre ?? '',
            university_id: student.universidades?.id ?? '',
            state: student.estados?.estado ?? '',
            state_id: student.estados?.id ?? '',
            date: student.fecha_viaje ?? '',
            coursesUvg: student.cursos_uvg ?? '',
            coursesExchange: student.cursos_intercambio ?? '',
            comments: student.comentarios ?? '',
        }
    }
}

const updateExchange = async ({
                                  id,
                                  year,
                                  semester,
                                  studentId,
                                  universityId,
                                  modalityId = null,
                                  stateId = null,
                                  cycle = null,
                                  date = null,
                                  coursesUvg = null,
                                  coursesExchange = null,
                                  comments = null
                              }) => {
    const {error} = await supabase
        .from('intercambios')
        .update([
            {
                anio: year,
                semestre: semester,
                id_estudiante: studentId,
                id_universidad: universityId,
                id_modalidad: modalityId,
                id_estado: stateId,
                ciclo: cycle,
                fecha_viaje: date,
                cursos_uvg: coursesUvg,
                cursos_intercambio: coursesExchange,
                comentarios: comments,
            }
        ])
        .eq('id', id);

    if (error) {
        throw error;
    }
}

const deleteExchange = async (id) => {
    const {error} = await supabase
        .from('intercambios')
        .delete()
        .eq('id', id);

    if (error) {
        throw error;
    }
}

export {
    updateExchange,
    getExchangeById,
    insertStudentInExchange,
    getStudentsInExchanges,
    deleteExchange
}