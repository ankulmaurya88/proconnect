// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Home from "./pages/Home";
// import Profile from "./pages/Profile";
// import Networking from "./pages/Networking";
// import Messaging from "./pages/Messaging";

// import ProtectedRoute from "./routes/ProtectedRoute";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         <Route
//           path="/home"
//           element={
//             <ProtectedRoute>
//               <Home />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/profile"
//           element={
//             <ProtectedRoute>
//               <Profile />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/networking"
//           element={
//             <ProtectedRoute>
//               <Networking />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/messaging"
//           element={
//             <ProtectedRoute>
//               <Messaging />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Networking from "./pages/Networking";
import Messaging from "./pages/Messaging";

import CommonLayout from "./layout/CommonLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* Public pages */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* Protected pages with Header + Footer */}

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <CommonLayout>
              <Home />
            </CommonLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <CommonLayout>
              <Profile />
            </CommonLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/networking"
        element={
          <ProtectedRoute>
            <CommonLayout>
              <Networking />
            </CommonLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/messaging"
        element={
          <ProtectedRoute>
            <CommonLayout>
              <Messaging />
            </CommonLayout>
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;