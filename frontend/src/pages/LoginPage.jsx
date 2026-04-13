import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const usertoken = localStorage.getItem("token");
    
    if (usertoken) {
      navigate("/");
    }
  }, [navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Login failed");
    }
  };

  return (
    <div className="bg-background text-font">
      <div className="login-page flex flex-col items-center justify-center min-h-screen gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">TASK MANAGER</h1>
        </div>
        <div>
          <h2 className="font-body text-xl font-medium mb-3">Login</h2>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-3 border border-gray-300 rounded-3xl px-6 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
              />
            </div>
            <div className="flex flex-row items-center relative mb-3">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-l-3xl px-6 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
              />
              <div className="border border-gray-300 rounded-r-3xl px-1 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-12 align-middle justify-center flex">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="items-center align-middle"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-primary text-font py-2 px-4 rounded-3xl hover:bg-blue-400 active:bg-blue-500 w-full mb-3"
              >
                Login
              </button>
              <button
                className="bg-primary text-font py-2 px-4 rounded-3xl hover:bg-blue-400 active:bg-blue-500 w-full"
              >
                <a href="/register">Create an Account</a>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
