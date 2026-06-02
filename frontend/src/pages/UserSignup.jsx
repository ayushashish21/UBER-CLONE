import React from 'react'
import { Link } from "react-router-dom";

const UserSignup = () => {
    return (
        <div>
            <div className='p-7 h-screen flex flex-col justify-between'>
                <div>
                    <img className='w-16 mb-10' src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/960px-Uber_logo_2018.svg.png" alt="/" />

                    <form onSubmit={(e) => {
                        submitHandler(e)
                    }}>

                        <h3 className='text-lg font-medium  mb-2 '>What's your name</h3>
                        <div>
                            <input className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' required
                                type="text" placeholder='First Name' />
                            <input className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' required
                                type="text" placeholder='Last Name' />
                        </div>

                        <h3 className='text-lg font-medium  mb-2 '>What's your email</h3>
                        <input className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base' required
                            type="email" placeholder='email@example.com' />

                        <h3 className='text-lg font-medium  mb-2 '>Enter Password</h3>
                        <input className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
                            required
                            type="password" placeholder='password' />

                        <button className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2  w-full text-lg placeholder:text-base'>Login</button>

                        <p className='text-center'>New here? <Link to='/signup' className='text-blue-600'>Create new Account</Link>
                        </p>

                    </form>
                </div>
                <div>
                    <Link to='/captain-login' className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded px-4 py-2  w-full text-lg placeholder:text-base'>Sign in as Captain</Link>
                </div>
            </div>
        </div>
    )
}

export default UserSignup
