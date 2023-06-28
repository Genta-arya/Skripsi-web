import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Details } from "../../service/api";
import { useNavigate } from "react-router-dom";

const DetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setDetailPembangunan] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const url = "http://192.168.1.21:3002";

  useEffect(() => {
    const fetchDetailPembangunan = async () => {
      try {
        const detailData = await Details(id);
        setDetailPembangunan(detailData);
        console.log({ datas: detailData });
      } catch (error) {
        console.error("Gagal memuat detail pembangunan:", error);
      }
    };

    fetchDetailPembangunan();
  }, [id]);
  const handleEdit = () => {
    // navigate("/edit");
  };

  const nextImage = () => {
    if (data && data.gambar1 && data.gambar2 && data.gambar3) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 3);
    }
  };

  const previousImage = () => {
    if (data && data.gambar1 && data.gambar2 && data.gambar3) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? 2 : prevIndex - 1
      );
    }
  };

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-gray-500">Memuat detail pembangunan...</p>
      </div>
    );
  }

  const baseUrl = `${url}/halaman`; 

  const renderImages = () => {
    if (!data) {
      return null;
    }

    const gambarKeys = ["gambar1", "gambar2", "gambar3"];

    return gambarKeys.map((gambarKey, index) => {
      const gambar = data[gambarKey];

      if (!gambar) {
        return null;
      }

      return (
        <img
          key={index}
          src={`${baseUrl}/${data.id}/${gambar}`}
          alt="Gambar Pembangunan"
          className={`object-cover w-full shadow-sm h-full ${
            index === currentImageIndex ? "visible" : "hidden"
          }`}
        />
      );
    });
  };

  return (
    <div className=" bg-gray-200">
      <div className="px-10 py-6 mx-auto  bg-gray-200">
        <h2 className=" h-100 px-2 py-1 flex items-center justify-center  mt-4 mb-4 sm:text-3xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-black-500 bg-gray-300 rounded-lg">
          Detail Pembangunan
        </h2>
        <div className="max-w-4xl px-10 py-6 mx-auto bg-white rounded">
          <a className="block transition duration-200 ease-out transform hover:scale-110 relative">
            {renderImages()}
            <button
              className="absolute top-1/2 transform -translate-y-1/2 left-2 bg-white opacity-80 hover:opacity-100 rounded-full p-2 shadow-md"
              onClick={previousImage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className="absolute top-1/2 transform -translate-y-1/2 right-2 bg-white opacity-80 hover:opacity-100 rounded-full p-2 shadow-md "
              onClick={nextImage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </a>

          <div className="flex items-center justify-start mt-12 mb-4 ">
            <a className="px-2 py-1 font-bold bg-red-400 text-white rounded-lg hover:bg-gray-500 mr-2">
              Kode Pos :
            </a>
            <a className="px-2 py-1 font-bold bg-red-400 text-white  rounded-lg hover:bg-gray-500 mr-4">
              {data.id_kecamatan}
            </a>
          </div>
          <div className="mt-2">
            <a className="sm:text-3xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-black-500  ">
              {data.nama_kecamatan}
            </a>

            <div className="font-light text-gray-600">
              <a href="#" className="flex items-center mt-6 mb-6">
                <h1 className="font-bold text-gray-700 hover:underline">
                  Bidang :
                </h1>
              </a>
              <div className="flex flex-col">
                <input
                  type="text"
                  value={data.bidang}
                  readOnly
                  className=" text-lg font-bold mb-2 border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
            </div>

            <div className="font-light text-gray-600">
              <a href="#" className="flex items-center mt-6 mb-6">
                <h1 className="font-bold text-gray-700 hover:underline">
                  Judul Pekerjaan :
                </h1>
              </a>
              <div className="flex flex-col">
                <input
                  type="text"
                  value={data.judul}
                  readOnly
                  className=" text-lg font-bold mb-2 border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
            </div>

            <div className="font-light text-gray-600">
              <a href="#" className="flex items-center mt-6 mb-6">
                <h1 className="font-bold text-gray-700 hover:underline">
                  Lokasi :
                </h1>
              </a>
              <div className="flex flex-col">
                <input
                  type="text"
                  value={data.lokasi}
                  readOnly
                  className=" text-lg font-bold mb-2 border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
            </div>

            <div className="font-light text-gray-600">
              <a href="#" className="flex items-center mt-6 mb-6">
                <h1 className="font-bold text-gray-700 hover:underline">
                  Tahun Pembangunan :
                </h1>
              </a>
              <div className="flex flex-col">
                <input
                  type="text"
                  value={data.tahun}
                  readOnly
                  className=" text-lg font-bold mb-2 border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
            </div>
            <div className="font-light text-gray-600">
              <a href="#" className="flex items-center mt-6 mb-6">
                <h1 className="font-bold text-gray-700 hover:underline">
                  Dana Anggaran :
                </h1>
              </a>
              <div className="flex flex-col">
                <input
                  type="text"
                  value={data.anggaran}
                  readOnly
                  className=" text-lg font-bold mb-2 border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
            </div>
            <div className="font-light text-gray-600">
              <a href="#" className="flex items-center mt-6 mb-6">
                <h1 className="font-bold text-gray-700 hover:underline">
                  Titik Koordinat :
                </h1>
              </a>
              <div className="flex flex-col">
                <input
                  type="text"
                  value={data.koordinat}
                  readOnly
                  className=" text-lg font-bold mb-2 border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
            </div>
          </div>

          <button
            className="bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600 ml-5 mt-5"
            onClick={handleEdit}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
