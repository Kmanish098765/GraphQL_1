import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ORDERS, UPDATE_ORDER_STATUS, DELETE_ORDER } from '../graphql/queries';

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_ORDERS);
  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS);
  const [deleteOrder] = useMutation(DELETE_ORDER);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({
        variables: {
          id: orderId,
          status: newStatus
        }
      });
      refetch();
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Error updating order status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder({
          variables: { id }
        });
        refetch();
      } catch (err) {
        console.error('Error deleting order:', err);
        alert('Error deleting order: ' + err.message);
      }
    }
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const hideOrderDetails = () => {
    setSelectedOrder(null);
    setShowDetails(false);
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">Error loading orders: {error.message}</div>;

  return (
    <div className="orders">
      <div className="section-header">
        <h2>Orders</h2>
      </div>

      {showDetails && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Order Details - #{selectedOrder.id}</h3>
              <button className="close-btn" onClick={hideOrderDetails}>×</button>
            </div>
            <div className="order-details">
              <div className="order-info">
                <p><strong>Customer:</strong> {selectedOrder.user.name}</p>
                <p><strong>Email:</strong> {selectedOrder.user.email}</p>
                <p><strong>Status:</strong> 
                  <span className={`status status-${selectedOrder.status}`}>
                    {selectedOrder.status}
                  </span>
                </p>
                <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div className="order-items">
                <h4>Order Items</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.products?.map(item => (
                      <tr key={item.id}>
                        <td>{item.product.name}</td>
                        <td>{item.quantity}</td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.orders?.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.user.name}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`status-select status-${order.status}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-info"
                    onClick={() => showOrderDetails(order)}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(order.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders; 