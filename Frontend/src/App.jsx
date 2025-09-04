import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/layouts/Header'
import Home from './components/Home'
import Footer from './components/layouts/Footer'
import { HelmetProvider } from '@dr.pogodin/react-helmet'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import ProductDetail from './components/Product/ProductDetail'
import ProductSearch from './components/Product/ProductSearch'
import Login from './components/user/Login'
import Register from './components/user/Register'
import store from './store'
import { useEffect } from 'react'
import { loadUser } from './actions/userActions'
import Profile from './components/user/Profile'
import ProtectedRoute from './components/route/ProtectedRoute'
import UpdateProfile from './components/user/UpdateProfile'
import UpdatePassword from './components/user/UpdatePassword'
import ForgotPassword from './components/user/ForgotPassword'
import ResetPassword from './components/user/ResetPassword'

function App() {

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Router>
      <>
        <HelmetProvider>
          <Header />
          <div className='container container-fluid'>
            <ToastContainer theme='dark' />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/search/:keyword' element={<ProductSearch />} />
              <Route path='/product/:id' element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/myprofile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/myprofile/update" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
              <Route path="/myprofile/update/password" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
              <Route path="/password/forgot" element={<ForgotPassword />} />
              <Route path="/password/reset/:token" element={<ResetPassword />} />
            </Routes>
          </div>
          <Footer />
        </HelmetProvider>
      </>
    </Router>
  )
}

export default App
