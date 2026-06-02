import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const CaptainSignup = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userData, setUserData] = useState({});

    const submitHandler = (e) => {
        e.preventDefault();
        setUserData({
            username: {
                firstName: firstName,
                lastName: lastName,
            },
            email: email,
            password: password,
        });

        
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
    };

    return (
        <div>
            <div className="px-5 py-5 h-screen flex flex-col justify-between">
                <div>
                    <img
                        className="w-16 mb-10"
                        src="https://www.svgrepo.com/show/505031/uber-driver.svg"
                        alt="Uber"
                    />

                    <form onSubmit={(e) => submitHandler(e)}>
                        <h3 className="text-lg font-medium mb-2">What's your name</h3>
                        <div className="flex gap-4 mb-6">
                            <input
                                className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base"
                                required
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <input
                                className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base"
                                required
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>

                        <h3 className="text-lg font-medium mb-2">What's your email</h3>
                        <input
                            className="bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
                            required
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <h3 className="text-lg font-medium mb-2">Enter Password</h3>
                        <input
                            className="bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
                            required
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button className="bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-base">
                            Sign Up
                        </button>

                        <p className="text-center">
                            Already have an account?{' '}
                            <Link to="/captain-login" className="text-blue-600">
                                Login here
                            </Link>
                        </p>
                    </form>
                </div>

                <div>
                    <p className="text-[10px] leading-tight">
                        This site is protected by reCAPTCHA and the <span className="underline">Google Privacy Policy</span> and <span className="underline">Terms of Service</span> apply.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CaptainSignup
