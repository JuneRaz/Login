import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'

function Login(){
    const [email,setEmail] = useState('')
    const [password,setpassword] = useState('')
    function handleSubmit(event){
        event.preventDefault();
        axios.post('http://localhost:7000/login', {email,password})
        .then(res=>console.log(res))
        .catch(err=>console.log(err));

    }
    return(
        <div className='d-flex justify-content-center align-items-center bg-primary'>
            <div className='p-3 bg-white w-25'>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email">Email</label>
                        <input type="email" placeholder='Enter Email' className='form-control'
                        onChange={e => setEmail(e.target.value)}></input>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password">Password</label>
                        <input type="password" placeholder='Enter Password' className='form-control'
                        onChange={e => setpassword(e.target.value)}></input>
                    </div>
                    <div>
                        <button className='btn btn-success'>Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;
