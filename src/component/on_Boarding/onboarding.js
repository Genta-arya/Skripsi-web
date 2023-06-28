import React from "react";
import { useNavigate } from "react-router-dom";

const Onboard = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="onboarding-container relative h-screen">
  <div className="onboarding-video absolute top-0 left-0 w-full h-full overflow-hidden">
    <video className="w-full h-full object-cover opacity-80" autoPlay muted loop>
      <source
        src="https://ketapangkab.go.id/upload/Potensi%20Daerah%20Kabupaten%20Ketapang.mp4"
        type="video/mp4"
      />
    </video>
  </div>
  <div className="onboarding-content flex flex-col items-center justify-center text-white relative z-10 ">
    <div className="flex flex-col items-center">
      <img
        src="https://ketapangkab.go.id/upload/logokabupatenketapang.png"
        width="100"
        height="100"
        alt="Logo Kabupaten Ketapang"
        className="mb-4 mt-20"
      />
      <h1 className="text-4xl font-bold text-center mt-3">Pemerintah Kabupaten Ketapang</h1>
      <img
        src="https://ketapangkab.go.id/upload/smartcity.png"
        width="300"
        height="275"
        alt="Smart City"
        className="mt-2"
      />
    </div>
    
    <a
  href="/login"
  className="get-started-link mt-8 inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-12 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:shadow-outline"
>
  Get Started
</a>
  </div>
</div>

  );
};

export default Onboard;
