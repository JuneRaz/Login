import React, { useRef, useState, useEffect } from 'react';
import useAuth from "../../hooks/useAuth"; // Adjust path as needed
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from '../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import RegistrationForm from '../Register/Signup'

const LOGIN_URL = '/auth';

function Login() {
    const { setAuth, setPersist } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [rememberMe, setRememberMe] = useState(false); 
    const from = location.state?.from?.pathname || "/home"; // Default redirect to "/home"

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const [firstTimeLogin, setFirstTimeLogin] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [email, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                LOGIN_URL,
                { email, password },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

            const { accessToken, roles, firstTimeLogin } = response?.data;

            setAuth({ user: email, roles: roles, accessToken });

            setFirstTimeLogin(firstTimeLogin);
            setEmail('');
            setPassword('');

            if (firstTimeLogin) {
                navigate('/reset', { state: {email}, replace: true });
            } else {
                navigate(from, { replace: true });
            }
            setPersist(rememberMe); 

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Invalid email or password');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    };

    return (
        <section className="container">
            <div className="login-container">
                <div className="circle circle-one"></div>
                <div className="form-container">
                    <img src="https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png" alt="illustration" className="illustration" />
                    <h1 className="opacity">LOGIN</h1>
                    <form onSubmit={handleSubmit}>
                        <p
                            ref={errRef}
                            className={errMsg ? 'alert alert-danger' : 'd-none'}
                            aria-live="assertive"
                        >
                            {errMsg}
                        </p>
                        <div className="mb-3">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                ref={userRef}
                                placeholder="Enter Email"
                                className="form-control"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter Password"
                                className="form-control"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            />
                        </div>
                        
                        <div className="remember-me-container">
                            <input 
                                type="checkbox" 
                                id="rememberMe" 
                                checked={rememberMe} 
                                onChange={() => setRememberMe(prev => !prev)} 
                            />
                            <label htmlFor="rememberMe">Remember Me</label>
                        </div>

                            <button className="btn btn-success w-100">Login</button>        
                        
                    </form>
                    <div className="register-forget opacity">
                        <a href="/signup">REGISTER</a>
                        <a href="">FORGOT PASSWORD</a>
                    </div>
                </div>
                <div className="circle circle-two"></div>
            </div>
            <div className="theme-btn-container"></div>
        </section>
    );
}

export default Login;
