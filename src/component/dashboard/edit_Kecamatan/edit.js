import React, { useState } from "react";
import { postKecamatan, saveLogActivity } from "../../../service/api";
import { useNavigate, Link } from "react-router-dom";
import backgroundProfil from "../../../assets/image.png";

const PostingPage = () => {
  const [nama, setNama] = useState("");
  const [id, setId] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambar, setGambar] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorId, setErrorMessageId] = useState("");
  const [errorImg, setErrorMessageImg] = useState("");
  const [errorFormat, setErrorMessageFormat] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();
  const adminId = localStorage.getItem("adminId");
  const [countdown, setCountdown] = useState(3);
  const [bidang, setBidang] = useState("");
  const [judul, setJudul] = useState("");
  const [anggaran, setAnggaran] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [koordinat, setKoordinat] = useState("");
  const [tahun, setTahun] = useState("");
  

  const handleNamaChange = (e) => {
    setNama(e.target.value);
  };
  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleIdChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setId(value);
      setErrorMessage("");
    }
  };

  const handleDeskripsiChange = (e) => {
    setDeskripsi(e.target.value);
  };

  const handleGambarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          if (img.width  < 1000 && img.height < 1000) {
            setGambar(file);
            setErrorMessage("");
            setErrorMessageImg("");
          } else {
            setTimeout(() => {
              setErrorMessageImg("");
            }, 5000);
            setErrorMessageImg(
              "Ukuran gambar tidak boleh lebih dari 1000 piksel"
            );
          }
        };
        img.onerror = () => {
          setTimeout(() => {
            setErrorMessageFormat("");
          }, 5000);
          setErrorMessageFormat(
            "Format gambar tidak valid. Silakan pilih file gambar."
          );
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleBidangChange = (e) => {
    setBidang(e.target.value);
  };

  const handleJudulChange = (e) => {
    setJudul(e.target.value);
  };

  const handleAnggaranChange = (e) => {
    setAnggaran(e.target.value);
  };

  const handleLokasiChange = (e) => {
    setLokasi(e.target.value);
  };

  const handleKoordinatChange = (e) => {
    setKoordinat(e.target.value);
  };
  const handleCancel = () => {
    navigate("/dashboard");
  };
  const handleTahunChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setTahun(value);
      setErrorMessage("");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nama || !id || !deskripsi || !gambar) {
      setErrorMessage("Mohon lengkapi semua field.");

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);

      return;
    }

    try {
      const response = await postKecamatan(nama, id, deskripsi, gambar);

      if (response.success) {
        // Save activity log
        // await saveLogActivity({
        //   id_admin: adminId,
        //   id_kecamatan: id,
        //   status: "Posting data kecamatan",
        //   nama_kecamatan: nama,
        //   deskripsi: deskripsi,
        //   gambar: gambar,
        // });

        setShowSuccessPopup(true);
        startCountdown();
      }
    } catch (error) {
      console.error("id kecamatan telah tersedia.", error);
      setErrorMessageId("Mohon lengkapi semua field.", error);
    }
  };

  const startCountdown = () => {
    let timeLeft = 3;
    setCountdown(timeLeft);
    const countdownTimer = setInterval(() => {
      timeLeft--;
      setCountdown(timeLeft);
      if (timeLeft === 0) {
        clearInterval(countdownTimer);
        setShowSuccessPopup(false);
        navigate("/log");
      }
    }, 1000);
  };

  return (
    <div className="posting-page">
      <div className="flex justify-center mt-12 mb-12">
        <div className="w-1/2 bg-white shadow-lg rounded-lg p-6">
          <img
            src={backgroundProfil}
            alt="Logo"
            className="w-20 mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold mb-6 text-center">
            Update Data Pembangunan
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="nama" className="text-lg font-bold mb-2">
                Nama:
              </label>
              <input
                type="text"
                id="nama"
                placeholder="Masukkan Nama Kecamatan"
                value={nama}
                onChange={handleNamaChange}
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              {!nama && errorMessage && (
                <span className="error-message text-red-500">
                  Nama kecamatan tidak boleh kosong.
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="id" className="text-lg font-bold mb-2">
                Kode Pos (*angka*):
              </label>
              <input
                type="text"
                id="id"
                placeholder="Masukkan Kode pos kecamatan"
                value={id}
                onChange={handleIdChange}
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              {!id && errorMessage && (
                <span className="error-message text-red-500">
                  ID kecamatan tidak boleh kosong.
                </span>
              )}
              {errorId && (
                <div className="error-message text-red-500">
                  Kode Pos telah tersedia.
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="bidang" className="text-lg font-bold mb-2">
                Bidang:
              </label>
              <textarea
                id="bidang"
                placeholder="Masukkan Nama Pembangunan"
                value={bidang}
                onChange={handleBidangChange}
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              {!bidang && errorMessage && (
                <span className="error-message text-red-500">
                  Nama bidang tidak boleh kosong.
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="bidang" className="text-lg font-bold mb-2">
                Judul Pekerjaan:
              </label>
              <textarea
                id="judul"
                placeholder="Masukkan judul pekerjaan"
                value={judul}
                onChange={handleJudulChange}
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              {!judul && errorMessage && (
                <span className="error-message text-red-500">
                  judul pekerjaan tidak boleh kosong.
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="anggaran" className="text-lg font-bold mb-2">
                Anggaran:
              </label>
              <textarea
                id="anggaran"
                placeholder="RP -"
                value={anggaran}
                onChange={handleAnggaranChange}
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              {!anggaran && errorMessage && (
                <span className="error-message text-red-500">
                  Anggaran tidak boleh kosong.
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="lokasi" className="text-lg font-bold mb-2">
                Lokasi:
              </label>
              <textarea
                id="lokasi"
                placeholder="Masukkan Lokasi pembangunan"
                value={lokasi}
                onChange={handleLokasiChange}
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              {!lokasi && errorMessage && (
                <span className="error-message text-red-500">
                  Lokasi tidak boleh kosong.
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="koordinat" className="text-lg font-bold mb-2">
                Koordinat:
              </label>
              <textarea
                id="koordiat"
                placeholder="Masukkan koordinat lokasi"
                value={koordinat}
                onChange={handleKoordinatChange}
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              {!koordinat && errorMessage && (
                <span className="error-message text-red-500">
                  Koordinat lokasi tidak boleh kosong.
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="tahun" className="text-lg font-bold mb-2">
                Tahun:
              </label>
              <textarea
                id="tahun"
                placeholder="Masukkan tahun pekerjaan"
                value={tahun}
                onChange={handleTahunChange}
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              {!tahun && errorMessage && (
                <span className="error-message text-red-500">
                  Tahun tidak boleh kosong.
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="gambar" className="text-lg font-bold mb-2">
                Gambar:
              </label>
              <input
                type="file"
                id="gambar"
                accept="image/*"
                onChange={handleGambarChange}
                className="border border-gray-300 rounded-lg px-4 py-2 "
              />
              {!gambar && errorMessage && (
                <span className="error-message text-red-500">
                  Gambar tidak boleh kosong.
                </span>
              )}
              {errorImg && (
                <div className="error-message text-red-500">
                  Ukuran gambar harus 500 x 500 piksel. Silakan pilih gambar
                  dengan ukuran yang sesuai.
                </div>
              )}
              {errorFormat && (
                <div className="error-message text-red-500">
                  Format Gambar salah , silahkan pilih ulang file ( jpg / png /
                  jpeg)
                </div>
              )}
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={showSuccessPopup}
                className={`bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 mt-4 ${
                  showSuccessPopup ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Submit
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 mt-4 ml-5"
                onClick={handleDashboard}
              >
                Cancel
              </button>
            </div>
            {showSuccessPopup && (
              <div className="success-popup-posting mt-4 text-center">
                <div>Postingan berhasil terkirim!</div>
                <p>
                  Anda akan diarahkan ke halaman History dalam {countdown}{" "}
                  detik.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostingPage;
