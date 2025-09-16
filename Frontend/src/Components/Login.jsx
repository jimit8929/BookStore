import { useEffect, useState } from "react";
import { loginStyles as s } from "../assets/dummystyles.js";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(
        () => setToast({ ...toast, visible: false }),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {email , password} = formData;

    if(!email.trim() || !password.trim()){
      setToast({
        visible : true,
        message : "All fields are required",
        type : "error",
      })
      return;
    }

    setIsSubmitting(true);

    try{
      const res = await fetch("http://localhost:5000/api/users/login" , {
        method : "POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({email , password}),
      })

      const data = await res.json();

      if(!res.ok){
        throw new Error(data.message || "Invalid Credentials");
      }

      //Save Token
      localStorage.setItem("authToken" , data.token);
      setToast({visible:true , message : "Login Successfull" , type:"success"});
      setTimeout(() => navigate("/"),1000);
    }
    catch(error){
      setToast({visible : true, message : error.message , type : "error"});
    }
    finally{
      setIsSubmitting(false);
    }

  };

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    setToast({
      visible: true,
      message: "Signed out Successfull",
      type: "success",
    });
  };

  const isLoggedIn = localStorage.getItem("authToken");

  return (
    <div className={s.container}>
      {toast.visible && (
        <div className={s.toast(toast.type)}>{toast.message}</div>
      )}

      <div className={s.card}>
        <Link to="/" className={s.backLink}>
          <ArrowRight className="rotate-180 mr-1 h-4 w-4" />
          Back to Home
        </Link>

        {!isLoggedIn ? (
          <>
            <div className="text-center mb-8">
              <div className={s.iconCircle}>
                <Lock className="h-6 w-6 text-emerald-300" />
              </div>

              <h1 className={s.heading}>Sign In</h1>
              <p className={s.subheading}>Access your BookStore Account</p>
            </div>

            <form className={s.form} onSubmit={handleSubmit}>
              <div>
                <label className={s.label}>Email</label>
                <div className={s.inputWrapper}>
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
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
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
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

              <button
                type="submit"
                disabled={isSubmitting}
                className={s.submitButton}
              >
                {isSubmitting ? "signing in..." : "Sign In"}
              </button>
            </form>

            <div className={s.footerText}>
              Don't have an Account{" "}
              <Link to="/signup" className={s.footerLink}>
                Create Account
              </Link>
            </div>
          </>
        ) : (
          <div className={s.signedInContainer}>
            <div className={s.signedInIcon}>
              <Lock className="h-6 w-6 text-emerald-300" />
            </div>

            <h2 className={s.signedInHeading}>Welcome Back</h2>

            <button onClick={() => navigate("/")} className={s.homepageButton}>
              Go to HomePage
            </button>

            <button onClick={handleSignOut} className={s.signOutButton}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
