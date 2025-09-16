import { useEffect, useState } from "react";
import { Signup as s, Signup } from "../assets/dummystyles.js";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, User } from "lucide-react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast({ visible: false, message: "", type: "" });

        if (toast.type === "success") navigate("/login");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast, navigate]);

  const handleSubmit = async(e) => {
    e.preventDefault();

    const { username, email, password } = formData;

    if (!username.trim() || !email.trim() || !password.trim()) {
      setToast({
        visible: true,
        message: "All fields are required",
        type: "error",
      });
      return;
    }

    setToast({ visible: true, message: "Creating Account...", type: "info" });
    
    try{
      const res = await fetch("http://localhost:5000/api/users/register" , {
        method : "POST",
        headers:{
          "Content-Type" : "application/json",
        },
        body:JSON.stringify({username , email , password}),
      });

      const data = await res.json();

      if(!res.ok){
        throw new Error(data.message || "Something went wrong");
      }

      setToast({visible:true, message:"Account Created Successfully", type:"success"});
    }
    catch(error){
      setToast({visible:true , message : error.message , type : "error"});
    }
  };

  return (
    <div className={s.container}>
      {toast.visible && (
        <div
          className={`${Signup.toastBase} ${
            toast.type === "success" ? Signup.toastSuccess : Signup.toastError
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className={s.card}>
        <Link to="/" className={s.backLink}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <div className={s.iconContainer}>
            <User className="h-6 w-6 text-teal-300" />
          </div>

          <h1 className={s.heading}>Create Account</h1>
          <p className={s.subtext}>Join our Community of book lovers</p>
        </div>

        <form onSubmit={handleSubmit} className={s.form}>
          <div>
            <label className={s.label}>Username</label>
            <div className={s.inputWrapper}>
              <User className={s.iconLeft} />
              <input
                type="text"
                name="username"
                placeholder="Enter your Name"
                className={s.input}
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className={s.label}>Email</label>
            <div className={s.inputWrapper}>
              <User className={s.iconLeft} />
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                className={s.input}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className={s.label}>Password</label>
            <div className={s.inputWrapper}>
              <User className={s.iconLeft} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="•••••••••"
                className={s.passwordInput}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={s.togglePassword}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className={s.submitBtn}>
            Create Account
          </button>
        </form>

        <div className={s.footerText}>
          Already have an Account?{" "}
          <Link to="/login" className={s.link}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
