import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export default function Navbar() {
  const { user, logout } = useAuth(); const navigate = useNavigate()
  return <header className="navbar"><Link className="brand" to="/dashboard"><span>♥</span> HeartPredict</Link><nav>{user && <><NavLink to="/dashboard">Dashboard</NavLink><NavLink to="/predict">Predict</NavLink><NavLink to="/history">History</NavLink><NavLink to="/profile">Profile</NavLink></>}{user ? <button className="link-btn" onClick={() => {logout(); navigate('/')}}>Logout</button> : <><NavLink to="/login">Login</NavLink><Link className="nav-cta" to="/signup">Sign up</Link></>}</nav></header>
}
