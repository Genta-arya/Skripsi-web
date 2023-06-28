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
        
        <h2 className="text-2xl font-bold mb-4">Upss , Halaman Tidak ditemukan</h2>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default DetailNotFound;
