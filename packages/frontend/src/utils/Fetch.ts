import axios from 'axios';

// const BASE_URL = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:4000'

const BASE_URL = 'https://cpe231.riflowth.com/api';

const fetch = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default fetch;
