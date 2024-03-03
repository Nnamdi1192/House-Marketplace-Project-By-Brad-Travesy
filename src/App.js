import "./App.css";
import {
  Explore,
  Offers,
  Profile,
  ForgotPassword,
  SignIn,
  SignUp,
  Category,
  CreateListing,
  SingleListing,
  Contact,
  EditListing,
} from "./pages";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/layout/NavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" index element={<Explore />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/profile" element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/category/:categoryName" element={<Category />} />
        <Route path="create-listing" element={<CreateListing />} />
        <Route
          path="/single-listing/:categoryType/:listingId"
          element={<SingleListing />}
        />
        <Route path="/contact/:listingId" element={<Contact />} />
        <Route path={`/edit-listing/:listingId`} element={<EditListing />} />
      </Routes>
      <NavBar />
      <ToastContainer />
    </div>
  );
}

export default App;
