  
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.15.12:3333',  //dica: sempre usar endereço com ipda sua maquina
});

export default api;