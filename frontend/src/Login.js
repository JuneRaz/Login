import React, { useContext, useRef, useState, useEffect } from 'react';
import useAuth from "./hooks/useAuth"// Adjust path as needed
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Reset from './reset'
import {Link, useNavigate, useLocation} from 'react-router-dom';


function Login() {
    const { setAuth } = useAuth();
    const navigate =useNavigate();
    const location = useLocation();
    const from = location.state?.from.pathname || "/";



    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
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
                'http://localhost:7000/login',
                { email, password },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            const { accessToken, roles, firstTimeLogin } = response?.data;
            console.log('Roles:', roles.join(', ')); 
            console.log('Email:', email);
            console.log('Access Token:', accessToken);
            console.log('First Time Login?:',firstTimeLogin);
            setAuth({ email, roles, accessToken });

            setFirstTimeLogin(firstTimeLogin);
            setEmail('');
            setPassword('');
            setSuccess(true);
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
        <div className="login-body">
            {success ? (
                firstTimeLogin ? (
                    <Reset email={email} />
                ) : (
                    <section className="login-container1">
                        <div className="login-form1">
                            <h1 className="text-success">Logged In Successfully!</h1>
                            <h2>Welcome Home {email}</h2>
                            <p>You are now logged in and ready to explore your dashboard.</p>
                            <a href="/" className="btn btn-primary">Go to Dashboard</a>
                        </div>
                    </section>
                )
            ) : (
                <section className="login-container">
                    <div className="login-form">
                        <p
                            ref={errRef}
                            className={errMsg ? 'alert alert-danger' : 'd-none'}
                            aria-live="assertive"
                        >
                            {errMsg}
                        </p>
                        <form onSubmit={handleSubmit}>
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
                                />
                            </div>
                            <div>
                                <button className="btn btn-success w-100">Login</button>
                            </div>
                        </form>
                    </div>
                </section>
            )}
        </div>
    );
}

export default Login;
