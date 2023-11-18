import { createContext, useEffect, useState } from 'react';
import {
	createUserWithEmailAndPassword,
	getAuth,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import app from '../firebase/firebase.config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	// const navigate = useNavigate();

	const createUser = (email, password) => {
		setLoading(true);
		return createUserWithEmailAndPassword(auth, email, password);
	};

	const signIn = (email, password) => {
		setLoading(true);
		return signInWithEmailAndPassword(auth, email, password);
	};

	const logOut = () => {
		// setLoading(true);
		return signOut(auth);
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, currentUser => {
			const userEmail = currentUser?.email || user?.email;
			const loggedUser = { email: userEmail };
			// console.log('current user', currentUser);

			// call jwt api method
			//if current user is exist then issue a token
			if (currentUser) {
				axios
					.post(
						'https://car-doctor-server-adityachowdhury2.vercel.app/jwt',
						loggedUser,
						{
							withCredentials: true,
						}
					)
					.then(response => {
						console.log(response.data);
						setUser(currentUser);
						setLoading(false);
					});
			}
			// or call the logOut api function
			else {
				axios
					.post(
						'https://car-doctor-server-adityachowdhury2.vercel.app/logout',
						loggedUser,
						{
							withCredentials: true,
						}
					)
					.then(response => {
						console.log(response.data);
						setLoading(false);
						setUser(null);
						// window.location.href = '/login';
					});
			}
		});
		return () => {
			return unsubscribe();
		};
	}, [user]);

	// useEffect(() => {
	// 	if (user === null) {
	// 		setLoading(false);
	// 	}
	// }, []);

	const authInfo = {
		user,
		loading,
		createUser,
		signIn,
		logOut,
	};

	return (
		<AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
	);
};

export default AuthProvider;
