import React, { useState } from "react";
import DetailPage from "../detail_Page/DetailPage";
import { useNavigate, Link } from "react-router-dom";
import { deleteDetail, Details } from "../../service/api";

const Detail = ({ data }) => {
  const [countdown, setCountdown] = useState(2);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();
  const url = "http://192.168.1.21:3002";

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-gray-500">Data detail tidak ditemukan.</p>
      </div>
    );
  }

  const gambar = data.gambar1;

  const imgsrc = `${url}/detail/${data.id_kecamatan}/${gambar}`;

  const startCountdown = () => {
    let timeLeft = 2;
    setCountdown(timeLeft);
    const countdownTimer = setInterval(() => {
      timeLeft--;
      setCountdown(timeLeft);
      if (timeLeft === 0) {
        clearInterval(countdownTimer);
        setShowSuccessPopup(false);
        navigate("/dashboard");
      }
    }, 1000);
  };
  const handleDelete = async () => {
    try {
      await deleteDetail(data.id);
      setShowSuccessPopup(true);

      startCountdown();

      // Lakukan tindakan lain setelah penghapusan berhasil, seperti mengarahkan pengguna ke halaman lain
    } catch (error) {
      console.error("Gagal get data :", error);
    }
  };

  const handleDetail = async () => {
    navigate(`/halaman/${data.id}`);
  };

  return (
    <div className="detail-container">
      <div className="detail-card bg-gray-200 shadow-lg rounded-lg overflow-hidden p-5 ">
        <div className="detail-image flex items-center mb-4">
          <img
            src={imgsrc}
            alt="Gambar Kecamatan"
            className="object-cover mx-auto h-auto w-full"
          />
        </div>
        <div className="detail-content">
          <p className="detail-info mb-10">
            <strong>Judul Pekerjaan:</strong> {data.judul}
          </p>
          <p className="detail-info">Bidang : {data.bidang}</p>
          <p className="detail-info">Lokasi : {data.lokasi}</p>

          <button
            className="read-more bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none 
          focus:shadow-outline mt-4"
            onClick={handleDetail}
          >
            Detail
          </button>

          <button
            className="read-more bg-red-500 hover:bg-redd-700 text-white font-bold py-2 
          px-4 rounded focus:outline-none focus:shadow-outline ml-5 mt-4"
            onClick={handleDelete}
          >
            Hapus
          </button>
        </div>
        {showSuccessPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Data Publikasi Berhasil dihapus!
              </h2>
              <p className="text-xl">
                Anda akan diarahkan ke halaman Dashboard dalam {countdown}{" "}
                detik.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;
