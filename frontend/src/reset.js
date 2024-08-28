import React, { useContext, useRef, useState, useEffect } from 'react';
import AuthContext from './context/AuthProvider'; // Adjust path as needed
import axios from 'axios';

const PWD_RESET = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function Reset() {
    const { auth } = useContext(AuthContext);
    const { email } = auth;  // Get email from context
    const userRef = useRef(null);
    const errRef = useRef(null);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (userRef.current) {
            userRef.current.focus();
        }
    }, []);

    useEffect(() => {
        setValidPwd(PWD_RESET.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [pwd, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValidPwd = PWD_RESET.test(pwd);
        if (!isValidPwd) {
            setErrMsg("Invalid Entry");
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:7000/reset',
                { email, password: pwd },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            console.log('Password reset response:', JSON.stringify(response?.data));
            setSuccess(true);
            setPwd('');
            setMatchPwd('');
        } catch (err) {
            console.error('Reset error:', err);
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Invalid Request');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else if (err.response?.status === 404) {
                setErrMsg('User Not Found');
            } else {
                setErrMsg('Password Reset Failed');
            }
            if (errRef.current) {
                errRef.current.focus();
            }
        }
    };

    return (
        <>
            {success ? (
                <section>
                    <h1>Password Reset Successfully!</h1>
                    <p>
                        <a href="#">Home</a>
                    </p>
                </section>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter New Password"
                            className="form-control"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            ref={userRef}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirm_password">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm_password"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            className="form-control"
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            Must match the first password input field.
                        </p>
                    </div>
                    <div>
                        <button type="submit" disabled={!validPwd || !validMatch} className="btn btn-success w-100">
                            Reset Password
                        </button>
                    </div>
                </form>
            )}
        </>
    );
}

export default Reset;
