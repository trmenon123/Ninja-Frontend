import { fetchCall } from '../../endpoints';
import config from '../../../constants/config.json';

const createNewNote = (data)=> 
    fetchCall(
        "/user/createNewNote",
        config.requestMethod.POST,
        data,
        true
    );

const getAllNotes = (data)=> 
    fetchCall(
        "/user/getAllNotes",
        config.requestMethod.POST,
        data,
        true
    );

const updateNote = (data)=> 
    fetchCall(
        "/user/updateNote",
        config.requestMethod.PUT,
        data,
        true
    );

export {
    createNewNote,
    getAllNotes,
    updateNote
};