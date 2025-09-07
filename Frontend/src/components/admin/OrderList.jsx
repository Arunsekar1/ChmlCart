import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import DataTable from 'react-data-table-component'
import Sidebar from './Sidebar'
import Loader from '../layouts/Loader'
import { deleteOrder, adminOrders as adminOrdersAction } from '../../actions/orderActions'
import { clearError, clearOrderDeleted } from '../../slices/orderSlice'

export default function OrderList() {
    const { adminOrders = [], loading = true, error, isOrderDeleted } = useSelector((state) => state.orderState)
    const dispatch = useDispatch()

    const [filterText, setFilterText] = useState('')
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
    const [entries, setEntries] = useState(10)
    const [page, setPage] = useState(1)

    const deleteHandler = (e, id) => {
        e.target.disabled = true
        dispatch(deleteOrder(id))
    }

    // filter orders
    const filteredData = useMemo(() => {
        if (!filterText) return adminOrders
        return adminOrders.filter(
            (o) =>
                o._id.toLowerCase().includes(filterText.toLowerCase()) ||
                o.orderStatus.toLowerCase().includes(filterText.toLowerCase())
        )
    }, [adminOrders, filterText])

    // columns for DataTable
    const columns = [
        {
            name: 'ID',
            selector: (row) => row._id,
            sortable: true,
            minWidth: "250px"
        },
        {
            name: 'Number of Items',
            selector: (row) => row.orderItems.length,
            sortable: true,
        },
        {
            name: 'Amount',
            selector: (row) => `$${row.totalPrice}`,
            sortable: true,
        },
        {
            name: 'Status',
            cell: (row) => (
                <p style={{ color: row.orderStatus.includes('Processing') ? 'red' : 'green' }}>
                    {row.orderStatus}
                </p>
            ),
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <>
                    <Link to={`/admin/order/${row._id}`} className="btn btn-primary btn-sm">
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

    useEffect(() => {
        if (error) {
            toast(error, {
                position: 'bottom-center',
                type: 'error',
                onOpen: () => dispatch(clearError()),
            })
            return
        }
        if (isOrderDeleted) {
            toast('Order Deleted Successfully', {
                type: 'success',
                position: 'bottom-center',
                onOpen: () => dispatch(clearOrderDeleted()),
            })
            return
        }

        dispatch(adminOrdersAction())
    }, [dispatch, error, isOrderDeleted])

    return (
        <div className="row">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="col-12 col-md-10" style={{ padding: '20px' }}>
                <h1 className="my-4">Order List</h1>

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
                            noDataComponent="No matching orders found"
                        />

                        {/* Footer: showing entries + pagination */}
                        <div style={{ marginTop: '10px' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                Showing {(page - 1) * entries + 1} to{' '}
                                {Math.min(page * entries, filteredData.length)} of{' '}
                                {filteredData.length} orders
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
