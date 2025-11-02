import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { CreateRoom } from './pages/CreateRoom';
import { RoomDetail } from './pages/RoomDetail';
import { Feed } from './pages/Feed';
export function App() {
  return <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/room/:id" element={<RoomDetail />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </BrowserRouter>;
}