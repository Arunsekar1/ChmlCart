import React, { useEffect } from 'react'
import MetaData from './layouts/MetaData'
import { useDispatch } from 'react-redux'
import { getProducts } from '../actions/productsActions';
import { useSelector } from 'react-redux';
import Loader from './layouts/Loader';
import Product from './Product/Product';
import { toast } from 'react-toastify';

export default function Home() {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector(state => state.productsState)

    useEffect(() => {
        if(error){
            return toast.error(error,{
                position:'bottom-center'
            });
        }
        dispatch(getProducts)
    }, [dispatch,error])

    return (
        <>
        {loading ? <Loader/> : null }
        <>
            <MetaData title={'Buy Best Products'} />
            <h1 id="products_heading">Latest Products</h1>
            <section id="products" className="container mt-5">
                <div className="row">
                    {products && products.map((product) => (
                        <Product product={product}/>
                    ))}
                </div>
            </section>
        </>
        </>
    )
}
