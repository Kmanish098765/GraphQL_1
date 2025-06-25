import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USERS, GET_PUBLICATIONS, GET_ORDERS } from '../graphql/queries';

const Dashboard = () => {
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS);
  const { data: publicationsData, loading: publicationsLoading } = useQuery(GET_PUBLICATIONS);
  const { data: ordersData, loading: ordersLoading } = useQuery(GET_ORDERS);

  if (usersLoading || publicationsLoading || ordersLoading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const totalUsers = usersData?.gsEmployees?.length || 0;
  const totalPublications = publicationsData?.gsPublications?.length || 0;
  const activePublications = publicationsData?.gsPublications?.filter(pub => pub.isActive)?.length || 0;
  const totalOrders = ordersData?.orders?.length || 0;
  const totalRevenue = ordersData?.orders?.reduce((sum, order) => sum + order.Net, 0) || 0;

  const pendingOrders = ordersData?.orders?.filter(order => order.status === 'pending')?.length || 0;
  const completedOrders = ordersData?.orders?.filter(order => order.status === 'completed')?.length || 0;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{totalUsers}</p>
        </div>
        
        <div className="stat-card">
          <h3>Publications</h3>
          <p className="stat-number">{totalPublications}</p>
          <small>({activePublications} active)</small>
        </div>
        
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-number">{totalOrders}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">${totalRevenue?.toFixed(2)}</p>
        </div>
        
        {/* <div className="stat-card">
          <h3>Pending Orders</h3>
          <p className="stat-number">{pendingOrders}</p>
        </div>
        
        <div className="stat-card">
          <h3>Completed Orders</h3>
          <p className="stat-number">{completedOrders}</p>
        </div> */}
      </div>

      <div className="recent-activity">
        <h3>Recent Orders</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                {/* <th>Status</th> */}
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {ordersData?.orders?.slice(0, 5).map(order => (
                <tr key={order.OrderId}>
                  <td>#{order.OrderId}</td>
                  <td>{order.representatives[0]?.FirstName} {order.representatives[0]?.LastName}</td>
                  <td>${order.Net?.toFixed(2)}</td>
                    {/* <td>
                        <span className={`status status-${order.status}`}>
                        {order.status}
                        </span>
                  </td> */}
                  <td>{new Date(order.DateAdded).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 