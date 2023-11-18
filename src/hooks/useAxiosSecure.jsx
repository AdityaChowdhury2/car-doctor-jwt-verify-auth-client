import axios from 'axios';

import useAuth from './useAuth';
import { useEffect } from 'react';

const axiosSecure = axios.create({
	baseURL: `https://car-doctor-server-adityachowdhury2.vercel.app`,
	// baseURL: `https://car-doctor-server-adityachowdhury2.vercel.app`,
	withCredentials: true,
});
const useAxiosSecure = () => {
	const { logOut } = useAuth();

	useEffect(() => {
		axiosSecure.interceptors.response.use(
			res => res,
			err => {
				console.log('error tracked in interceptor', err.response);
				if (err.response.status === 401 || err.response.status === 403) {
					console.log('logout the user');
					logOut()
						.then(() => {})
						.catch(err => console.log(err));
				}
			}
		);
	}, []);
	return axiosSecure;
};

export default useAxiosSecure;
