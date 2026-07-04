import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('IN'); 

  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      fullname: { firstname: firstName, lastname: lastName },
      email: email,
      password: password,
      country: country
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);
      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        navigate('/home');
      }
    } catch (err) {
      console.error("Registration caught exception pipeline validation error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error finalizing dynamic user profile registration");
    }
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between bg-white max-w-md mx-auto shadow-lg rounded-none">
      <div>
        {/* FIXED: Official reliable Uber Logo */}
        <img 
          className="w-16 mb-10" 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/960px-Uber_logo_2018.svg.png" 
          alt="Uber Logo" 
        />
        <form onSubmit={submitHandler}>
          <h3 className="text-base font-medium mb-2 text-slate-900">What's your name?</h3>
          <div className="flex gap-4 mb-6">
            <input required className="bg-[#f3f4f6] w-1/2 rounded-xl px-4 py-2 text-base placeholder:text-sm placeholder:text-slate-400 outline-none border border-transparent focus:border-slate-300" type="text" placeholder="Firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input className="bg-[#f3f4f6] w-1/2 rounded-xl px-4 py-2 text-base placeholder:text-sm placeholder:text-slate-400 outline-none border border-transparent focus:border-slate-300" type="text" placeholder="Lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <h3 className="text-base font-medium mb-2 text-slate-900">What's your email?</h3>
          <input required className="bg-[#f3f4f6] mb-6 rounded-xl px-4 py-2 w-full text-base placeholder:text-sm placeholder:text-slate-400 outline-none border border-transparent focus:border-slate-300" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />

          <h3 className="text-base font-medium mb-2 text-slate-900">Enter Password</h3>
          <input required className="bg-[#f3f4f6] mb-6 rounded-xl px-4 py-2 w-full text-base placeholder:text-sm placeholder:text-slate-400 outline-none border border-transparent focus:border-slate-300" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <h3 className="text-base font-medium mb-2 text-slate-900">Operating Regional Domain Boundary</h3>
          <select 
            value={country} 
            onChange={(e) => setCountry(e.target.value)}
            className="bg-[#f3f4f6] mb-6 rounded-xl px-4 py-2 w-full text-base outline-none border border-transparent focus:border-slate-300 text-slate-800"
          >
            <option value="IN">India (Suggestions filter targeted within IN region)</option>
            <option value="US">United States (Suggestions filter targeted within US region)</option>
          </select>

          <button className="bg-[#111] text-white font-semibold mb-3 rounded-xl px-4 py-3 w-full text-base active:scale-95 transition-transform">Create Account</button>
        </form>
        <p className="text-center text-sm font-medium text-slate-500">Already possess a profile match? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in profile</Link></p>
      </div>
    </div>
  );
};

export default UserSignup;