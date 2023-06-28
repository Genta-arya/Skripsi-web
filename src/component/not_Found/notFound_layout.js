import React from "react";
import { Link } from "react-router-dom";
import background from "../../assets/not_found.png";
import Footer from "../footer/layout.footer";

const DetailNotFound = () => {
  return (
    <div className="container mx-auto mt-3">
      <div className="flex justify-center items-center h-96 mt-5">
        <div
          className="bg-cover bg-center w-full h-full"
          style={{
            backgroundImage: `url(${background})`,
          }}
        ></div>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Data tidak ditemukan</h2>
        <p>Mohon maaf, Data Pembangunan tidak ditemukan.</p>
        <div className="mt-5">
          <Link
            to="/dashboard"
            className="text-blue-500 hover:text-blue-700 mr-3"
          >
            Kembali ke Dashboard
          </Link>
          <Link
            to="/tambah-data"
            className="text-green-500 hover:text-green-700"
          >
            Ingin tambah data?
          </Link>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default DetailNotFound;
