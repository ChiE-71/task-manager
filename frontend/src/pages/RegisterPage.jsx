import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      const res = await axios.post("/api/auth/register", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      console.log(error);
      document.querySelector(".registerFailtextbox").textContent = "Registration failed, please input a valid email and password.";
    }
  };

  return (
    <div className="bg-background text-font">
      <div className="login-page flex flex-col items-center justify-center min-h-screen gap-3">
        <div>
          <h1 className="font-heading text-4xl font-semibold">TASK MANAGER</h1>
        </div>
        <div>
          <h2 className="font-body text-2xl font-medium mb-3">
            Register an account
          </h2>
        </div>
        <div>
          <p className="registerFailtextbox"></p>
        </div>
        <div className="w-full max-w-sm">
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-3 border border-white/10 bg-background/60 backdrop-blur-md rounded-xl px-6 py-2 focus:outline-none focus:ring-2 w-full text-lg h-12 transition"
              />
            </div>
            <div className="flex flex-row items-center relative mb-3 group focus-within:ring-2 rounded-xl">
              {showPasswordHint && (
                <div className="absolute -top-12 right-0 bg-background/80 backdrop-blur-md border border-white/10 text-sm px-3 py-2 rounded-lg shadow-lg">
                  Password must be at least 8 characters
                </div>
              )}
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowPasswordHint(true)}
                onBlur={() => setShowPasswordHint(false)}
                className="border border-white/10 bg-background/60 backdrop-blur-md  rounded-l-xl px-6 py-2 focus:outline-none focus:ring-2 focus:border-transparent w-full text-lg h-12 transition"
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
            <div className="flex flex-row items-center relative mb-3">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border border-white/10 bg-background/60 backdrop-blur-md rounded-xl px-6 py-2 focus:outline-none focus:ring-2 focus:border-transparent w-full text-lg h-12 transition"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-primary text-font py-2 px-4 rounded-3xl hover:bg-blue-400 active:bg-blue-500 w-full mb-3 h-12"
              >
                Register
              </button>
            </div>
          </form>
          <p>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
