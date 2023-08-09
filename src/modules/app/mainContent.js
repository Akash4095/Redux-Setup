import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import User from '../task/pages/User';
import Project from '../task/pages/Project';
import Voucher from '../task/pages/Voucher';
import Sale from '../task/pages/Sale';
import Config from '../task/pages/Config';
import NestedMenuAppBar from '../task/components/Appbar';

const mainContent = () => {
  return (
    <BrowserRouter>
      <NestedMenuAppBar />
      <Routes>
        <Route path="user" element={<User />} />
        <Route path="project" element={<Project />} />
        <Route path="voucher" element={<Voucher />} />
        <Route path="sale" element={<Sale />} />
        <Route path="config" element={<Config />} />
      </Routes>
    </BrowserRouter>
  )
}

export default mainContent