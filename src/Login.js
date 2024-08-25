import React, { useContext, useRef, useState, useEffect } from 'react';
import AuthContext from './context/AuthProvider'; // Adjust path as needed
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Reset from './reset'

function Login() {
    const { setAuth } = useContext(AuthContext);
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

            // Update context with email and other auth data
            const { accessToken, roles, firstTimeLogin } = response?.data;
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
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    };

    return (
        <>
            {success ? (
                firstTimeLogin ? (
                    <Reset email={email} /> // Render Reset component
                ) : (
                    <section className="d-flex justify-content-center align-items-center vh-100 bg-light">
                    <div className="text-center p-4 bg-white rounded shadow-sm">
                        <h1 className="mb-4 text-success">Logged In Successfully!</h1>
                        <h2 className="mb-3">Welcome Home</h2>
                        <p className="lead">You are now logged in and ready to explore your dashboard.</p>
                        <a href="/dashboard" className="btn btn-primary">Go to Dashboard</a>
                    </div>
                </section>
                
                )
            ) : (
                <section>
                    <div className="d-flex justify-content-center align-items-center bg-primary" style={{ height: '100vh' }}>
                        <div className="p-4 bg-white w-25 rounded">
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
                    </div>
                </section>
            )}
        </>
    );
}

export default Login;
