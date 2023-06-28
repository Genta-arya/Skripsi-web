import axios from "axios";
const API_URL = "http://192.168.1.21:3002";
const API_URLs = "http://192.168.1.21:3002/post/detail";
const API_URL_notif = "http://192.168.1.21:3002/api/notifikasi";

export const getKecamatan = () => {
  return axios
    .get(`${API_URL}/kecamatan`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const getlog = () => {
  return axios
    .get(`${API_URL}/log`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const getDetail = (id_kecamatan) => {
  const url = `${API_URL}/detail/${id_kecamatan}`;

  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => {
      throw error.response.data;
    });
};

export const getLogin = () => {
  return axios
    .get(`${API_URL}/admin`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username: username,
      password: password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postKecamatan = async (
  nama_kecamatan,
  id_kecamatan,
  deskripsi,
  gambar
) => {
  try {
    const formData = new FormData();
    formData.append("gambar", gambar);
    formData.append("nama_kecamatan", nama_kecamatan);
    formData.append("id_kecamatan", id_kecamatan);
    formData.append("deskripsi", deskripsi);

    const response = await axios.post(
      `${API_URL}/upload`,
      formData,
      { 
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data; // Assuming the server responds with a JSON object containing the success status and message
  } catch (error) {
    // console.error("Gagal mengirim data kecamatan:", error);
    throw new Error("id kecamatan telah tersedia.");
  }
};

export const saveLogActivity = async ({
  id_admin,
  status,
  nama_kecamatan,
  id_kecamatan,
  deskripsi,
  gambar,
}) => {
  try {
    const formData = new FormData();
    formData.append("gambar", gambar);
    formData.append("nama_kecamatan", nama_kecamatan);
    formData.append("id_kecamatan", id_kecamatan);
    formData.append("deskripsi", deskripsi);
    formData.append("id_admin", id_admin);
    formData.append("ket_act", status);

    const response = await axios.post(`${API_URL}/log`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Gagal mengirim data kecamatan:", error);
    throw new Error("id kecamatan telah tersedia.");
  }
};

export const deleteKecamatan = async (id_kecamatan) => {
  try {
    const response = await axios.delete(`${API_URL}/kecamatan/${id_kecamatan}`);
    const deletedData = response.data;
    return deletedData;
  } catch (error) {
    throw error;
  }
};

export const saveLogActivityDelete = async (logData) => {
  try {
    const response = await axios.post(`${API_URL}/logs`, logData);
    const savedLog = response.data;
    return savedLog;
  } catch (error) {
    throw error;
  }
};

export const isValidLogData = (logData) => {
  return (
    logData.id_admin !== null &&
    logData.nama_kecamatan !== null &&
    logData.id_kecamatan !== null &&
    logData.deskripsi !== null &&
    logData.gambar !== null
  );
};

export const postKonten = async (
  id_kecamatan,
  nama_kecamatan,
  bidang,
  judul,
  anggaran,
  lokasi,
  koordinat,
  tahun,
  gambar
) => {
  const formData = new FormData();
  formData.append("id_kecamatan", id_kecamatan);
  formData.append("nama_kecamatan", nama_kecamatan);
  formData.append("bidang", bidang);
  formData.append("judul", judul);
  formData.append("anggaran", anggaran);
  formData.append("lokasi", lokasi);
  formData.append("koordinat", koordinat);
  formData.append("tahun",tahun);

  for (let i = 0; i < gambar.length; i++) {
    formData.append("gambar", gambar[i]);
  }

  try {
    const response = await fetch(API_URLs, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Gagal menyimpan data kecamatan");
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error.message);
    throw error;
  }
};

export const deleteDetail = async (id_kecamatan) => {
  try {
    const response = await axios.delete(`${API_URL}/detail/${id_kecamatan}`);
    const deletedData = response.data;
    return deletedData;
  } catch (error) {
    throw error;
  }
};

export const Details = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/halaman/${id}`);
    const ressData = response.data;
    return ressData;
  } catch (error) {
    throw error;
  }
};


// export const kirimNotifikasi = async (notifikasi) => {
//   try {
//     const response = await axios.post(`${API_URL}/api/notifikasi`, notifikasi);
//     return response.data;
//   } catch (error) {
//     console.error('Gagal mengirim notifikasi:', error);
//     throw error;
//   }
// };

// export const kirimNotifikasi = async (notifikasi) => {
//   try {
//     const response = await axios.post(`${API_URL}/api/notifikasi`, notifikasi, {
//       headers: { 'Content-Type': 'multipart/form-data' }, // Tambahkan header untuk multipart/form-data
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Gagal mengirim notifikasi:', error);
//     throw error;
//   }
// };


export const kirimNotifikasi = async (
  id_kecamatan,
  nama_kecamatan,
  pesan,
  gambar
) => {
  const formData = new FormData();
  formData.append("id_kecamatan", id_kecamatan);
  formData.append("nama_kecamatan", nama_kecamatan);
  formData.append("pesan", pesan);
 
 

  for (let i = 0; i < gambar.length; i++) {
    formData.append("gambar", gambar[i]);
  }

  try {
    const response = await fetch(API_URL_notif, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Gagal menyimpan data notifikasi");
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error.message);
    throw error;
  }
};

export const deleteNotifikasi = async () => {
  try {
    const response = await axios.delete(API_URL_notif);
    
    if (response.status === 200) {
      console.log('Notifikasi berhasil dihapus');
    } else {
      console.error('Gagal menghapus notifikasi');
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat menghubungi server:', error);
  }
};