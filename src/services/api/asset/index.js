import { fetchCall } from '../../endpoints';
import config from '../../../constants/config.json';

// Uploading image
const uploadFile = (id, data)=> 
    fetchCall(
        `/asset/upload/${id}`,
        config.requestMethod.POST,
        data,
        true,
        {},
        true
    );

// getting image from server
const downloadFile = (data)=> 
    fetchCall(
        `/asset/download/${data}`,
        config.requestMethod.GET,
        {},
        true
    );

export {
    uploadFile,
    downloadFile
}