import React from 'react';
import Search from './Search';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown, Image } from 'react-bootstrap';
import { logout } from '../../actions/userActions';

export default function Header() {
  const { isAuthenticated, user } = useSelector(state => state.authState);
  const { items: cartItems } = useSelector(state => state.cartState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
  }

  return (
    <>
      <nav className="navbar row navbar navbar-expand px-3 px-md-4">
        <div className="col-12 col-md-3">
          <div className="navbar-brand">
            <Link to='/'>
              <img width="150px" src="/images/logo.png" />
            </Link>
          </div>
        </div>

        <div className="col-12 col-md-6 mt-2 mt-md-0 text-center">
          <Search />
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          {isAuthenticated ?
            (
              <Dropdown className='d-inline'>
                <Dropdown.Toggle id='dropdown-basic' variant='default text-white pe-5'>
                  <figure className='avatar avatar-nav'>
                    <Image width="50px" src={user?.avatar ?? './images/default_avatar.png'} />
                  </figure>
                  <span>{user?.name}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {user.role === 'admin' && <Dropdown.Item onClick={() => { navigate('/admin/dashboard') }} className='text-dark'>Dashboard</Dropdown.Item>}
                  <Dropdown.Item onClick={() => { navigate('/myprofile') }} className='text-dark' >Profile</Dropdown.Item>
                  <Dropdown.Item onClick={() => { navigate('/orders') }} className='text-dark'>Orders</Dropdown.Item>
                  <Dropdown.Item onClick={logoutHandler} className='text-danger' >Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) :
            <Link to='/login' className="btn" id="login_btn">Login</Link>
          }
          <Link to="/cart" style={{ textDecoration: "none" }}><span id="cart" className="ms-3">Cart</span></Link>
          <span className="ms-1" id="cart_count">{cartItems.length}</span>
        </div>
      </nav>
    </>
  )
}
