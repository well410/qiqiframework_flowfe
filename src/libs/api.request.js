import HttpRequest from '@/libs/axios';
import axiosSdk from '@/libs/axios';


const baseUrl = '/api';
const baseUrl2 = '/';

export const axios = new HttpRequest(baseUrl);
export const axios2 = new HttpRequest(baseUrl2);

export default axios
