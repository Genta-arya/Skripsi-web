import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Detail from "./Detaildata";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch, faArrowUp } from "@fortawesome/free-solid-svg-icons";

import Footer from "../footer/layout.footer";

const DetailPage = () => {
  const location = useLocation();
  const detailData = location.state?.detailData;
  const idKecamatan = detailData ? detailData[0].id_kecamatan : null;

  
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = () => {
    if (window.pageYOffset > 200) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };
  const handlePosting = () => {
    navigate("/posting-pembangunan", {
      state: { idKecamatan, namaKecamatan: detailData[0].nama_kecamatan },
    });
  };
  const HistoryPembangunan = () => {
    navigate("/posting-pembangunan");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter data dengan id_kecamatan yang sama dan sesuai dengan pencarian
  const filteredData = detailData.filter((data) => {
    const pembangunan = data.judul.toLowerCase();
    const query = searchQuery.toLowerCase();
    return data.id_kecamatan === idKecamatan && pembangunan.includes(query);
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="bg-blue-500 py-4">
        <h1 className="text-white text-3xl font-bold text-center">
          Daftar Pembangunan
        </h1>
        <h2 className="text-white text-3xl font-bold text-center">
          Kecamatan {detailData[0].nama_kecamatan}
        </h2>
      </nav>
      <div className="container mx-auto mt-3">
        <div className="flex justify-end">
          <Link
            to="/dashboard"
            className="text-blue-500 hover:text-blue-700 mb-5 ml-5"
          >
            > Kembali ke Dashboard
          </Link>
        </div>
        <div className="relative justify-center">
          <div className="flex items-center px-3">
            <FontAwesomeIcon
              icon={faSearch}
              className="h-5 w-5 text-gray-400 mr-1"
            />
            <input
              type="text"
              className="px-4 py-2 pl-8 border border-gray-300 rounded-lg w-50 mr-3"
              placeholder="Cari pembangunan"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg mr-4 "
              onClick={handlePosting}
            >
              Tambah Data Pembangunan
            </button>
          </div>
        </div>

        <div className="">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {filteredData.length > 0 ? (
              filteredData.map((data) => (
                <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-300 dark:border-gray-700 mt-7">
                  <Detail key={data.id} data={data} />
                </div>
              ))
            ) : (
              <div className=" ">
                <p className="text 1xl text-gray-500 mt-5 ml-10">
                  Pembangunan yang dicari tidak ditemukan.
                </p>
              </div>
            )}
          </div>
        </div>
        {showScrollButton && (
          <div
            className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full cursor-pointer flex justify-center items-center"
            onClick={scrollToTop}
          >
            <FontAwesomeIcon icon={faArrowUp} className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPage;
