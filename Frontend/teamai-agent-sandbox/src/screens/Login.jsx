import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios'
import { UserContext } from '../context/user.context';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { setUser } = useContext(UserContext)

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log({ email, password });

        axios.post('/users/login', {
            email,
            password
        }).then((res) => {
            console.log(res.data);

            localStorage.setItem('token', res.data.token)
            setUser(res.data.user)
            
            navigate('/')
        }).catch((err) => {
            console.log(err.response.data);
        })
    }

    return (
        
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-2xl p-10 sm:p-12">
                
                <h1 className='text-white text-3xl font-bold mb-6 text-center'>
                    Login
                </h1>

                <form onSubmit={handleSubmit} className='space-y-5'>
                    <div>
                        
                        <label className='block text-sm text-gray-300 mb-2'>
                            Email
                        </label>
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className='w-full h-11 rounded-md bg-slate-700 text-white placeholder-gray-400 px-4 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            placeholder="Enter your email"
                        />

                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full h-11 rounded-md bg-slate-700/90 text-white placeholder-gray-400 px-4 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className='w-full h-11 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition'
                    >
                        Login
                    </button>

                </form>

                <p className="text-gray-400 text-sm mt-5">
                    Don&apso;t have an account? {' '}
                    <Link to="/register" className="text-blue-400 hover:text-blue-300">
                        Create one
                    </Link>
                </p>

            </div>
        </div>

    )
}

export default Login;