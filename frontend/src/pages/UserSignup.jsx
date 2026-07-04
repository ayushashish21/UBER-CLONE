import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

// Global Country List for Searchable Dropdown
const countries = [
  { code: 'AR', name: 'Argentina' }, { code: 'AU', name: 'Australia' },
  { code: 'BR', name: 'Brazil' }, { code: 'CA', name: 'Canada' },
  { code: 'CN', name: 'China' }, { code: 'CO', name: 'Colombia' },
  { code: 'EG', name: 'Egypt' }, { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' }, { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' }, { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' }, { code: 'KE', name: 'Kenya' },
  { code: 'MX', name: 'Mexico' }, { code: 'NG', name: 'Nigeria' },
  { code: 'PK', name: 'Pakistan' }, { code: 'PH', name: 'Philippines' },
  { code: 'RU', name: 'Russia' }, { code: 'ZA', name: 'South Africa' },
  { code: 'KR', name: 'South Korea' }, { code: 'ES', name: 'Spain' },
  { code: 'SE', name: 'Sweden' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' }, { code: 'VN', name: 'Vietnam' }
];

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // Custom Searchable Dropdown State
  const [countryCode, setCountryCode] = useState(''); 
  const [searchCountry, setSearchCountry] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext);

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchCountry.toLowerCase())
  );

  const handleCountrySelect = (code, name) => {
    setCountryCode(code);
    setSearchCountry(name);
    setShowDropdown(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!countryCode) {
      alert("Please select a valid country from the dropdown list.");
      return;
    }

    const newUser = {
      fullname: { firstname: firstName, lastname: lastName },
      email: email,
      password: password,
      country: countryCode
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
      console.error("Registration validation error:", err.response?.data || err.message);
      alert(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Failed to create account.");
    }
  };

  return (
    <div className="px-5 py-5 h-screen flex flex-col justify-between max-w-md mx-auto bg-white shadow-xl overflow-y-auto">
      <div>
        <img 
          className="w-16 mb-6" 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/960px-Uber_logo_2018.svg.png" 
          alt="Uber Logo" 
        />
        <form onSubmit={submitHandler}>
          <h3 className="text-base font-medium mb-2 text-slate-900">Name</h3>
          <div className="flex gap-4 mb-4">
            <input 
              required 
              className="bg-[#f3f4f6] w-1/2 rounded-xl px-4 py-2 text-base placeholder:text-sm placeholder:text-slate-400 outline-none border border-transparent focus:border-slate-300" 
              type="text" 
              placeholder="First name" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
            />
            <input 
              className="bg-[#f3f4f6] w-1/2 rounded-xl px-4 py-2 text-base placeholder:text-sm placeholder:text-slate-400 outline-none border border-transparent focus:border-slate-300" 
              type="text" 
              placeholder="Last name" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
            />
          </div>

          <h3 className="text-base font-medium mb-2 text-slate-900">Email Address</h3>
          <input 
            required 
            className="bg-[#f3f4f6] mb-4 rounded-xl px-4 py-2 w-full text-base placeholder:text-sm placeholder:text-slate-400 outline-none border border-transparent focus:border-slate-300" 
            type="email" 
            placeholder="email@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />

          <h3 className="text-base font-medium mb-2 text-slate-900">Password</h3>
          <input 
            required 
            className="bg-[#f3f4f6] mb-4 rounded-xl px-4 py-2 w-full text-base placeholder:text-sm placeholder:text-slate-400 outline-none border border-transparent focus:border-slate-300" 
            type="password" 
            placeholder="Create a password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />

          <h3 className="text-base font-medium mb-2 text-slate-900">Country</h3>
          <div className="relative mb-6">
            <input
              required
              className="bg-[#f3f4f6] rounded-xl px-4 py-2 w-full text-base placeholder:text-sm placeholder:text-slate-400 outline-none border border-transparent focus:border-slate-300 cursor-text"
              type="text"
              placeholder="Search for your country..."
              value={searchCountry}
              onChange={(e) => {
                setSearchCountry(e.target.value);
                setCountryCode(''); 
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
            
            {showDropdown && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] max-h-48 overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((c) => (
                    <li
                      key={c.code}
                      className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm text-slate-800 transition-colors"
                      onClick={() => handleCountrySelect(c.code, c.name)}
                    >
                      {c.name}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-sm text-slate-500 text-center">No countries found</li>
                )}
              </ul>
            )}
          </div>

          <button className="bg-[#111] text-white font-semibold mb-3 rounded-xl px-4 py-3 w-full text-base active:scale-95 transition-transform shadow-md">
            Create Account
          </button>
        </form>
      </div>
      <p className="text-center text-sm font-medium text-slate-500 mt-4">
        Already have an account? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Log in</Link>
      </p>
    </div>
  );
};

export default UserSignup;