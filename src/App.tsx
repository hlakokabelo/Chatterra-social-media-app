import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import CreatePostPage from "./pages/CreatePostPage";
import PostPage from "./pages/PostPage";
import CreateCommunityPage from "./pages/CreateCommunityPage";
import CommunitiesPage from "./pages/CommunitiesPage";
import CommunityPage from "./pages/CommunityPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20">
      <NavBar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />

          {/*Auth */}
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />

          {/*Communities */}
          <Route path="/community/:id" element={<CommunityPage />} />
          <Route path="/community/create" element={<CreateCommunityPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />

          {/*Posts*/}
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/create" element={<CreatePostPage />} />

          {/*User Info*/}
          <Route path="/u/:username" element={<>coming soon</>} />
          <Route path="/user/:username" element={<>coming soon</>} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Catch-all route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
