import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import { useDispatch, useSelector } from "react-redux";
import { login as setCredantials } from "../../store/features/authSlice/authSlice";
import { useToaster, Notification } from "rsuite";
import { motion } from "framer-motion";
import { FaExclamationCircle } from "react-icons/fa";
import { useLoginMutation } from "../../store/features/usersApiSlice/usersApiSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toaster = useToaster();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const { user } = useSelector((state: any) => state.user);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleClickButton = async () => {
    if (!email || !password) {
      toaster.push(
        <Notification>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FaExclamationCircle className="error-icon" />
            <h6>Please fill in all fields.</h6>
          </div>
        </Notification>,
        {
          placement: "topEnd",
        }
      );
      return;
    }

    const isValidEmail = /\S+@\S+\.\S+/.test(email);
    if (!isValidEmail) {
      toaster.push(
        <Notification type="error" header="Invalid email adress">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h6>Please enter a valid email.</h6>
          </div>
        </Notification>,
        {
          placement: "topEnd",
        }
      );
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredantials({ ...res }));
      navigate("/");
      toaster.push(
        <Notification>
          <div className="notification-content">
            <h6>Successfully logged in 🎉</h6>
          </div>
        </Notification>,
        {
          placement: "topEnd",
        }
      );
    } catch (error: any) {
      toaster.push(
        <Notification type="error" header="Error">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h6>
              {error.data.message || "An error occurred. Please try again."}
            </h6>
          </div>
        </Notification>,
        {
          placement: "topEnd",
        }
      );
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="page">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          delay: 0.1,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        className="container"
      >
        <h1>Login</h1>
        <div className="input-space">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-space">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleShowPassword} className="show-password">
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <p className="to-register">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register</span>
        </p>
        <button
          disabled={isLoading}
          onClick={handleClickButton}
          className="button"
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
      </motion.div>
    </div>
  );
};

export default Login;
