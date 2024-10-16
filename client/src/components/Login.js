import React from 'react';
import LoginStudent from './LoginStudent';
import LoginTeacher from './LoginTeacher';

function Login() {
    return (
        <><h1>Login</h1>
            <dir className="login-student">
                <LoginStudent />
            </dir>
            <dir className="login-teacher">
                <LoginTeacher />
            </dir>        
        </>
    );
}

export default Login;