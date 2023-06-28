import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../service/api";

import Footer from "../footer/layout.footer";
import backgroundImage from "../../assets/a.jpeg";
import backgroundProfil from "../../assets/image.png";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [passwordEmpty, setPasswordEmpty] = useState(false);
  const [usernameEmpty, setUsernameEmpty] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [countdownSukses, setCountdownSukses] = useState(3);
  const [countdown, setCountdown] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const countdownTimerRef = useRef(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const storedAdminId = localStorage.getItem("adminId");

    if (isLoggedIn === "true") {
      setLoggedIn(true);
      setAdminId(parseInt(storedAdminId));
    }
  }, []);

  useEffect(() => {
    if (showSuccessPopup) {
      countdownTimerRef.current = setInterval(() => {
        setCountdownSukses((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else {
      clearInterval(countdownTimerRef.current);
    }

    return () => {
      clearInterval(countdownTimerRef.current);
    };
  }, [showSuccessPopup]);

  useEffect(() => {
    const lastLoginDelay =
      parseInt(localStorage.getItem("lastLoginDelay")) || 0;
    const currentTimestamp = new Date().getTime();
    const delay = Math.max(
      30 - Math.floor((currentTimestamp - lastLoginDelay) / 1000),
      0
    );
    if (delay > 0) {
      setDisabled(true);
      setRemainingTime(delay);

      const timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      setTimeout(() => {
        setDisabled(false);
        setRemainingTime(0);
        localStorage.removeItem("loginAttempts");
        localStorage.removeItem("lastLoginDelay");
        clearInterval(timer);
      }, delay * 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, []);

  const checkLoginStatus = async () => {
    if (username && password) {
      try {
        const response = await login(username, password);

        if (response) {
          if (response.success) {
            const adminId = response.adminId.toString();

            setLoggedIn(true);
            setLoginError(false);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", username);
            localStorage.setItem("adminId", adminId);
            setAdminId(adminId);
            setShowSuccessPopup(true);
            setTimeout(() => {
              navigate("/dashboard");
            }, 3000);
          }
        } else {
          console.error("An error occurred while processing the login.");
        }
      } catch (error) {
        let loginAttempts =
          parseInt(localStorage.getItem("loginAttempts")) || 0;
        loginAttempts++;

        if (loginAttempts >= 3) {
          const currentTimestamp = new Date().getTime();
          localStorage.setItem("lastLoginDelay", currentTimestamp.toString());

          setErrorMessage(
            "Too many login attempts. Please try again after 10 seconds."
          );
          setDisabled(true);
          setRemainingTime(30);

          const timer = setInterval(() => {
            setRemainingTime((prevTime) => prevTime - 1);
          }, 1000);

          setTimeout(() => {
            setDisabled(false);
            setRemainingTime(0);
            localStorage.removeItem("loginAttempts");
            localStorage.removeItem("lastLoginDelay");
            clearInterval(timer);
          }, 30000);
        } else {
          localStorage.setItem("loginAttempts", loginAttempts.toString());
          setErrorMessage("An error occurred while processing the login.");
        }

        console.error(error);
      }
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setLoginError(false);
    setUsernameEmpty(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setLoginError(false);
    setPasswordEmpty(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!password || !username) {
      setPasswordEmpty(!password);
      setUsernameEmpty(!username);
    } else {
      setPasswordEmpty(false);
      setUsernameEmpty(false);
      if (!isDisabled) {
        checkLoginStatus();
      }
    }
  };

  useEffect(() => {
    if (incorrectAttempts === 3) {
      setDisabled(true);
      setShowSuccessPopup(false);
      setCountdown(10);
      const countdownTimer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      setTimeout(() => {
        setDisabled(false);
        setIncorrectAttempts(0);
        localStorage.removeItem("lastLoginDelay");
        clearInterval(countdownTimer);
      }, 10000);
    }
  }, [incorrectAttempts]);

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center relative  "
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="z-10 w-full max-w-md   rounded px-8 pt-6 pb-8 mb-4 relative">
        <div className="text-center text-2xl font-bold mb-6 text-white"></div>
        <img
          src={backgroundProfil}
          alt="Logo"
          className="mb-8 mx-auto"
          style={{ width: "100px" }}
        />

        {/* Konten Form */}
        <div className="mb-6">
          <label
            htmlFor="username"
            className="block text-white text-sm font-bold mb-2"
          ></label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder={
              !username && usernameEmpty
                ? "Username belum diisi"
                : "Masukkan username"
            }
            disabled={disabled}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-white text-sm font-bold mb-2"
          ></label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder={
              !password && passwordEmpty
                ? "Kata sandi belum diisi"
                : "Masukkan kata sandi"
            }
            disabled={disabled}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {errorMessage && (
          <p className="text-red-700 font-bold text-sm italic mb-5">
            Username atau password salah.
          </p>
        )}
        {disabled && remainingTime > 0 && (
          <p className="text-red-700 font-bold text-sm italic mt-2">
            Anda sudah gagal login sebanyak 3 kali. Silakan coba lagi dalam
            30 detik.
          </p>
        )}
        {showSuccessPopup && (
          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-50 bg-white">
            <div className="bg-white px-8 py-6 rounded">
              <p className="text-green-500 text-lg font-bold">
                Berhasil Masuk!
              </p>
              <p>Mengarahkan ke halaman dashboard dalam {countdownSukses} detik...</p>
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={disabled}
            onClick={handleLogin}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Masuk{" "}
            {disabled && remainingTime > 0 && (
              <p className="white font-bold text-sm italic mt-2">
                {remainingTime} detik
              </p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
