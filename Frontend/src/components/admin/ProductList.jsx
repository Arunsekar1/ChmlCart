import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import DataTable from 'react-data-table-component'
import Sidebar from './Sidebar'
import Loader from '../layouts/Loader'

import { getAdminProducts, deleteProduct } from '../../actions/productActions'
import { clearError } from '../../slices/productsSlice'
import { clearProductDeleted } from '../../slices/productSlice'

export default function ProductList() {
    const { products = [], loading = true, error } = useSelector((state) => state.productsState)
    const { isProductDeleted, error: productError } = useSelector((state) => state.productState)
    const dispatch = useDispatch()

    const [filterText, setFilterText] = useState('')
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
    const [entries, setEntries] = useState(10)
    const [page, setPage] = useState(1)

    useEffect(() => {
        if (error || productError) {
            toast(error || productError, {
                position: 'bottom-center',
                type: 'error',
                onOpen: () => {
                    dispatch(clearError())
                },
            })
            return
        }
        if (isProductDeleted) {
            toast('Product Deleted Successfully', {
                type: 'success',
                position: 'bottom-center',
                onOpen: () => dispatch(clearProductDeleted()),
            })
            return
        }

        dispatch(getAdminProducts())
    }, [dispatch, error, productError, isProductDeleted])

    const deleteHandler = (e, id) => {
        e.target.disabled = true
        dispatch(deleteProduct(id))
    }

    // filter products
    const filteredData = useMemo(() => {
        if (!filterText) return products
        return products.filter(
            (p) =>
                p._id.toLowerCase().includes(filterText.toLowerCase()) ||
                p.name.toLowerCase().includes(filterText.toLowerCase())
        )
    }, [products, filterText])

    // columns for DataTable
    const columns = [
        {
            name: 'ID',
            selector: (row) => row._id,
            sortable: true,
        },
        {
            name: 'Name',
            selector: (row) => row.name,
            sortable: true,
            minWidth:"450px"
        },
        {
            name: 'Price',
            selector: (row) => `$${row.price}`,
            sortable: true,
        },
        {
            name: 'Stock',
            selector: (row) => row.stock,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <>
                    <Link
                        to={`/admin/product/${row._id}`}
                        className="btn btn-primary btn-sm"
                    >
                        <i className="fa fa-pencil"></i>
                    </Link>
                    <Button
                        onClick={(e) => deleteHandler(e, row._id)}
                        className="btn btn-danger btn-sm ms-2"
                    >
                        <i className="fa fa-trash"></i>
                    </Button>
                </>
            ),
        },
    ]

    const customStyles = {
        table: {
            style: {
                border: '1px solid #dee2e6', // outer border
            },
        },
        headRow: {
            style: {
                backgroundColor: '#f1f1f1',
                borderBottom: '2px solid #dee2e6',
            },
        },
        headCells: {
            style: {
                borderRight: '1px solid #dee2e6',
                fontWeight: 'bold',
            },
        },
        rows: {
            style: {
                minHeight: '60px',
                borderBottom: '1px solid #dee2e6',
            },
        },
        cells: {
            style: {
                borderRight: '1px solid #dee2e6',
            },
        },
    };


    // total pages calculation
    const totalPages = Math.ceil(filteredData.length / entries)

    const handleFilterChange = (e) => {
        setFilterText(e.target.value)
        setResetPaginationToggle(!resetPaginationToggle)
    }

    const handleEntriesChange = (e) => {
        setEntries(Number(e.target.value))
        setPage(1)
    }

    const handlePageChange = (pageNum) => {
        setPage(pageNum)
    }

    // pagination slice
    const paginatedData = useMemo(() => {
        const start = (page - 1) * entries
        const end = start + entries
        return filteredData.slice(start, end)
    }, [filteredData, page, entries])

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10" style={{ padding: '20px' }}>
                <h1 className="my-4">Product List</h1>

                {loading ? (
                    <Loader />
                ) : (
                    <>
                        {/* Controls */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '10px',
                            }}
                        >
                            {/* Show entries */}
                            <div>
                                <label style={{ marginRight: '8px' }}>Show entries</label>
                                <select value={entries} onChange={handleEntriesChange}>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>

                            {/* Search */}
                            <input
                                type="text"
                                placeholder="Search..."
                                value={filterText}
                                onChange={handleFilterChange}
                                style={{
                                    padding: '5px 10px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                }}
                            />
                        </div>

                        {/* DataTable */}
                        <DataTable
                            columns={columns}
                            data={paginatedData}
                            customStyles={customStyles}
                            highlightOnHover
                            striped
                            responsive
                            persistTableHead
                            pagination={false}
                            noDataComponent="No matching products found"
                        />

                        {/* Footer: showing entries + pagination */}
                        <div style={{ marginTop: '10px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                Showing {(page - 1) * entries + 1} to {Math.min(page * entries, filteredData.length)} of {filteredData.length} products
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginTop: '15px',
                                }}
                            >
                                <button
                                    disabled={page === 1}
                                    onClick={() => handlePageChange(page - 1)}
                                    className="btn btn-light"
                                >
                                    Previous
                                </button>
                                <div
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#ff7f00',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {page}
                                </div>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => handlePageChange(page + 1)}
                                    className="btn btn-light"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
