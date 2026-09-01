"use client";

import Userlayouts from "@/src/layouts/userlayouts";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import {
  loginUser,
  registerUser,
} from "@/src/config/redux/action/authAction";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [userLogingMethod, setUserLoginMethod] = useState(false);

  const [email, setEmailAddress] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [formError, setFormError] = useState("");

  // ================= LOADING STATE =================
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn, router]);

  // ================= REGISTER =================
  const handlerRegister = async () => {
    console.log("registering ...");

    setLoading(true);

    try {
      await dispatch(
        registerUser({
          username,
          password,
          email,
          name,
        })
      ).unwrap();

      // Register successful
      // Login mode par switch karo
      setUserLoginMethod(true);
    } catch (err) {
      console.log("register failed", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGIN =================
  const handlerLogin = async () => {
    console.log("logging in ...");

    setLoading(true);

    try {
      await dispatch(
        loginUser({
          email,
          password,
        })
      ).unwrap();
    } catch (err) {
      console.log("login failed", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    if (userLogingMethod) {
      // Sign in
      if (!email.trim() || !password.trim()) {
        setFormError("Email and Password are required");
        return false;
      }
    } else {
      // Sign up
      if (
        !username.trim() ||
        !name.trim() ||
        !email.trim() ||
        !password.trim()
      ) {
        setFormError("All fields are required");
        return false;
      }
    }

    setFormError("");
    return true;
  };

  // ================= SUBMIT =================
  const handleSubmit = () => {
    if (loading) return;

    if (!validateForm()) return;

    if (userLogingMethod) {
      handlerLogin();
    } else {
      handlerRegister();
    }
  };

  return (
    <Userlayouts>

      {/* ================= FULL SCREEN LOADER ================= */}
      {loading && (
        <div className={styles.fullScreenLoader}>
          <div className={styles.loader}></div>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.cardContainer}>

          {/* ================= LEFT ================= */}
          <div className={styles.cardContainer_left}>

            <p className={styles.cardleft_heading}>
              {userLogingMethod ? "Sign in" : "Sign up"}
            </p>

            <p
              style={{
                color: authState.isError ? "red" : "green",
              }}
            >
              {authState.message}
            </p>

            {formError && (
              <p style={{ color: "red" }}>
                {formError}
              </p>
            )}

            <div className={styles.inputContainers}>

              {/* USERNAME + NAME */}
              {!userLogingMethod && (
                <div className={styles.inputRow}>

                  <input
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    className={styles.inputField}
                    type="text"
                    placeholder="username"
                    disabled={loading}
                  />

                  <input
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    className={styles.inputField}
                    type="text"
                    placeholder="Name"
                    disabled={loading}
                  />

                </div>
              )}

              {/* EMAIL */}
              <input
                onChange={(e) =>
                  setEmailAddress(e.target.value)
                }
                className={styles.inputField}
                type="text"
                placeholder="email"
                disabled={loading}
              />

              {/* PASSWORD */}
              <input
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className={styles.inputField}
                type="password"
                placeholder="Password"
                disabled={loading}
              />

              {/* ================= BUTTON ================= */}
              <div
                onClick={handleSubmit}
                className={`${styles.buttonWithOutline} ${
                  loading ? styles.buttonDisabled : ""
                }`}
              >
                {loading ? (
                  <div className={styles.buttonLoader}></div>
                ) : (
                  <p>
                    {userLogingMethod
                      ? "Sign In"
                      : "Sign Up"}
                  </p>
                )}
              </div>

              {/* ================= SWITCH LOGIN/SIGNUP ================= */}
              <div
                onClick={() => {
                  if (!loading) {
                    setUserLoginMethod(!userLogingMethod);
                  }
                }}
                style={{
                  cursor: loading ? "not-allowed" : "pointer",
                  textDecoration: "underline",
                }}
              >
                <p>
                  {userLogingMethod
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </p>
              </div>

              {/* ================= RIGHT ================= */}
              <div className={styles.cardContainer_right}></div>

            </div>
          </div>

        </div>
      </div>

    </Userlayouts>
  );
}

export default LoginComponent;