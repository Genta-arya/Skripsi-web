import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../pagination/Pagination";
import backgroundProfil from "../../assets/image.png";
import {
  getKecamatan,
  getDetail,
  saveLogActivityDelete,
  deleteKecamatan,
  isValidLogData,
} from "../../service/api";
import { useNavigate } from "react-router-dom";
import Footer from "../footer/layout.footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const [kecamatanlist, setKecamatanlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [admin_Id, setAdminId] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const AdminId = localStorage.getItem("adminId");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const totalData = kecamatanlist.length;
  const url = "http://192.168.1.21:3002";
  const [filteredKecamatan, setFilteredKecamatan] = useState([]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const displayedKecamatan = kecamatanlist.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    getKecamatan()
      .then((response) => {
        setKecamatanlist(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    // Filter data kecamatan berdasarkan search query dan halaman saat ini
    const filteredData = displayedKecamatan.filter((data) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        data.nama_kecamatan.toLowerCase().includes(searchTerm) ||
        data.deskripsi.toLowerCase().includes(searchTerm)
      );
    }, []);

    // Mengatur filteredKecamatan dengan data yang telah difilter
    setFilteredKecamatan(filteredData);
  }, [searchQuery, displayedKecamatan]);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const storedAdminId = localStorage.getItem("adminId");

    setLoggedInUsername(username);
    setAdminId(parseInt(storedAdminId));
  }, []);

  useEffect(() => {
    const storedAdminId = localStorage.getItem("adminId");
    if (!storedAdminId) {
      navigate("/");
    }
  }, [admin_Id, navigate]);

  const handleCekDetail = (data) => {
    getDetail(data.id_kecamatan)
      .then((response) => {
        const ress = response.data;
        if (response.data) {
          const state = { detailData: response.data };
          navigate(`/detail/${data.id_kecamatan}`, { state });
          console.log(response.data.profil);
        }
      })
      .catch((error) => {
        console.error("Error fetching detail data:", error);

        navigate("/not-found");
      });
  };

  const handlePostingData = () => {
    navigate("/posting");
  };

  const handleEditData = () => {
    navigate("/update");
    
  };

  const handleLog = () => {
    navigate("/log");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    navigate("/");
  };

  const handleDeleteConfirmation = () => {
    setDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation(false);
  };

  const handleDeleteData = async (data) => {
    if (!data) {
      console.error("Data tidak valid.");
      return;
    }

    const { id_admin, id_kecamatan, nama_kecamatan, deskripsi, gambar } = data;
    console.log("Tombol Hapus diklik untuk id_kecamatan:", id_kecamatan);

    try {
      const deletedData = await deleteKecamatan(id_kecamatan);

      if (deletedData) {
        const logData = {
          id_admin: AdminId,
          ket_act: "Menghapus data kecamatan",
          nama_kecamatan,
          id_kecamatan,
          deskripsi,
          gambar,
        };

        if (isValidLogData(logData)) {
          await saveLogActivityDelete(logData);
          console.log("Data berhasil dihapus dan kegiatan log disimpan.");
          navigate("/log");
        } else {
          console.error("Data log tidak valid:", logData);
        }
      } else {
        console.error("Data yang dihapus tidak valid:", deletedData);
      }

      setDeleteConfirmation(false);
    } catch (error) {
      console.error("Error menghapus data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={backgroundProfil}
                alt="Logo"
                className="w-10 h-10 mr-2 ml-5"
                style={{ width: "100px", height: "100px" }}
              />
              <h1 className="text-2xl font-bold text-white mt-1 ml-5">
                Dashboard<br></br>Selamat Datang : {loggedInUsername}
              </h1>
            </div>

            <div>
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg mr-4"
                onClick={handlePostingData}
              >
                Tambah Data
              </button>
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                onClick={handleLog}
              >
                Log Aktivitas
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg ml-4 mr-10"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-4">
          <div className="flex items-center mb-4"></div>
        </div>
        <div className="overflow-x-auto">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="h-5 w-5 text-gray-400 mr-2"
            />
            <input
              type="text"
              className="px-4 py-2 pr-10 border border-gray-300 rounded-lg w-50"
              placeholder="Cari Kecamatan.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="absolute  px-3 py-2"></div>

            <div className="pagination flex items-center mt-4">
              <p className="mr-2">Tampilkan :</p>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              {/* Tambahkan komponen Pagination dengan properti yang sesuai */}
            </div>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(kecamatanlist.length / pageSize)}
            onPageChange={handlePageChange}
          />
          <div className="mb-4">
            <h1 className="text-gray-500">Jumlah Kecamatan: {totalData}</h1>
          </div>
          <table className="w-full border border-gray-300 mt-5 mb-12">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border text-center ">Kode pos</th>
                <th className="py-2 px-4 border text-center">Nama Kecamatan</th>
                <th className="py-2 px-4 border text-center">Deskripsi</th>
                <th className="py-2 px-4 border text-center">Gambar</th>
                <th className="py-2 px-4 border text-center">Riwayat</th>
                <th className="py-2 px-4 border text-center" colSpan={2}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredKecamatan.length === 0 ? (
                <tr>
                  <td className="py-4 px-6 text-center" colSpan="5">
                    Kecamatan tidak ditemukan.
                  </td>
                </tr>
              ) : (
                filteredKecamatan.map((data) => (
                  <tr key={data.id_kecamatan}>
                    <td className="py-2 px-4 border text-center ">
                      <div className="text-sm text-gray-900 ">
                        {data.id_kecamatan}
                      </div>
                    </td>
                    <td className="py-2 px-4 border text-center">
                      <div className="text-sm text-gray-900">
                        {data.nama_kecamatan}
                      </div>
                    </td>
                    <td className="py-2 px-4 border text-center">
                      <div className="text-sm text-gray-900">
                        {data.deskripsi}
                      </div>
                    </td>
                    <td className="flex justify-center py-2 px-4 border text-center">
                      {kecamatanlist.map((kecamatanData) => {
                        if (kecamatanData.id_kecamatan === data.id_kecamatan) {
                          const gambarData = kecamatanData.gambar;
                          const imgSrc = `${url}/kecamatan/${gambarData}`;
                          return (
                            <img
                              src={imgSrc}
                              alt="Gambar Kecamatan"
                              style={{
                                width: "100%",
                                height: "auto",
                                objectFit: "cover",
                                objectPosition: "center",
                              }}
                              className="w-64 h-48" // Menentukan ukuran gambar dalam resolusi 4:3
                            />
                          );
                        }
                        return null;
                      })}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      <button
                        className="cek-nilai-button-dashboard bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                        onClick={() => handleCekDetail(data)}
                      >
                        Cek Pembangunan
                      </button>
                    </td>
                    <td className="py-2 px-4 border text-center">
                      <button
                        className="edit-data-button-dashboard bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                        onClick={() => handleEditData()}
                      >
                        Edit
                      </button>
                    </td>
                    <td className="py-2 px-4 border text-center">
                      {deleteConfirmation ? (
                        <>
                          <span className="block mb-2">
                            Apakah Anda yakin ingin menghapus data ini?
                          </span>
                          <button
                            className="hapus-data-button-ya bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                            onClick={() => handleDeleteData(data)}
                          >
                            Ya
                          </button>
                          <button
                            className="cancel-delete-button bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline ml-5"
                            onClick={handleCancelDelete}
                          >
                            Tidak
                          </button>
                        </>
                      ) : (
                        <button
                          className="hapus-data-button-dashboard bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                          onClick={handleDeleteConfirmation}
                        >
                          X
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {showPopup && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-lg font-bold mb-4">Error</h2>
              <p>{popupMessage}</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer></Footer>
    </div>
  );
};

export default Dashboard;
