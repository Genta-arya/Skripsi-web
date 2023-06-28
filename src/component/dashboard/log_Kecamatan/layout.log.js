import React, { useEffect, useState } from "react";
import { getlog, getDetail, saveLogActivity } from "../../../service/api";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../../pagination/Pagination";
import backgroundProfil from "../../../assets/image.png";
import Footer from "../../footer/layout.footer";

const Log = () => {
  const navigate = useNavigate();
  const [kecamatanlist, setKecamatanlist] = useState([]);
  const url = "http://192.168.1.21:3002";

  const [loggedInUsername, setLoggedInUsername] = useState("");
  const [admin_Id, setAdminId] = useState(null);
  const [username, setUsername] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
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
    getlog()
      .then((response) => {
        setKecamatanlist(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const storedAdminId = localStorage.getItem("adminId");

    setLoggedInUsername(username);
    setAdminId(parseInt(storedAdminId));
  }, []);

  useEffect(() => {
    // Jika admin_Id tidak ada atau tidak valid, arahkan ke halaman login
    const storedAdminId = localStorage.getItem("adminId");
    if (!storedAdminId) {
      navigate("/");
    }
  }, [admin_Id, navigate]);

  const handleDashboard = () => {
    navigate("/dashboard");
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
                History Aktivitas
              </h1>
            </div>

            <div>
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg ml-4 mr-10"
                onClick={handleDashboard}
              >
                Dashboard
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
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(kecamatanlist.length / pageSize)}
            onPageChange={handlePageChange}
          />
          <div className="pagination flex items-center mb-10">
            <div className="mr-2">
              <label
                htmlFor="pageSize"
                className="block text-sm font-medium text-gray-700"
              >
                Tampilkan :
              </label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={500}>500</option>
              </select>
            </div>
            {/* Tambahkan komponen Pagination dengan properti yang sesuai */}
          </div>
          <table className="w-full border border-gray-300 mb-12">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border text-center ">Kode Pos</th>
                <th className="py-2 px-4 border text-center">Nama Kecamatan</th>
                <th className="py-2 px-4 border text-center">Deskripsi</th>
                <th className="py-2 px-4 border text-center">Gambar</th>
                <th className="py-2 px-4 border text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {displayedKecamatan.map((data) => (
                <tr key={data.id_kecamatan}>
                  <td className="py-2 px-4 border">{data.id_kecamatan}</td>
                  <td className="py-2 px-4 border">{data.nama_kecamatan}</td>
                  <td className="py-2 px-4 border">{data.deskripsi}</td>
                  <td className="py-2 px-4 border text-center">
                    {displayedKecamatan.map((log) => {
                      if (log.id === data.id) {
                        const gambarData = log.gambar;
                        const imgSrc = `${url}/log/${gambarData}`;
                        return (
                          <img
                            src={imgSrc}
                            alt="Gambar Kecamatan"
                            className="w-16 h-16 mx-auto"
                            style={{ width: "250px", height: "200px" }}
                          />
                        );
                      }
                    })}
                  </td>
                  <td className="py-2 px-4 border">{data.ket_act}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Log;
