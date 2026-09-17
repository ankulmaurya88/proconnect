import Header from "./Header";
import Footer from "./Footer";
import "../styles/Layout.css";
function CommonLayout({ children }) {
  return (
    <div className="common-layout">

      <Header />

      <main className="main-content">
        {children}
      </main>

      <Footer />

    </div>
  );
}

export default CommonLayout;