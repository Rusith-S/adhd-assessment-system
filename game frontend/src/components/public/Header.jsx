import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import logo from "../../assets/public/logo.png";

export default function Header() {
  const [currentUser, setCurrentUser] = useState(null);
  const path = useLocation().pathname;
  const navigate = useNavigate();

  // Check localStorage for user data and token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user"); // Get user data

    if (token && userData) {
      const user = JSON.parse(userData); // Parse stored JSON
      setCurrentUser(user); // Store user info in state
    }
  }, []);

  // Handle sign-out
  const handleSignout = () => {
    // Clear all related localStorage items
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);

    // Redirect to Sign In page
    navigate("/sign-in");
  };

  return (
    <Navbar className="bg-gray-200 shadow-lg py-0">
      <Link
        to="http://localhost:3000/Home"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white flex"
      >
        <div className="flex justify-center items-center gap-5">
          <img src={logo} className="h-16" alt="Company Logo" />
        </div>
      </Link>

      <div className="gap-2 md:order-2 my-auto flex">
        {/* Conditionally render user avatar or Sign In button */}
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={
                  currentUser.img ||
                  "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?t=st=1734322473~exp=1734326073~hmac=c93f070022466ff3b68694aa705563a44f6abe86d5765da63ad61d0b2bbc3750&w=740"
                }
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm font-medium truncate">
                {currentUser.fullName}
              </span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>

            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button color="blue">Sign In</Button>
          </Link>
        )}
        <Navbar.Toggle className="text-blue-600 hover:text-blue-800 focus:ring-blue-300" />
      </div>

      <Navbar.Collapse>
        <Navbar.Link
          active={path === "/emotion-starting-game"}
          as={"div"}
          style={{ color: path === "/emotion-starting-game" ? "#384ae2" : "#000" }}
          className="text-lg"
        >
          <Link to="/emotion-starting-game">Start New Game</Link>
        </Navbar.Link>
        <Navbar.Link
          active={path === "/emotion-records"}
          as={"div"}
          style={{ color: path === "/emotion-records" ? "#384ae2" : "#000" }}
          className="text-lg"
        >
          <Link to="/emotion-records">Emotion History</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
