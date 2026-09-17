import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  login as loginUser,
  getCurrentUser,
} from "../services/authService";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    async function loadCurrentUser() {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Authentication error:", error.message);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadCurrentUser();
  }, []);

  async function login(username, password) {
    const data = await loginUser(username, password);

    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);

    const user = await getCurrentUser();

    setCurrentUser(user);

    return user;
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setCurrentUser(null);

    navigate("/login");
  }

  const value = {
    currentUser: currentUser,
    isAuthenticated: currentUser !== null,
    loading: loading,
    login: login,
    logout: logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;



















// import { createContext, useEffect, useState } from "react";
// import {
//   login as loginUser,
//   getCurrentUser,
// } from "../services/authService";

// export const AuthContext = createContext();

// function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(function () {
//     async function loadCurrentUser() {
//       const accessToken = localStorage.getItem("accessToken");

//       if (!accessToken) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const user = await getCurrentUser();
//         setCurrentUser(user);
//       } catch (error) {
//         console.error("Authentication error:", error.message);

//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");

//         setCurrentUser(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadCurrentUser();
//   }, []);

//   async function login(username, password) {
//     const data = await loginUser(username, password);

//     localStorage.setItem("accessToken", data.access);
//     localStorage.setItem("refreshToken", data.refresh);

//     const user = await getCurrentUser();

//     setCurrentUser(user);

//     return user;
//   }

//   function logout() {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");

//     setCurrentUser(null);
//   }

//   const value = {
//     currentUser: currentUser,
//     isAuthenticated: currentUser !== null,
//     loading: loading,
//     login: login,
//     logout: logout,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export default AuthProvider;













// // import { createContext, useEffect, useState } from "react";
// // import {
// //   login as loginUser,
// //   getCurrentUser,
// // } from "../services/authService";

// // export const AuthContext = createContext();

// // function AuthProvider({ children }) {
// //   const [currentUser, setCurrentUser] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(function () {
// //     async function loadCurrentUser() {
// //       const accessToken = localStorage.getItem("accessToken");

// //       if (!accessToken) {
// //         setLoading(false);
// //         return;
// //       }

// //       try {
// //         const user = await getCurrentUser();
// //         setCurrentUser(user);
// //       } catch (error) {
// //         console.error("Authentication error:", error.message);

// //         localStorage.removeItem("accessToken");
// //         localStorage.removeItem("refreshToken");

// //         setCurrentUser(null);
// //       } finally {
// //         setLoading(false);
// //       }
// //     }

// //     loadCurrentUser();
// //   }, []);

// //   async function login(username, password) {
// //     const data = await loginUser(username, password);

// //     localStorage.setItem("accessToken", data.access);
// //     localStorage.setItem("refreshToken", data.refresh);

// //     const user = await getCurrentUser();

// //     setCurrentUser(user);

// //     return user;
// //   }

// //   const value = {
// //     currentUser: currentUser,
// //     isAuthenticated: currentUser !== null,
// //     loading: loading,
// //     login: login,
// //   };

// //   return (
// //     <AuthContext.Provider value={value}>
// //       {children}
// //     </AuthContext.Provider>
// //   );


// //   function logout() {
// //   localStorage.removeItem("accessToken");
// //   localStorage.removeItem("refreshToken");

// //   setCurrentUser(null);
// // }

// //   const value = {
// //     currentUser: currentUser,
// //     isAuthenticated: currentUser !== null,
// //     loading: loading,
// //     login: login,
// //     logout: logout,
// //   };
// //   return (
// //     <AuthContext.Provider value={value}>
// //       {children}
// //     </AuthContext.Provider>
// //   );

// // }

// // export default AuthProvider;