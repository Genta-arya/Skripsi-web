import React, { useState, useEffect } from "react";
import { postKonten, getKecamatan , kirimNotifikasi,deleteNotifikasi } from "../service/api";
import { useNavigate, Link } from "react-router-dom";
import backgroundProfil from "../assets/image.png";
import { useLocation } from "react-router-dom";

const PostingPembangunan = () => {
  const [kecamatanlist, setKecamatanlist] = useState([]);
  const [nama, setNama] = useState("");
  const [id, setId] = useState("");
  const [bidang, setBidang] = useState("");
  const [judul, setJudul] = useState("");
  const [anggaran, setAnggaran] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [koordinat, setKoordinat] = useState("");
  const [tahun, setTahun] = useState("");
  const [gambar, setGambar] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorId, setErrorMessageId] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errorImg, setErrorMessageImg] = useState("")
  const [errorFormat, setErrorMessageFormat] = useState("")
  const navigate = useNavigate();
  const adminId = localStorage.getItem("adminId");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    getKecamatan()
      .then((response) => {
        setKecamatanlist(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleNamaChange = (event) => {
    const selectedNama = event.target.value;
    setNama(selectedNama);

    // Auto-fill the ID based on selectedNama
    const selectedKecamatan = kecamatanlist.find(
      (kecamatan) => kecamatan.nama_kecamatan === selectedNama
    );
    if (selectedKecamatan) {
      setId(selectedKecamatan.id_kecamatan);
    } else {
      setId("");
    }
  };
  const handleTahunChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setTahun(value);
      setErrorMessage("");
    }
  };

  const handleIdChange = (event) => {
    const selectedId = event.target.value;
    setId(selectedId);
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

  const handleGambarChange = (e) => {
    const files = Array.from(e.target.files);
    const selectedFiles = files.slice(0, 3); // Batasi jumlah gambar maksimal menjadi 3
  
    if (gambar.length + selectedFiles.length > 3) {
      // Jika jumlah total gambar melebihi batas maksimal, tampilkan pesan error
      setErrorMessage("Maksimal 3 gambar yang dapat dipilih.");
      return;
    }
  
    const isValidImage = selectedFiles.every((file) => {
      // Periksa apakah file adalah gambar
      return file.type.startsWith("image/");
    });
  
    const imagePromises = selectedFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          if (img.width < 1000 && img.height < 1000) {
            resolve(file);
          } else {
            reject(file);
            setTimeout(() => {
              setErrorMessageImg("");
            }, 4000);
            setErrorMessageImg("Ukuran gambar harus 500 x 500 piksel.");
          }
        };
        img.onerror = () => {
          reject(file);
          setTimeout(() => {
            setErrorMessageFormat("");
          }, 4000);
          setErrorMessageFormat("--");
          
        };
        img.src = URL.createObjectURL(file);
      });
    });
  
    Promise.allSettled(imagePromises)
      .then((results) => {
        const validFiles = results
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);
  
        setGambar((prevGambar) => [...prevGambar, ...validFiles]);
  
        if (gambar.length + validFiles.length >= 3) {
          // Jika jumlah total gambar mencapai atau melebihi batas maksimal, nonaktifkan input
          e.target.disabled = true;
        }
      })
      .catch((errorFiles) => {
        const invalidFiles = errorFiles.map((error) => error.reason.name);
        setErrorMessageFormat(
          `Format gambar tidak valid atau ukuran gambar harus 500 x 500 piksel. Silakan pilih gambar dengan format dan ukuran yang sesuai: ${invalidFiles.join(", ")}`
        );
      });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id || !nama || !bidang || !judul || !anggaran ||!tahun || !lokasi || !koordinat || gambar.length === 0) {
      setErrorMessage("Mohon lengkapi semua field dan pilih minimal 1 gambar.");

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);

      return;
    }

    try {
      const response = await postKonten(
        id,
        nama,
        bidang,
        judul,
        anggaran,
        lokasi,
        koordinat,
        tahun,
        gambar,
      );

      if (response.success) {
        // Save activity log

        const notifikasiData = {
         
        };
  
        await kirimNotifikasi( 
           id,
           nama,
           "ada postingan baru nih",
          gambar,
          );
  

        setShowSuccessPopup(true);
        startCountdown();
        // startCountdownForNotificationDeletion();
      }
    } catch (error) {
      console.error("id kecamatan telah tersedia.", error);
      setErrorMessageId("Mohon lengkapi semua field.", error);
    }
  };

  const startCountdownForNotificationDeletion = () => {
    setTimeout(async () => {
      try {
        // Panggil fungsi penghapusan notifikasi dari database di sini
        await deleteNotifikasi();
      } catch (error) {
        console.error("Terjadi kesalahan saat menghapus notifikasi:", error);
      }
    }, 3600000); // Mengatur waktu timeout 10 detik (10000 milidetik)
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
        navigate("/dashboard");
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
            Tambah Data Pembangunan
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="nama" className="text-lg font-bold mb-2">
                Nama Kecamatan:
              </label>
              <select
                id="nama"
                value={nama}
                onChange={handleNamaChange}
                className="border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="">Pilih Nama Kecamatan</option>
                {kecamatanlist.map((kecamatan) => (
                  <option key={kecamatan.id_kecamatan} value={kecamatan.nama_kecamatan}>
                    {kecamatan.nama_kecamatan}
                  </option>
                ))}
              </select>
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
                readOnly
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
              <label htmlFor="bidangs" className="text-lg font-bold mb-2">
                Bidang:
              </label>
              <textarea
                id="bidang"
                placeholder="Masukkan Nama Bidang"
                value={bidang}
                onChange={handleBidangChange}
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              {!bidang && errorMessage && (
                <span className="error-message text-red-500">
                  Nama Bidang tidak boleh kosong.
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="judul" className="text-lg font-bold mb-2">
                Judul Pekerjaan:
              </label>
              <textarea
                id="judul"
                placeholder="Masukkan Judul Pekerjaan"
                value={judul}
                onChange={handleJudulChange}
                className="border border-gray-300 rounded-lg px-4 py-2"
              />
              {!judul && errorMessage && (
                <span className="error-message text-red-500">
                  Judul Pekerjaan tidak boleh kosong.
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
                  Lokasi Pekerjaan tidak boleh kosong.
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
                Gambar (maksimal 3):
              </label>
              <input
                type="file"
                id="gambar"
                accept="image/*"
                multiple
                onChange={handleGambarChange}
                className="border border-gray-300 rounded-lg px-4 py-2"
                disabled={gambar.length >= 3} // Nonaktifkan input jika sudah ada 3 gambar
              />
              {!gambar.length && errorMessage && (
                <span className="error-message text-red-500">
                  Pilih minimal 1 gambar.
                </span>
              )}
               {errorImg && (
                <span className="error-message text-red-500">
                  Ukuran gambar maximal 500 x 500 pixel.
                </span>
              )}
               {errorFormat && (
                <span className="error-message text-red-500">
                  Format Gambar salah , silahkan pilih ulang file ( jpg / png / jpeg).
                </span>
              )}
              {gambar.length > 3 && (
                <div className="error-message text-red-500">
                  Maksimal 3 gambar yang dapat dipilih.
                </div>
              )}
              {gambar.map((file, index) => (
                <div key={index} className="mt-2">
                  <span>{file.name}</span>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-20 mx-auto mt-2"
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              
              className="bg-green-600 text-white rounded-lg py-2 px-4 hover:bg-green-700"
            >
              Submit
            </button>

            <button
              
              
              className="bg-red-500 text-white rounded-lg py-2 px-4 hover:bg-red-600 ml-5" onClick={handleCancel}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Data Publikasi berhasil ditambahkan!
            </h2>
            <p className="text-xl">
              Anda akan diarahkan ke halaman log dalam {countdown} detik.
            </p>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default PostingPembangunan;
