import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/layouts/Header'
import Home from './components/Home'
import Footer from './components/layouts/Footer'
import { HelmetProvider } from '@dr.pogodin/react-helmet'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import ProductDetail from './components/Product/ProductDetail'

function App() {

  return (
    <Router>
      <>
        <HelmetProvider>
          <Header />
          <div className='container container-fluid'>
            <ToastContainer theme='dark' />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/product/:id' element={<ProductDetail />} />
            </Routes>
          </div>
          <Footer />
        </HelmetProvider>
      </>
    </Router>
  )
}

export default App
