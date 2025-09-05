import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userOrders as userOrdersAction } from '../../actions/orderActions'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'

export default function UserOrders() {
    const { userOrders = [] } = useSelector((state) => state.orderState)
    const dispatch = useDispatch()

    const [filterText, setFilterText] = useState('')
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
    const [entries, setEntries] = useState(10) // default entries shown
    const [page, setPage] = useState(1) // for controlling current page

    useEffect(() => {
        dispatch(userOrdersAction())
    }, [dispatch])

    const handleFilterChange = (e) => {
        setFilterText(e.target.value)
        setResetPaginationToggle(!resetPaginationToggle)
    }

    const handleEntriesChange = (e) => {
        setEntries(Number(e.target.value))
        setPage(1) // reset to first page when entries change
    }

    const handlePageChange = (page) => {
        setPage(page)
    }

    const filteredData = useMemo(() => {
        if (!filterText) return userOrders
        return userOrders.filter(
            (order) =>
                order._id.toLowerCase().includes(filterText.toLowerCase()) ||
                order.orderItems.some((item) =>
                    item.name.toLowerCase().includes(filterText.toLowerCase())
                ) ||
                order.orderStatus.toLowerCase().includes(filterText.toLowerCase())
        )
    }, [userOrders, filterText])

    const columns = [
        {
            name: 'Order ID',
            selector: (row) => row._id,
            sortable: true,
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
            selector: (row) => row.orderStatus,
            cell: (row) => (
                <span
                    style={{
                        color: row.orderStatus.includes('Delivered') ? 'green' : 'red',
                    }}
                >
                    {row.orderStatus}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <Link to={`/order/${row._id}`}>
                    <button className="btn btn-primary">
                        <i className="fa fa-eye"></i>
                    </button>
                </Link>
            ),
        },
    ]

    const customStyles = {
        header: {
            style: {
                minHeight: '56px',
            },
        },
        headRow: {
            style: {
                backgroundColor: '#f1f1f1',
            },
        },
        rows: {
            style: {
                minHeight: '72px',
            },
        },
        // Remove default footer styles
    }

    // Calculate total pages
    const totalPages = Math.ceil(filteredData.length / entries)

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {/* Title */}
            <h1 style={{ marginBottom: '20px' }}>My Orders</h1>

            {/* Top controls: Show entries and Search */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                }}
            >
                {/* Show entries dropdown */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ marginRight: '8px', fontSize: '14px' }}>Show entries</label>
                    <select
                        value={entries}
                        onChange={handleEntriesChange}
                        style={{
                            height: '30px',
                            padding: '0 8px',
                            fontSize: '14px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                        }}
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>

                {/* Search input */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={filterText}
                        onChange={handleFilterChange}
                        style={{
                            height: '30px',
                            width: '250px',
                            padding: '0 10px',
                            fontSize: '14px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            outline: 'none',
                            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
                        }}
                    />
                </div>
            </div>

            {/* Data table with no default footer */}
            <DataTable
                columns={columns}
                data={filteredData}
                customStyles={customStyles}
                highlightOnHover
                striped
                responsive
                persistTableHead
                pagination={false} // disable default pagination footer
                noDataComponent="No matching records found"
            />

            {/* Custom pagination and entries info container */}
            <div
                style={{
                    marginTop: '10px',
                }}
            >
                {/* Showing entries label */}
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                    Showing {Math.min(entries, filteredData.length)} entries
                </div>
                {/* Pagination buttons */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '20px',
                    }}
                >
                    {/* Previous Button */}
                    <button
                        disabled={page === 1}
                        onClick={() => handlePageChange(page - 1)}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #ccc',
                            borderRadius: '5px 0px 0px 5px',
                            backgroundColor: '#f8f9fa',
                            cursor: page === 1 ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                        }}
                    >
                        Previous
                    </button>

                    {/* Current Page Number */}
                    <div
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#ff7f00',
                            color: '#fff',
                            borderRadius: '0px',
                            fontWeight: 'bold',
                            minWidth: '30px',
                            textAlign: 'center',
                        }}
                    >
                        {page}
                    </div>

                    {/* Next Button */}
                    <button
                        disabled={page === totalPages}
                        onClick={() => handlePageChange(page + 1)}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid #ccc',
                            borderRadius: '0 5px 5px 0',
                            backgroundColor: '#f8f9fa',
                            cursor: page === totalPages ? 'not-allowed' : 'pointer',
                            fontSize: '14px',
                        }}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}