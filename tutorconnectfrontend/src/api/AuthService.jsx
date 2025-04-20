import axiosClient from './axiosClient';

const AuthService = {
    login: async (email, password) => {
        try {
            const response = await axiosClient.post('/login', { email, password });
            if (response.data) {
                localStorage.setItem('authToken', response.data);
                return response.data;
            }
            return null;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout: async () => {
        try {

            await axiosClient.post('/logout');

            localStorage.removeItem('authToken');

            return true;
        } catch (error) {
            console.error('Logout error:', error);

            localStorage.removeItem('authToken');

            return false;
        }
    },

    verifyToken: async () => {
        try {
            const response = await axiosClient.get('/verifyToken');
            return response.data;
        } catch (error) {
            console.error('Token verification error:', error);
            return null;
        }
    },

    isAuthenticated: () => {
        return localStorage.getItem('authToken') !== null;
    }
};

export default AuthService;