import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../../component/dashboard/layout.dasboard';
import DLogin from '../../component/login/layout.login';
import Post from '../../component/dashboard/posting_Kecamatan/layout.posting';
import Log from '../../component/dashboard/log_Kecamatan/layout.log';
import Oboard from '../../component/on_Boarding/onboarding';
import DetailPage from '../../component/list_Pembangunan/layout.detail';
import Page from '../../component/detail_Page/DetailPage';
import NotFound from '../../component/not_Found/notFound_layout';
import Post_NotFound from '../../component/post_notfound';
import PostingPembangunan from '../../component/detail_Page/pembangunanPosting';
import Nothing from '../../component/not_Found/404'
import Update from '../../component/dashboard/edit_Kecamatan/edit'
import '../../style/index.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Oboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<DLogin />} />
          <Route path="/posting" element={<Post />} />
          <Route path="/tambah-data" element={<Post_NotFound />} />
          <Route path="/log" element={<Log />} />
          <Route path="/update" element={<Update />} />
          <Route path="/halaman/:id" element={<Page />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/404" element={<Nothing />} />
          <Route path="/posting-pembangunan" element={<PostingPembangunan />} />
          <Route path="/detail/:id_kecamatan" element={<DetailPage />} />
          <Route path="*" element={<Navigate to="/404" />} />
         
          
        </Routes>
      </div>
    </Router>
  );
};

export default App;
