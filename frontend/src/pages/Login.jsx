import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { IoEyeOutline, IoEye } from "react-icons/io5";
import Logo from "../assets/logo.png";
import google from "../assets/google.png";
import { auth, provider } from "../../utils/Firebase";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import Loading from "../component/Loading";
import { toast } from "react-toastify";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);

  const navigate = useNavigate();

  // ---------------- HANDLE LOGIN ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log("Login response:", res.data);
      await getCurrentUser(); // Refresh user context
      toast.success("User Login Successful");
      navigate("/");

    } catch (error) {
      console.error("Login Error:", error?.response?.data || error.message);
      toast.error("User Login Failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- GOOGLE LOGIN ----------------
  const handleGoogleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;

      const { displayName: name, email } = user;

      const res = await axios.post(
        `${serverUrl}/api/auth/googlelogin`,
        { name, email },
        { withCredentials: true }
      );

      console.log("Google Login response:", res.data);
      await getCurrentUser();
      navigate("/");

    } catch (error) {
      console.error("Google Login Error:", error?.response?.data || error.message);
      toast.error("Google Login Failed");
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] text-white flex flex-col items-center">
      
      {/* HEADER LOGO */}
      <div
        className="w-full h-[80px] flex items-center px-[30px] gap-[10px] cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={Logo} alt="OneCart Logo" className="w-[40px]" />
        <h1 className="text-[22px] font-sans">OneCart</h1>
      </div>

      {/* PAGE TITLE */}
      <div className="w-full h-[100px] flex flex-col items-center justify-center gap-[10px]">
        <span className="text-[25px] font-semibold">Login Page</span>
        <span className="text-[16px]">Welcome to OneCart, place your order</span>
      </div>

      {/* LOGIN FORM */}
      <div className="max-w-[600px] w-[90%] h-[500px] bg-[#00000025] border border-[#96969635] rounded-lg shadow-lg flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]"
        >

          {/* GOOGLE LOGIN BUTTON */}
          <div
            className="w-full h-[50px] bg-[#42656cae] rounded-lg flex items-center justify-center gap-[10px] py-[10px] cursor-pointer"
            onClick={handleGoogleLogin}
          >
            <img src={google} alt="Google Logo" className="w-[20px]" />
            Login with Google
          </div>

          {/* OR DIVIDER */}
          <div className="w-full flex items-center justify-center gap-[10px]">
            <div className="w-[40%] h-[1px] bg-[#96969635]" />
            <span>OR</span>
            <div className="w-[40%] h-[1px] bg-[#96969635]" />
          </div>

          {/* EMAIL & PASSWORD FIELDS */}
          <div className="w-full flex flex-col items-center justify-center gap-[15px] relative">
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full h-[50px] border-2 border-[#96969635] rounded-lg px-[20px] bg-transparent placeholder-[#ffffffc7] font-semibold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              className="w-full h-[50px] border-2 border-[#96969635] rounded-lg px-[20px] bg-transparent placeholder-[#ffffffc7] font-semibold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* PASSWORD TOGGLE */}
            {showPassword ? (
              <IoEye
                className="absolute right-[5%] bottom-[57%] w-[20px] h-[20px] cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <IoEyeOutline
                className="absolute right-[5%] bottom-[57%] w-[20px] h-[20px] cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}

            {/* LOGIN BUTTON */}
            <button className="w-full h-[50px] bg-[#6060f5] rounded-lg flex items-center justify-center mt-[20px] text-[17px] font-semibold">
              {loading ? <Loading /> : "Login"}
            </button>

            {/* SIGNUP LINK */}
            <p className="flex gap-[10px] text-[14px]">
              Don't have an account?{" "}
              <span
                className="text-[#5555f6cf] font-semibold cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Create New Account
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
