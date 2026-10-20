
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LockKeyhole,
  Mail,
  UserRound,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  LogOut,
} from "lucide-react";
import "./App.css";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5009/api/auth";

async function apiRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Server is not please check backend or restart"
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export default function App() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      const data = await apiRequest(`/${mode}`, {
        method: "POST",
        body: JSON.stringify(
          mode === "register"
            ? { name: name.trim(), email: email.trim(), password }
            : { email: email.trim(), password }
        ),
      });

      setUser(data.user);
      setPassword("");
      setMessage(data.message || "Success!");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await apiRequest("/logout", {
        method: "POST",
        body: JSON.stringify({}),
      });

      setUser(null);
      setPassword("");
      setMode("login");
      setMessage("");
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setMessage("");
    setPassword("");
    setShowPassword(false);
  }

  return (
    <main className="page">
      <div className="background-grid" />

      

      <section className="layout">
        <motion.div
          className="intro"
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">YOUR SPACE, YOUR FUTURE</span>

          <h1>
            Make room for
            <span> what’s next.</span>
          </h1>

          <p className="intro-text">
            A calmer, smarter space to manage your world.
            Sign in and pick up right where you left off.
          </p>

          <div className="scene">
            <motion.div
              className="platform"
              animate={{ rotateZ: [0, 3, 0], y: [0, -5, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="cube"
              animate={{
                rotateY: [0, 15, 0, -15, 0],
                rotateX: [0, -8, 0, 8, 0],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="cube-front">
                <LockKeyhole size={55} strokeWidth={1.4} />
              </div>
              <div className="cube-top" />
              <div className="cube-side" />
            </motion.div>

            <motion.div
              className="floating-shield"
              animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <ShieldCheck size={26} />
            </motion.div>

            <motion.span
              className="sparkle sparkle-one"
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✦
            </motion.span>

            <motion.span
              className="sparkle sparkle-two"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              ✧
            </motion.span>
          </div>

          <div className="trust-note">
            <span className="trust-icon">
              <CheckCircle2 size={19} />
            </span>
            <p>
              <strong>Your privacy matters.</strong>
              <br />
              Designed with security in mind.
            </p>
          </div>
        </motion.div>

        <div className="form-area">
          <AnimatePresence mode="wait">
            {user ? (
              <motion.div
                key="dashboard"
                className="auth-card dashboard"
                initial={{ opacity: 0, rotateY: -18, y: 20 }}
                animate={{ opacity: 1, rotateY: 0, y: 0 }}
                exit={{ opacity: 0, rotateY: 15, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                <div className="success-icon">
                  <CheckCircle2 size={34} />
                </div>

                <span className="eyebrow">LOGIN SUCCESSFUL</span>
                <h2>Welcome, {user.name.split(" ")[0]}!</h2>
                <p className="subtitle">
                  You are signed in and ready to go.
                </p>

                <div className="user-info">
                  <div className="avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <ShieldCheck className="user-shield" size={22} />
                </div>

                <button
                  className="secondary-button"
                  type="button"
                  onClick={logout}
                >
                  <LogOut size={17} /> Sign out
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={mode}
                className="auth-card"
                initial={{ opacity: 0, rotateY: -12, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, rotateY: 0, y: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: 12, y: -12, scale: 0.98 }}
                transition={{ duration: 0.35 }}
              >
                <div className="card-icon">
                  <LockKeyhole size={23} />
                </div>

                <span className="eyebrow">
                  {mode === "login" ? "WELCOME BACK" : "GET STARTED"}
                </span>

                <h2>
                  {mode === "login"
                    ? "Good to see you."
                    : "Create your account."}
                </h2>

                <p className="subtitle">
                  {mode === "login"
                    ? "Enter your details to sign in."
                    : "Fill in your details to get started."}
                </p>

                <div className="mode-tabs">
                  <button
                    type="button"
                    className={mode === "login" ? "selected" : ""}
                    onClick={() => changeMode("login")}
                  >
                    Sign in
                  </button>

                  <button
                    type="button"
                    className={mode === "register" ? "selected" : ""}
                    onClick={() => changeMode("register")}
                  >
                    Register
                  </button>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                  {mode === "register" && (
                    <label className={`field ${focused === "name" ? "focused" : ""}`}>
                      <span>Full name</span>
                      <div className="input-3d">
                        <UserRound size={18} />
                        <input
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onFocus={() => setFocused("name")}
                          onBlur={() => setFocused("")}
                          autoComplete="name"
                          minLength={2}
                          required
                        />
                      </div>
                    </label>
                  )}

                  <label className={`field ${focused === "email" ? "focused" : ""}`}>
                    <span>Email address</span>
                    <div className="input-3d">
                      <Mail size={18} />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused("")}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </label>

                  <label className={`field ${focused === "password" ? "focused" : ""}`}>
                    <span>Password</span>
                    <motion.div
                      className="input-3d password-input"
                      animate={{
                        rotateX: focused === "password" ? -2 : 0,
                        rotateY: focused === "password" ? 2 : 0,
                        scale: focused === "password" ? 1.015 : 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 18,
                      }}
                    >
                      <LockKeyhole size={18} />

                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder={
                          mode === "register"
                            ? "At least 8 characters"
                            : "Enter your password"
                        }
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocused("password")}
                        onBlur={() => setFocused("")}
                        autoComplete={
                          mode === "register"
                            ? "new-password"
                            : "current-password"
                        }
                        minLength={mode === "register" ? 8 : undefined}
                        required
                      />

                      <button
                        className="eye-button"
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </motion.div>
                  </label>

                  {mode === "register" && (
                    <p className="password-hint">
                      <span className={password.length >= 8 ? "valid" : ""} />
                      {password.length >= 8
                        ? "Password length looks good"
                        : "Use at least 8 characters"}
                    </p>
                  )}

                  {message && (
                    <motion.div
                      className={`message ${messageType}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="status"
                    >
                      {message}
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    className="submit-button"
                    disabled={loading}
                    whileHover={{ scale: 1.025, rotateX: -3, y: -2 }}
                    whileTap={{ scale: 0.96, rotateX: 7, y: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 17 }}
                  >
                    <span className="button-shine" />

                    {loading ? (
                      <span className="loading-content">
                        <span className="spinner" />
                        {mode === "login"
                          ? "Signing in..."
                          : "Creating account..."}
                      </span>
                    ) : (
                      <span className="button-content">
                        {mode === "login" ? "Sign in securely" : "Create account"}
                        <ArrowRight size={18} />
                      </span>
                    )}
                  </motion.button>
                </form>

                <p className="form-note">
                  <ShieldCheck size={15} />
                  Your information stays protected.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

       
    </main>
  );
}
