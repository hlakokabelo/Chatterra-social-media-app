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
import EditProfilePage from "./pages/EditProfilePage";
import PageNotFound from "./pages/PageNotFound";
import PrivateRoutes from "./utils/PrivateRoutes";
import PublicProfilePage from "./pages/PublicProfilePage ";
import { ROUTES } from "./utils/routes";

function App() {
  return (
    <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20">
      <NavBar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />

          {/* Register */}
          <Route element={<PrivateRoutes />}>
            <Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
            <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
          </Route>

          {/* Communities */}
          <Route path="/community/:id/:slug?" element={<CommunityPage />} />

          <Route
            path={ROUTES.CREATE_COMMUNITY}
            element={<CreateCommunityPage />}
          />
          <Route path={ROUTES.COMMUNITIES} element={<CommunitiesPage />} />
          {/* Posts */}
          <Route path="/post/:id/:slug?" element={<PostPage />} />
          <Route path={ROUTES.CREATE_POST} element={<CreatePostPage />} />
          {/* User Info */}
          <Route path="/user/:username" element={<PublicProfilePage />} />
          <Route path="/u/:username" element={<PublicProfilePage />} />
          {/* Catch-all */}
          <Route path="*" element={<PageNotFound />} />
          <Route path="robots.txt" element={<>text</>} />
          <Route path={ROUTES.EDIT_PROFILE} element={<EditProfilePage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
