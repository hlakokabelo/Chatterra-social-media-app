import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import NavBar from "./components/navigation/NavBar";
import CreatePostPage from "./pages/CreatePostPage";
import PostPage from "./pages/PostPage";
import CreateCommunityPage from "./pages/CreateCommunityPage";
import CommunitiesPage from "./pages/CommunitiesPage";
import CommunityPage from "./pages/CommunityPage";
import SignInPage from "./pages/authPages/SignInPage";
import SignUpPage from "./pages/authPages/SignUpPage";
import EditProfilePage from "./pages/EditProfilePage";
import PageNotFound from "./pages/PageNotFound";
import PrivateRoutes from "./utils/PrivateRoutes";
import { ROUTES } from "./utils/routes";
import { Footer } from "./components/Footer";
import PublicProfilePage from "./pages/PublicProfilePage";

function App() {
  return (
    <div className="min-h-screen mt-10 bg-gray-950 text-gray-100">
      {/* Simple gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"></div>

      {/* Simple pattern overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800/20 via-transparent to-transparent"></div>

      <NavBar />

      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route element={<PrivateRoutes />}>
              <Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
              <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
            </Route>
            <Route path="/community/:id/:slug?" element={<CommunityPage />} />
            <Route
              path={ROUTES.CREATE_COMMUNITY}
              element={<CreateCommunityPage />}
            />
            <Route path={ROUTES.COMMUNITIES} element={<CommunitiesPage />} />
            <Route path="/post/:id/:slug?" element={<PostPage />} />
            <Route path={ROUTES.CREATE_POST} element={<CreatePostPage />} />
            <Route path="/user/:username" element={<PublicProfilePage />} />
            <Route path="/u/:username" element={<PublicProfilePage />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="robots.txt" element={<>text</>} />
            <Route path={ROUTES.EDIT_PROFILE} element={<EditProfilePage />} />
          </Routes>
        </div>
      </main>

     <Footer/>
    </div>
  );
}

export default App;
