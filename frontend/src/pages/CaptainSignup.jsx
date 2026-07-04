import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCaptainContext } from '../context/CaptainContext';

const CaptainSignup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('IN');

  const [vehicleColor, setVehicleColor] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [vehicleType, setVehicleType] = useState('car');

  const { setCaptain } = useCaptainContext();

  const submitHandler = async (e) => {
    e.preventDefault();
    const newCaptainData = {
      fullname: { firstname: firstName, lastname: lastName },
      email: email,
      password: password,
      country: country,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: Number(vehicleCapacity),
        vehicleType: vehicleType
      }
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, newCaptainData);
      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem('token', data.token);
        navigate('/captain-home');
      }
    } catch (err) {
      console.error("[CAPTAIN_REGISTRATION_ERROR]", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to create account.");
    }
  };

  return (
    <div className="px-5 py-5 h-screen flex flex-col justify-between max-w-md mx-auto bg-white shadow-xl overflow-y-auto">
      <div>
        <img 
          className="w-16 mb-6" 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/960px-Uber_logo_2018.svg.png" 
          alt="Uber Driver Logo" 
        />
        <form onSubmit={submitHandler}>
          
          <h3 className="text-base font-medium mb-2 text-slate-900">Captain's Name</h3>
          <div className="flex gap-4 mb-4">
            <input required className="bg-[#f3f4f6] w-1/2 rounded-xl px-4 py-2 text-base outline-none border border-transparent focus:border-slate-300" type="text" placeholder="Firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input className="bg-[#f3f4f6] w-1/2 rounded-xl px-4 py-2 text-base outline-none border border-transparent focus:border-slate-300" type="text" placeholder="Lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <h3 className="text-base font-medium mb-2 text-slate-900">Captain's Email ID</h3>
          <input required className="bg-[#f3f4f6] mb-4 rounded-xl px-4 py-2 w-full text-base outline-none border border-transparent focus:border-slate-300" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />

          <h3 className="text-base font-medium mb-2 text-slate-900">Password</h3>
          <input required className="bg-[#f3f4f6] mb-4 rounded-xl px-4 py-2 w-full text-base outline-none border border-transparent focus:border-slate-300" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <h3 className="text-base font-medium mb-2 text-slate-900">Country</h3>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="bg-[#f3f4f6] mb-4 rounded-xl px-4 py-2 w-full text-base outline-none border border-transparent focus:border-slate-300 text-slate-800">
            <option value="IN">India</option>
            <option value="US">United States</option>
          </select>

          <h3 className="text-base font-medium mb-2 text-slate-900">Vehicle Details</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <input required className="bg-[#f3f4f6] rounded-xl px-4 py-2 text-sm outline-none border" type="text" placeholder="Vehicle Color" value={vehicleColor} onChange={(e) => setVehicleColor(e.target.value)} />
            <input required className="bg-[#f3f4f6] rounded-xl px-4 py-2 text-sm outline-none border" type="text" placeholder="License Plate" value={vehiclePlate} onChange={(e) => setVehiclePlate(e.target.value)} />
            <input required className="bg-[#f3f4f6] rounded-xl px-4 py-2 text-sm outline-none border" type="number" placeholder="Capacity" value={vehicleCapacity} onChange={(e) => setVehicleCapacity(e.target.value)} />
            <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className="bg-[#f3f4f6] rounded-xl px-4 py-2 text-sm outline-none border">
              <option value="car">Car</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="auto">Auto Rickshaw</option>
            </select>
          </div>

          <button className="bg-[#111] text-white font-semibold mb-3 rounded-xl px-4 py-3 w-full text-base active:scale-95 transition-transform">Create Captain Account</button>
        </form>
      </div>
      <p className="text-center text-sm font-medium text-slate-500">Already have an account? <Link to="/captain-login" className="text-blue-600 font-semibold hover:underline">Login here</Link></p>
    </div>
  );
};

export default CaptainSignup;