import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, updateProduct } from '../../actions/productActions';
import { toast } from 'react-toastify'
import { clearProductUpdated ,clearError } from '../../slices/productSlice';

export default function UpdateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [seller, setSeller] = useState("");
  const [images, setImages] = useState([]);
  const [imagesCleared, setImagesCleared] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([]);
  const { id: productId } = useParams();

  const { loading, isProductUpdated, error, product } = useSelector(state => state.productState)

  const categories = [
    'Electronics',
    'Mobile Phones',
    'Laptops',
    'Accessories',
    'Headphones',
    'Food',
    'Books',
    'Clothes/Shoes',
    'Beauty/Health',
    'Sports',
    'Outdoor',
    'Home'
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onImagesChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState == 2) {
          setImagesPreview(oldArray => [...oldArray, reader.result])
          setImages(oldArray => [...oldArray, file])
        }
      }
      reader.readAsDataURL(file)
    })

  }

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('description', description);
    formData.append('seller', seller);
    formData.append('category', category);
    images.forEach(image => (
      formData.append('images', image)
    ))
    formData.append('imagesCleared', imagesCleared);
    dispatch(updateProduct(productId, formData))
  }

  const clearImagesHandler = () => {
    setImages([]);
    setImagesPreview([]);
    setImagesCleared(true);
  }


  useEffect(() => {
    if (isProductUpdated) {
      toast('Product Update Successfully', {
        type: 'success',
        position: 'bottom-center',
        onOpen: () => dispatch(clearProductUpdated())
      })
      return;
    }

    if (error) {
      toast.error(error, {
        position: 'bottom-center',
        type: 'error',
        onOpen: () => { dispatch(clearError()) }
      });
      return;
    }
    dispatch(getProduct(productId))
  }, [isProductUpdated, error, dispatch])

  useEffect(() => {
    if (product._id) {
      setName(product.name);
      setPrice(product.price);
      setStock(product.stock);
      setDescription(product.description);
      setSeller(product.seller);
      setCategory(product.category);

      let images = [];
      product.images.forEach(image => {
        images.push(image.image)
      });
      setImagesPreview(images)
    }
  }, [product])

  return (
    <div className='row'>
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <>
          <div className="login-styles">
            <div className="w-100 login-style" style={{ maxWidth: "450px" }}>
              <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
                <h1 className="mb-4">Update Product</h1>

                <div className="mb-3">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="text"
                    id="name_field"
                    className="form-control"
                    onChange={e => setName(e.target.value)}
                    value={name}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="price_field">Price</label>
                  <input
                    type="text"
                    id="price_field"
                    className="form-control"
                    onChange={e => setPrice(e.target.value)}
                    value={price}
                  />
                </div>

                <div className='mb-3'>
                  <label htmlFor="description_field">Description</label>
                  <textarea
                    className="form-control"
                    id="description_field"
                    rows="8"
                    onChange={e => setDescription(e.target.value)}
                    value={description}>
                  </textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="category_field">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="form-control" id="category_field">
                    <option value="" >Select</option>
                    {categories.map(category => (
                      <option value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="stock_field">Stock</label>
                  <input
                    type="number"
                    id="stock_field"
                    className="form-control"
                    onChange={e => setStock(e.target.value)}
                    value={stock}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="seller_field">Seller Name</label>
                  <input
                    type="text"
                    id="seller_field"
                    className="form-control"
                    onChange={e => setSeller(e.target.value)}
                    value={seller}
                  />
                </div>

                {/* Images Upload */}
                <div className="mb-3">
                  <label className="form-label">Images</label>
                  <div style={{
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",
                    width: "100%"
                  }}>
                    <span style={{
                      padding: "6px 12px",
                      flex: 1,
                      color: "#6c757d",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      {images.length > 0 ? images.map(img => img.name).join(", ") : "Choose Images"}
                    </span>
                    <label
                      htmlFor="product_images"
                      style={{
                        background: "#e9ecef",
                        padding: "6px 12px",
                        cursor: "pointer",
                        margin: 0,
                        whiteSpace: "nowrap"
                      }}
                    >
                      Browse
                    </label>
                  </div>
                  <input
                    type="file"
                    name="product_images"
                    id="product_images"
                    multiple
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={onImagesChange}
                  />
                  {imagesPreview.length > 0 && <span className='me-2' onClick={clearImagesHandler} style={{ cursor: "pointer" }}><i className='fa fa-trash'></i></span>}
                  {imagesPreview.map(image => (
                    <img
                      className='mt-3 me-2'
                      key={image}
                      src={image}
                      alt="Image Preview"
                      width="55"
                      height="55"
                    />
                  ))}
                </div>



                <button
                  id="create_button"
                  type="submit"
                  className="btn w-100 py-3"
                  disabled={loading}
                >
                  UPDATE
                </button>

              </form>
            </div>
          </div>
        </>
      </div>
    </div>
  )
}
