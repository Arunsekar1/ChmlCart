import React from 'react'

export default function Header() {
  return (
    <>
      <nav className="navbar row navbar navbar-expand px-3 px-md-4">
      <div className="col-12 col-md-3">
        <div className="navbar-brand">
          <img width="150px" src="/images/logo.png" />
        </div>
      </div>

      <div className="col-12 col-md-6 mt-2 mt-md-0 text-center">
        <div className="input-group">
          <input
            type="text"
            id="search_field"
            className="form-control"
            placeholder="Enter Product Name ..."
          />
            <button id="search_btn" className="btn">
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
        </div>
      </div>

      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
        <button className="btn" id="login_btn">Login</button>

        <span id="cart" className="ms-3">Cart</span>
        <span className="ms-1" id="cart_count">2</span>
      </div>
    </nav>
    </>
  )
}
