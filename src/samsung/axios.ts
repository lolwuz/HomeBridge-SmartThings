import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.smartthings.com/v1',
  headers: {'Authorization': 'Bearer 8a22c6f8-68e8-4ef9-88c7-1e3b87580d33'},
});

export default instance;