import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://fe-tech-test-api-dev-416879028044.asia-southeast2.run.app/api/v1/',   
});

export default axiosInstance;
