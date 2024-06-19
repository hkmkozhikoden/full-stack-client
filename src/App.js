import './App.css';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Login from './pages/Login';
import Registration from './pages/Registration';
import { AuthContext } from './helpers/AuthContext';
import PageNotFound from './pages/PageNotFound';
import { UseState, useEffect, useContext } from 'react';
import axios from 'axios';
import Profile from './pages/Profile';
import ChangePassword from './pages/changePassword';

function Navbar() {
  const { authState, setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      username: "",
      id: 0,
      status: false,
    });
    navigate("/login"); // Navigate to login after setting the state
  };

  return (
    <div className='navbar'>
      {!authState.status ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/registration">Registration</Link>
        </>
      ) : (
        <>
          <Link to="/createposts">Create a Post</Link>
          <Link to="/">Home Page</Link>
        </>
      )}

      <div className="loggedInContainer">
        <h1>{authState.username}</h1>
        {authState.status && <button onClick={logout}>Logout</button>}
      </div>
    </div>
  );
}

function App() {
  const [authState, setAuthState] = UseState({
    username: "",
    id: 0,
    status: false,
  });
  const [loading, setLoading] = UseState(true);

  useEffect(() => {
    axios.get("http://localhost:3001/auth/auth", {
      headers: {
        accessToken: localStorage.getItem('accessToken'),
      }
    }).then((response) => {
      if (response.data.error) {
        setAuthState({ ...authState, status: false });
      } else {
        setAuthState({  
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
      }
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching auth state:", error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <Navbar />  {/* Include the Navbar component */}
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/createposts' element={<CreatePost />} />
            <Route path='/post/:id' element={<Post />} />
            <Route path='/login' element={<Login />} />
            <Route path='/registration' element={<Registration />} />
            <Route path='/profile/:id' element={<Profile />} />
            <Route path='/changepassword' element={<ChangePassword />} />
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
