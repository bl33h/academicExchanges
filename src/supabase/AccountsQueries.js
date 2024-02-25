import {supabase} from './client';

const isWhitelisted = async (email) => {
    const {data, error} = await supabase
        .from('WhiteList')
        .select('email')
        .eq('email', email)

    if (error) {
        throw error;
    } else {
        return data.length > 0;
    }
}

export {isWhitelisted};