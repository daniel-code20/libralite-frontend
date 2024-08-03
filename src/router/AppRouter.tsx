import { Navigate, Route, Routes } from 'react-router-dom';
import {
  PrincipalPage,
  BookDetail,
  CategoryDetail,
  BuyPage,
  ReservationPage,
  Login,
  SignUp,
} from '../pages/';
import { AdminPrincipalPage } from '../admin/pages/AdminPrincipalPage';
import { AdminCategoryDetail } from '../admin/pages/AdminCategoryDetail';
import { AdminBookDetail } from '../admin/pages/AdminBookDetail';
import React from 'react';
import { BuysList } from '../components/BuysList';
import { ReservationList } from '../components/ReservationList';
import { AdminBuysList } from '../admin/components/AdminBuysList';
import { AdminReservationList } from '../admin/components/AdminReservationList';



export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="principal" element={<PrincipalPage />} />
        <Route path="admin-principal" element={<AdminPrincipalPage />} />
        <Route path="/book/:id" element={<BookDetail />} />
        <Route path="/admin-book/:id" element={<AdminBookDetail />} />
        <Route path="/category/:id" element={<CategoryDetail />} />
        <Route path="/admin-category/:id" element={<AdminCategoryDetail />} />
        <Route path="/buy/:id" element={<BuyPage userId={''} />} />
        <Route path="/reservation/:id" element={<ReservationPage userId={''} />} />
        <Route path="/buyslist" element={<BuysList />} />
        <Route path="/admin-buyslist" element={<AdminBuysList />} />
        <Route path="/reservationlist" element={<ReservationList />} />
        <Route path="/admin-reservationlist" element={<AdminReservationList />} />
      </Routes>
    </>
  );
};
