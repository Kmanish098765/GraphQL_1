import React, { useState } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { GET_ORDERS, GET_ORDER, UPDATE_ORDER, DELETE_ORDER, CREATE_ORDER, GET_PUBLICATIONS, GET_USERS } from '../graphql/queries';

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    PubID: '',
    Net: '',
    RepIDs: '',
    Description: ''
  });

  const { data, loading, error, refetch } = useQuery(GET_ORDERS, {
    variables: { limit: 100 }
  });
  const { data: publicationsData } = useQuery(GET_PUBLICATIONS);
  const { data: usersData } = useQuery(GET_USERS);
  const [getOrder, { loading: orderLoading }] = useLazyQuery(GET_ORDER);
  const [updateOrder] = useMutation(UPDATE_ORDER);
  const [deleteOrder] = useMutation(DELETE_ORDER);
  const [createOrder] = useMutation(CREATE_ORDER);

  const handleUpdate = async (orderId, updatedData) => {
    try {
      await updateOrder({
        variables: {
          OrderId: orderId,
          input: updatedData
        }
      });
      refetch();
      hideOrderDetails();
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Error updating order: ' + err.message);
    }
  };

  const handleDelete = async (OrderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder({
          variables: { OrderId }
        });
        refetch();
      } catch (err) {
        console.error('Error deleting order:', err);
        alert('Error deleting order: ' + err.message);
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createOrder({
        variables: {
          input: {
            PubID: parseInt(createFormData.PubID),
            Net: parseFloat(createFormData.Net),
            RepIDs: createFormData.RepIDs,
            Description: createFormData.Description
          }
        }
      });
      refetch();
      setShowCreateForm(false);
      setCreateFormData({ PubID: '', Net: '', RepIDs: '', Description: '' });
    } catch (err) {
      console.error('Error creating order:', err);
      alert('Error creating order: ' + err.message);
    }
  };

  const showOrderDetails = async (order) => {
    try {
      const { data: orderData } = await getOrder({
        variables: { OrderId: order.OrderId }
      });
      setSelectedOrder(orderData.order);
      setShowDetails(true);
    } catch (err) {
      console.error('Error fetching order details:', err);
      alert('Error fetching order details: ' + err.message);
    }
  };

  const hideOrderDetails = () => {
    setSelectedOrder(null);
    setShowDetails(false);
  };

  const formatRepresentatives = (representatives) => {
    if (!representatives || representatives.length === 0) return 'None';
    return representatives.map(rep => `${rep.FirstName} ${rep.LastName}`).join(', ');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">Error loading orders: {error.message}</div>;

  return (
    <div className="orders">
      <div className="section-header">
        <h2>Orders</h2>
        <div className="section-info">
          <small>Showing top 100 most recent orders (sorted by date added)</small>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateForm(true)}
        >
          Create New Order
        </button>
      </div>

      {/* Create Order Modal */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Create New Order</h3>
              <button className="close-btn" onClick={() => setShowCreateForm(false)}>×</button>
            </div>
            <form onSubmit={handleCreate} className="order-form">
              <div className="form-group">
                <label>Publication:</label>
                <select
                  value={createFormData.PubID}
                  onChange={(e) => setCreateFormData({...createFormData, PubID: e.target.value})}
                  required
                >
                  <option value="">Select Publication</option>
                  {publicationsData?.gsPublications?.map(pub => (
                    <option key={pub.gsPublicationID} value={pub.gsPublicationID}>
                      {pub.PubName} ({pub.PubAbbrev})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Net Amount ($):</label>
                <input
                  type="number"
                  step="0.01"
                  value={createFormData.Net}
                  onChange={(e) => setCreateFormData({...createFormData, Net: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Representative IDs (comma-separated):</label>
                <input
                  type="text"
                  value={createFormData.RepIDs}
                  onChange={(e) => setCreateFormData({...createFormData, RepIDs: e.target.value})}
                  placeholder="e.g., 1,2,3"
                  required
                />
                <small>Available: {usersData?.gsEmployees?.map(user => `${user.gsEmployeesId} (${user.FirstName} ${user.LastName})`).join(', ')}</small>
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={createFormData.Description}
                  onChange={(e) => setCreateFormData({...createFormData, Description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Create Order</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Order Details - #{selectedOrder.OrderId}</h3>
              <button className="close-btn" onClick={hideOrderDetails}>×</button>
            </div>
            <div className="order-details">
              <div className="order-info">
                <div className="info-row">
                  <strong>Order ID:</strong> #{selectedOrder.OrderId}
                </div>
                <div className="info-row">
                  <strong>Publication:</strong> {selectedOrder.publication?.PubName || 'N/A'} 
                  {selectedOrder.publication?.PubAbbrev && ` (${selectedOrder.publication.PubAbbrev})`}
                </div>
                <div className="info-row">
                  <strong>Net Amount:</strong> {formatCurrency(selectedOrder.Net)}
                </div>
                <div className="info-row">
                  <strong>Date Added:</strong> {selectedOrder.DateAdded ? new Date(selectedOrder.DateAdded).toLocaleDateString() : 'N/A'}
                </div>
                <div className="info-row">
                  <strong>Representatives:</strong> {formatRepresentatives(selectedOrder.representatives)}
                </div>
                <div className="info-row">
                  <strong>Description:</strong> {selectedOrder.Description || 'No description'}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={hideOrderDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Publication</th>
              <th>Net Amount</th>
              <th>Representatives</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.orders?.map(order => (
              <tr key={order.OrderId}>
                <td>#{order.OrderId}</td>
                <td>
                  {order.publication?.PubName || 'N/A'}
                  {order.publication?.PubAbbrev && <br />}
                  {order.publication?.PubAbbrev && <small>({order.publication.PubAbbrev})</small>}
                </td>
                <td>{formatCurrency(order.Net)}</td>
                <td>{formatRepresentatives(order.representatives)}</td>
                <td>{order.DateAdded ? new Date(order.DateAdded).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-info"
                    onClick={() => showOrderDetails(order)}
                    disabled={orderLoading}
                  >
                    {orderLoading ? 'Loading...' : 'View'}
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(order.OrderId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {(!data?.orders || data.orders.length === 0) && (
          <div className="no-data">
            <p>No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 