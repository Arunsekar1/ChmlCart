import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import DataTable from 'react-data-table-component'
import Sidebar from './Sidebar'
import Loader from '../layouts/Loader'

import { deleteReview, getReviews } from '../../actions/productActions'
import { clearError, clearReviewDeleted } from '../../slices/productSlice'

export default function ReviewList() {
    const { reviews = [], loading = false, error, isReviewDeleted } = useSelector(state => state.productState)
    const [productId, setProductId] = useState('')
    const dispatch = useDispatch()

    const [filterText, setFilterText] = useState('')
    const [entries, setEntries] = useState(10)
    const [page, setPage] = useState(1)

    useEffect(() => {
        if (error) {
            toast(error, {
                position: 'bottom-center',
                type: 'error',
                onOpen: () => dispatch(clearError()),
            })
        }
        if (isReviewDeleted) {
            toast('Review Deleted Successfully', {
                type: 'success',
                position: 'bottom-center',
                onOpen: () => dispatch(clearReviewDeleted()),
            })
            dispatch(getReviews(productId))
            return
        }
    }, [dispatch, error, isReviewDeleted, productId])

    const deleteHandler = (e, id) => {
        e.target.disabled = true
        dispatch(deleteReview(productId, id))
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(getReviews(productId))
    }

    // filter reviews
    const filteredData = useMemo(() => {
        if (!filterText) return reviews
        return reviews.filter(
            (r) =>
                r._id.toLowerCase().includes(filterText.toLowerCase()) ||
                r.user?.name.toLowerCase().includes(filterText.toLowerCase()) ||
                r.comment.toLowerCase().includes(filterText.toLowerCase())
        )
    }, [reviews, filterText])

    // columns for DataTable
    const columns = [
        {
            name: 'ID',
            selector: (row) => row._id,
            sortable: true,
            minWidth: '250px',
        },
        {
            name: 'Rating',
            selector: (row) => row.rating,
            sortable: true,
        },
        {
            name: 'User',
            selector: (row) => row.user?.name,
            sortable: true,
        },
        {
            name: 'Comment',
            selector: (row) => row.comment,
            sortable: true,
            minWidth: '300px',
        },
        {
            name: 'Actions',
            cell: (row) => (
                <Button
                    onClick={(e) => deleteHandler(e, row._id)}
                    className="btn btn-danger btn-sm"
                >
                    <i className="fa fa-trash"></i>
                </Button>
            ),
        },
    ]

    const customStyles = {
        table: {
            style: { border: '1px solid #dee2e6' },
        },
        headRow: {
            style: {
                backgroundColor: '#f1f1f1',
                borderBottom: '2px solid #dee2e6',
            },
        },
        headCells: {
            style: { borderRight: '1px solid #dee2e6', fontWeight: 'bold' },
        },
        rows: {
            style: {
                minHeight: '60px',
                borderBottom: '1px solid #dee2e6',
            },
        },
        cells: {
            style: { borderRight: '1px solid #dee2e6' },
        },
    }

    // total pages calculation
    const totalPages = Math.ceil(filteredData.length / entries)

    const handleFilterChange = (e) => {
        setFilterText(e.target.value)
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
                <h1 className="my-4">Review List</h1>

                {/* Product ID form */}
                <div className="row justify-content-center mt-3">
                    <div className="col-6">
                        <form onSubmit={submitHandler}>
                            <div className="form-group">
                                <label>Product ID</label>
                                <input
                                    type="text"
                                    onChange={(e) => setProductId(e.target.value)}
                                    value={productId}
                                    className="form-control"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-100 py-2 mt-2"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>

                {loading ? (
                    <Loader />
                ) : (
                    <>
                        {/* Controls */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                margin: '15px 0',
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
                                placeholder="Search reviews..."
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
                            noDataComponent="No reviews found"
                        />

                        {/* Footer: showing entries + pagination */}
                        <div style={{ marginTop: '10px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                Showing {(page - 1) * entries + 1} to{' '}
                                {Math.min(page * entries, filteredData.length)} of{' '}
                                {filteredData.length} reviews
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
