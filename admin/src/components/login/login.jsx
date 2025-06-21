import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    if (email === "admin@gmail.com" && password === "admin") {
      localStorage.setItem("isLogin", true);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Sign In</h1>
          <p style={styles.subtitle}>Please enter your credentials</p>
        </div>

        {/* Form */}
        <div style={styles.formContainer}>
          <div style={styles.formContent}>
            {/* Email field */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password field */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                ...styles.submitButton,
                ...(isLoading ? styles.submitButtonDisabled : {}),
              }}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "384px",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px",
    margin: "0 0 8px 0",
  },
  subtitle: {
    color: "#6b7280",
    margin: "0",
  },
  formContainer: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "8px",
    boxShadow:
      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    border: "1px solid #e5e7eb",
  },
  formContent: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "4px",
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
    boxSizing: "border-box",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    width: "100%",
    padding: "8px 40px 8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
    boxSizing: "border-box",
  },
  eyeButton: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#9ca3af",
    cursor: "pointer",
    padding: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  optionsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "14px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    color: "#6b7280",
    cursor: "pointer",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    marginRight: "8px",
    accentColor: "#2563eb",
  },
  forgotLink: {
    color: "#2563eb",
    textDecoration: "none",
    fontSize: "14px",
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#2563eb",
    color: "white",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.15s ease-in-out",
  },
  submitButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  signupText: {
    textAlign: "center",
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "24px",
    margin: "24px 0 0 0",
  },
  signupLink: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default Login;
