import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'; import Login from './pages/Login'; import Signup from './pages/Signup'; import Dashboard from './pages/Dashboard'; import Prediction from './pages/Prediction'; import History from './pages/History'; import Profile from './pages/Profile'
export default function App(){return <BrowserRouter><AuthProvider><Layout><Routes><Route path="/" element={<Landing/>}/><Route path="/login" element={<Login/>}/><Route path="/signup" element={<Signup/>}/><Route element={<ProtectedRoute/>}><Route path="/dashboard" element={<Dashboard/>}/><Route path="/predict" element={<Prediction/>}/><Route path="/history" element={<History/>}/><Route path="/profile" element={<Profile/>}/></Route><Route path="*" element={<Landing/>}/></Routes></Layout></AuthProvider></BrowserRouter>}
