import axios from 'axios';

export default function axiosClient(domain) {

    // let url = import.meta.env.VITE_API_BASE_URL
    // let port = import.meta.env.VITE_BACKEND_PORT

    return axios.create({
       //cloud
        // baseURL: import.meta.env.VITE_API_BASE_URL + '/' + domain,
        //local
        baseURL: 'http://192.168.1.167:3001/' + domain,
    })
}
