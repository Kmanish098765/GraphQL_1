import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CALENDAR_ACTIVITIES } from '../graphql/queries';

const CalendarActivities = () => {
  const [filters, setFilters] = useState({
    notesCreated: true,
    taskCreated: true,
    createdMeeting: true,
    emailDelivered: true,
    orderCreated: true,
    fromDate: '2024-01-01',
    toDate: '2024-12-31',
    loggedInUserID: 1,
    isSystem: 'USER_ONLY'
  });

  const { data, loading, error, refetch } = useQuery(GET_CALENDAR_ACTIVITIES, {
    variables: { input: filters },
    errorPolicy: 'partial'
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRefresh = () => {
    refetch();
  };

  const getActivityTypeColor = (type) => {
    const colors = {
      'NOTE': 'bg-blue-100 text-blue-800',
      'CALL': 'bg-green-100 text-green-800',
      'CALL_SCHEDULED': 'bg-green-100 text-green-800',
      'MEETING': 'bg-purple-100 text-purple-800',
      'MEETING_SCHEDULED': 'bg-purple-100 text-purple-800',
      'EMAIL': 'bg-yellow-100 text-yellow-800',
      'MASS_EMAIL': 'bg-orange-100 text-orange-800',
      'TASK': 'bg-red-100 text-red-800',
      'LETTER': 'bg-gray-100 text-gray-800',
      'MOBILE_CHECK_IN': 'bg-teal-100 text-teal-800',
      'USER_LOGIN': 'bg-indigo-100 text-indigo-800',
      'PROPOSAL': 'bg-pink-100 text-pink-800',
      'ORDER': 'bg-emerald-100 text-emerald-800',
      'OPPORTUNITY': 'bg-cyan-100 text-cyan-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const renderActivitySpecificInfo = (activity) => {
    switch (activity.__typename) {
      case 'NoteActivity':
        return (
          <div className="text-sm text-gray-600">
            {activity.isPrivate && <span className="text-red-500">🔒 Private</span>}
            {activity.createdBy && (
              <span className="ml-2">
                Created by: {activity.createdBy.firstName} {activity.createdBy.lastName}
              </span>
            )}
          </div>
        );
      
      case 'TaskActivity':
        return (
          <div className="text-sm text-gray-600">
            <strong>Title:</strong> {activity.title}
            {activity.isPrivate && <span className="text-red-500 ml-2">🔒 Private</span>}
            {activity.assignedBy && (
              <div>Assigned by: {activity.assignedBy.firstName} {activity.assignedBy.lastName}</div>
            )}
          </div>
        );
      
      case 'MeetingActivity':
        return (
          <div className="text-sm text-gray-600">
            <strong>Type:</strong> {activity.meetingType}
            <br />
            <strong>Duration:</strong> {activity.duration} minutes
            {activity.isPrivate && <span className="text-red-500 ml-2">🔒 Private</span>}
          </div>
        );
      
      case 'EmailActivity':
        return (
          <div className="text-sm text-gray-600">
            {activity.isEmail && <span className="text-blue-500">📧 Email</span>}
            {activity.isMassEmail && <span className="text-orange-500 ml-2">📢 Mass Email</span>}
          </div>
        );
      
      case 'OrderActivity':
        return (
          <div className="text-sm text-gray-600">
            <strong>Contract ID:</strong> {activity.contractID}
            {activity.description && (
              <div><strong>Description:</strong> {activity.description}</div>
            )}
          </div>
        );
      
      case 'CallActivity':
        return (
          <div className="text-sm text-gray-600">
            {activity.callBack && <div><strong>Callback:</strong> {formatDate(activity.callBack)}</div>}
            {activity.isPrivate && <span className="text-red-500">🔒 Private</span>}
          </div>
        );
      
      case 'ProposalActivity':
        return (
          <div className="text-sm text-gray-600">
            <strong>Proposal:</strong> {activity.proposalName}
            <br />
            <strong>Created:</strong> {formatDate(activity.createDate)}
          </div>
        );
      
      case 'OpportunityActivity':
        return (
          <div className="text-sm text-gray-600">
            <strong>Opportunity:</strong> {activity.opportunityName}
            {activity.salesPresenter && (
              <div>Presenter: {activity.salesPresenter.firstName} {activity.salesPresenter.lastName}</div>
            )}
            {activity.owner && (
              <div>Owner: {activity.owner.firstName} {activity.owner.lastName}</div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) return <div className="loading">Loading calendar activities...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  const activities = data?.getCalendarActivities?.activities || [];
  const totalCount = data?.getCalendarActivities?.totalCount || 0;
  console.log(data);
  return (
    <div className="calendar-activities">
      <div className="header-section">
        <h2>Calendar Activities</h2>
        <p className="text-gray-600">Complex GraphQL query demonstrating unions, interfaces, and fragments</p>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            Showing {activities.length} of {totalCount} activities
          </div>
          <button 
            onClick={handleRefresh}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">Activity Filters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                className="form-input"
              />
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => handleFilterChange('toDate', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">System Filter</label>
            <select
              value={filters.isSystem}
              onChange={(e) => handleFilterChange('isSystem', e.target.value)}
              className="form-select"
            >
              <option value="USER_ONLY">User Only</option>
              <option value="SYSTEM_ONLY">System Only</option>
              <option value="ALL">All</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activities Table */}
      <div className="table-section">
        <div className="table-container">
          <table className="activities-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Date/Time</th>
                <th>Activity</th>
                <th>Assigned To</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Details</th>
                <th>Permissions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map(activity => (
                <tr key={activity.id}>
                  <td>
                    <span className={`activity-badge ${getActivityTypeColor(activity.type)}`}>
                      {activity.type?.replace('_', ' ')}
                    </span>
                    {activity.isSystem && (
                      <span className="system-badge">SYS</span>
                    )}
                  </td>
                  
                  <td className="date-cell">
                    <div className="text-sm">
                      <div className="font-medium">{formatDate(activity.dateScheduled)}</div>
                      {activity.dateCompleted && (
                        <div className="text-gray-500 text-xs">
                          Completed: {formatDate(activity.dateCompleted)}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="activity-cell">
                    <div className="text-sm">
                      <div className="font-medium">{activity.activityCategory}</div>
                      {activity.notes && (
                        <div className="text-gray-600 truncate max-w-xs" title={activity.notes}>
                          {activity.notes}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td>
                    {activity.assignedTo ? (
                      <div className="text-sm">
                        <div className="font-medium">
                          {activity.assignedTo.firstName} {activity.assignedTo.lastName}
                        </div>
                        {activity.assignedTo.fullName && (
                          <div className="text-gray-500 text-xs">{activity.assignedTo.fullName}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </td>
                  
                  <td>
                    {activity.customer ? (
                      <div className="text-sm">
                        <div className="font-medium">{activity.customer.customer}</div>
                        {(activity.customer.firstName || activity.customer.lastName) && (
                          <div className="text-gray-500 text-xs">
                            {activity.customer.firstName} {activity.customer.lastName}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">No customer</span>
                    )}
                  </td>
                  
                  <td>
                    <span className={`status-badge ${activity.completed ? 'completed' : 'pending'}`}>
                      {activity.completed ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  
                  <td className="details-cell">
                    {renderActivitySpecificInfo(activity)}
                  </td>
                  
                  <td>
                    <div className="permissions-cell">
                      {activity.permissions?.canView && <span className="permission-badge view">👁️</span>}
                      {activity.permissions?.canEdit && <span className="permission-badge edit">✏️</span>}
                      {activity.permissions?.canDelete && <span className="permission-badge delete">🗑️</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {activities.length === 0 && (
          <div className="empty-state">
            <p>No activities found matching your criteria.</p>
            <p className="text-sm text-gray-500">Try adjusting your filters above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarActivities; 