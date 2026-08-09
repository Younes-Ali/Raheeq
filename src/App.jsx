import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'var(--dark-green-soft)',
            color: 'var(--beige)',
            border: '1px solid rgba(242,234,217,0.15)',
            fontFamily: "'Chewy', system-ui, sans-serif",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
