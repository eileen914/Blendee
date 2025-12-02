import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { NewUserPrompt } from "./pages/NewUserPrompt";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { WelcomeAnimation } from "./pages/WelcomeAnimation";
import { Home } from "./pages/Home";
import { CreateRoom } from "./pages/CreateRoom";
import { RoomDetail } from "./pages/RoomDetail";
import { MyPage } from "./pages/MyPage";
import { ParticipatedPosts } from "./pages/ParticipatedPosts";
import { MyPosts } from "./pages/MyPosts";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/new-user" element={<NewUserPrompt />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/welcome" element={<WelcomeAnimation />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/room/:id" element={<RoomDetail />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/participated" element={<ParticipatedPosts />} />
        <Route path="/mypage/my-posts" element={<MyPosts />} />
      </Routes>
    </BrowserRouter>
  );
}
