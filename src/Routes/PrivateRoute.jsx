import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { useLocation } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
	const { user, loading } = useContext(AuthContext);
	const location = useLocation();
	console.log(loading);
	if (loading) {
		return <progress className="progress w-56"></progress>;
	}

	if (user?.email) {
		return children;
	}

	return <Navigate to="/login" state={location.pathname} replace />;
};

export default PrivateRoute;
