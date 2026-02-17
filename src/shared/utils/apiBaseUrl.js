import axios from 'axios';

export default function axiosClient(domain) {

    // let url = import.meta.env.VITE_API_BASE_URL
    // let port = import.meta.env.VITE_BACKEND_PORT

    return axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL + '/' + domain,
        // baseURL: `${url}:${port}/${domain}`, 
        // baseURL: 'http://192.168.1.167:3001/' + domain,
        // baseURL: `${import.meta.env.VITE_API_BASE_URL}/${domain}`,
    })
}
