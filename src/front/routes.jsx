// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Landing } from "./pages/Landing";
import { CreacionPost } from "./pages/CreacionPost";
import { RegisterForm } from "./pages/RegisterForm"
import { DataProfile } from "./pages/DataProfile"
import { CreateForo } from "./pages/CreateForo"
import { Profile } from "./pages/Profile";
import { Feed } from "./pages/Feed";
import { AllForos } from "./pages/AllForos";
import { PostView } from "./pages/PostView";
import { ForoPage } from "./pages/ForoPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
        <Route path="/data-profile" element={<DataProfile />} />
        <Route path="/create-foro" element={<CreateForo />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/foros" element={<AllForos/>}/>
        <Route path="/foro/:foro_id" element={<ForoPage/>}/>
        <Route path="/foro/:foro_id/create-post" element={<CreacionPost />}/>
        <Route path="/foro/:foro_id/post/:post_id" element={<PostView />} />
        <Route path="/profile/:id" element={<Profile />} />
      </Route>
    </>
  )
);