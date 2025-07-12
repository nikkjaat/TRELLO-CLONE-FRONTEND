import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTask } from "../../contexts/TaskContext";
import { User, Mail, Lock, UserPlus, LogIn } from "lucide-react";
import styles from "./LoginForm.module.css";

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "customer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { getTasks } = useTask();

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let result = isLogin
        ? await login(formData.email, formData.password)
        : await register(
            formData.email,
            formData.password,
            formData.name,
            formData.role
          );

      if (!result.success) {
        setError(result.error);
        return; // ⛔ Prevent getTasks() if login/register failed
      }

      // ✅ Only run if login/register successful
      await getTasks();
    } catch (err) {
      setError("An error occurred. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <User className={styles.icon} size={32} />
          <h1 className={styles.title}>Task Manager</h1>
          <p className={styles.subtitle}>
            {isLogin ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <User className={styles.inputIcon} size={20} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={styles.input}
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <Mail className={styles.inputIcon} size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.inputIcon} size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>

          {!isLogin && (
            <div className={styles.inputGroup}>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? (
              <div className={styles.spinner}></div>
            ) : (
              <>
                {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                {isLogin ? "Sign In" : "Sign Up"}
              </>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className={styles.toggleButton}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>

        <div className={styles.demoCredentials}>
          <h3>Demo Credentials:</h3>
          <div className={styles.credentialsList}>
            <div>Admin: admin@example.com / admin123</div>
            <div>Vendor: vendor@example.com / vendor123</div>
            <div>Customer: customer@example.com / customer123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
