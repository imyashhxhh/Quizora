import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Redux store se token nikal rahe hain
    const { token } = useSelector((state) => state.auth);

    // Agar token hai (user logged in hai), toh us page ko dikhao jo iske andar hai
    if (token !== null) {
        return children;
    } 
    // Agar token nahi hai, toh user ko login page par bhej do
    else {
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;

