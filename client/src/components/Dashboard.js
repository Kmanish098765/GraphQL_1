import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USERS, GET_PUBLICATIONS, GET_ORDERS } from '../graphql/queries';
import CalendarActivities from './CalendarActivities';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS);
  const { data: publicationsData, loading: publicationsLoading } = useQuery(GET_PUBLICATIONS);
  const { data: ordersData, loading: ordersLoading } = useQuery(GET_ORDERS);

  if (usersLoading || publicationsLoading || ordersLoading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const totalUsers = usersData?.gsEmployees?.length || 0;
  const totalPublications = publicationsData?.gsPublications?.length || 0;
  const activePublications = publicationsData?.gsPublications?.filter(pub => pub.IsActive)?.length || 0;
  const totalOrders = ordersData?.orders?.length || 0;
  const totalRevenue = ordersData?.orders?.reduce((sum, order) => sum + order.Net, 0) || 0;

  const renderOverviewTab = () => (
    <div className="overview-tab">
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
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {ordersData?.orders?.slice(0, 5).map(order => (
                <tr key={order.OrderId}>
                  <td>#{order.OrderId}</td>
                  <td>{order.representatives[0]?.FirstName} {order.representatives[0]?.LastName}</td>
                  <td>${order.Net?.toFixed(2)}</td>
                  <td>{new Date(order.DateAdded).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'activities' ? 'active' : ''}`}
          onClick={() => setActiveTab('activities')}
        >
          Calendar Activities
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'activities' && <CalendarActivities />}
      </div>
    </div>
  );
};

export default Dashboard; 