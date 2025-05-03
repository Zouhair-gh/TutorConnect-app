import React from 'react';
import { useNavigate } from 'react-router-dom';

const ParticipantDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Participant Dashboard</h1>
            <p style={styles.text}>Welcome! You are logged in as a Participant.</p>

            <div style={styles.buttonContainer}>
                <button style={styles.button} onClick={() => alert('Sample Action')}>
                    Do Something
                </button>
                <button style={styles.logoutButton} onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f0f2f5',
        height: '100vh',
    },
    heading: {
        fontSize: '32px',
        marginBottom: '20px',
    },
    text: {
        fontSize: '18px',
        marginBottom: '40px',
    },
    buttonContainer: {
        display: 'flex',
        gap: '15px',
        justifyContent: 'center',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    logoutButton: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#ff4d4f',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
    },
};

export default ParticipantDashboard;
