import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState(null);
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
      if (!captcha) {
        alert("Please verify captcha");
        return;
      }
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      console.log(error);
      document.querySelector(".loginFailtextbox").textContent = "Invalid email or password, try again.";
    }
  };

  return (
    <div className="bg-background text-font">
      <div className="login-page flex flex-col items-center justify-center min-h-screen gap-3">
        <div>
          <h1 className="font-heading text-4xl font-semibold">TASK MANAGER</h1>
        </div>
        <div>
          <h2 className="font-body text-2xl font-medium mb-3">Login</h2>
        </div>
        <div>
          <p className="loginFailtextbox"></p>
        </div>
        <div className="w-full max-w-sm">
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-3 border px-6 py-2 focus:outline-none focus:ring-2 transition border-white/10 rounded-xl p-3 bg-background/60 backdrop-blur-md w-full text-lg h-12"
              />
            </div>
            <div className="flex flex-row items-center relative mb-3 group focus-within:ring-2 rounded-xl">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-white/10 rounded-l-xl p-3 bg-background/60 backdrop-blur-md px-6 py-2 focus:outline-none transition focus:ring-2 focus:border-transparent w-full text-lg h-12"
              />
              <div className="border border-white/10 bg-background/60 backdrop-blur-md rounded-r-xl p-3  px-1 py-2 w-12 h-12 align-middle justify-center flex group-focus-within:ring-2 transition">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPassword(!showPassword)}
                  className="items-center align-middle"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
           <div className="flex flex-col items-center justify-center gap-3">
              <ReCAPTCHA
                sitekey="6LcGOr8sAAAAAO1Bu_bDkn4MKqXFAYU11EnmX0yJ"
                onChange={(value) => setCaptcha(value)}
              />
              <button
                type="submit"
                className="bg-primary text-font py-2 px-4 rounded-3xl hover:bg-blue-400 active:bg-blue-500 w-full mb-3 text-lg h-12"
              >
                Login
              </button>
            </div>
          </form>
          <button
            onClick={() => navigate("/register")}
            className="bg-primary text-font py-2 px-4 rounded-3xl hover:bg-blue-400 active:bg-blue-500 w-full text-lg h-12"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
