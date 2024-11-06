import { Menu, X } from "lucide-react";
import { useState,useEffect } from "react";
import logo from "../assets/logo.png";
import { navItems } from "../constants";


const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [authUser, setAuthUser] = useState(false); // Add this state to track user authentication

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  useEffect(() => {
    const token = getCookie("token"); // Retrieve the token from cookies
    console.log("in NavBar Token:", token);
    setAuthUser(!!token);
  }, []);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleLogout = () => {
    // Step 1: Clear authentication cookies
    document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Clear the cookie
  
    // Step 2: Update state
    setAuthUser(false); // Update the authUser state to false
  
    // Step 3: Redirect to home page or login page
    window.location.href = '/'; // Redirecting to home
  };
  

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <a href="/">
              <img className="h-10 w-14 mr-1" src={logo} alt="Logo" />
            </a>
            <a href="/">
              <span className="text-xl tracking-tight">CrispColon</span>
            </a>
          </div>
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex justify-center space-x-12 items-center">
            {authUser ? ( // Check if the user is authenticated
              <>
                <button
                  onClick={handleLogout}
                  className="py-2 px-3 border rounded-md"
                >
                  Logout
                </button>
                <a href="/profile" className="py-2 px-3 border rounded-md">
                  Profile
                </a>
              </>
            ) : (
              <>
                <a href="/login" className="py-2 px-3 border rounded-md">
                  Login
                </a>
                <a
                  href="/signup"
                  className="bg-gradient-to-r from-orange-500 to-orange-800 py-2 px-3 rounded-md"
                >
                  Create an account
                </a>
              </>
            )}
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6">
              {authUser ? ( // Check if the user is authenticated for mobile view
                <>
                  <a href="/profile" className="py-2 px-3 border rounded-md">
                    Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="py-2 px-3 border rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className="py-2 px-3 border rounded-md">
                    Login
                  </a>
                  <a
                    href="/signup"
                    className="py-2 px-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800"
                  >
                    Create an account
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
