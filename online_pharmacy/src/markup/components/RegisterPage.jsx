import {  Link } from "react-router-dom";
import { Pill, User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from 'sonner';
import axios from "axios";
//first_name, last_name, email, password, phone, role, license_number 
export default function RegisterPage() {
  const url="http://localhost:4000";
   const [First_name,setFirst_name]=useState('')
  const [Last_name,setLastName]=useState('')
  const [Email,setEmail]=useState("")
  const [Phone_numeber,setPhone]=useState("")
  const [Password,setPassword]=useState("")
  const [ConfirmPassword,setConfirmPassword]=useState("")
  const [agreeTerms, setAgreeTerms] = useState(false);
  //const [loading,setLoading]=useState(false)
  const validateForm = () => {
    if (!First_name || !Last_name) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!Email) {
      toast.error('Please enter your email');
      return false;
    }
    if (!Phone_numeber) {
      toast.error('Please enter a phone_number');
      return false;}
    if (!Password) {
      toast.error('Please enter a password');
      return false;
    }
    if (Password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (Password !== ConfirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (!agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return false;
    }
    return true;
  };
  const onSubmitHandler=async (e)=>{
           e.preventDefault();
          // setLoading(true)
           if (!validateForm()) return;
           try {
            //first_name, last_name, email, password, phone, role, license_number 
            const formData= new FormData();
            formData.append("first_name",First_name);
            formData.append("last_name",Last_name);
            formData.append('email',Email);
            formData.append('role ',"customer");
            formData.append('password',Password);
            formData.append('phone',Phone_numeber);
           // console.log(formData);
            const response=await axios.post(`${url}/register`,formData,{
       headers: {
           'Content-Type': 'application/json'
       }
   } );
            if (response.data.success) {
              toast.success("register")
             
            }else{
              
              toast.error('Something went wrong')
            
            }

        
           } catch (error) {
            toast.error('Error occur')
            console.log(error)
           }
           //setLoading(false);
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">
              PharmaCare
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Create an account
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Enter your information to get started
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={onSubmitHandler}>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                  onChange={(e) => setFirst_name(e.target.value)} value={First_name} 
                  
                    type="text"
                    placeholder="John"
                    className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                 onChange={(e) => setLastName(e.target.value)} value={Last_name} 
                  type="text"
                  placeholder="Doe"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                onChange={(e) => setEmail(e.target.value)} value={Email} 
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                onChange={(e) => setPhone(e.target.value)} value={Phone_numeber} 
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                onChange={(e) => setPassword(e.target.value)} value={Password} 
                  type="password"
                  placeholder="Create a password"
                  className="w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
              onChange={(e) => setConfirmPassword(e.target.value)} value={ConfirmPassword} 
                type="ConfirmPassword"
                placeholder="Confirm your password"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1 form-checkbox" checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)} />
              <p className="text-gray-600 leading-tight">
                I agree to the{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Create Account
            </button>

          </form>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}