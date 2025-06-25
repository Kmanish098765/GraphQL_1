import React, { useState } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import {
  GET_PUBLICATIONS,
  GET_PUBLICATION,
  GET_ACTIVE_PUBLICATIONS,
  CREATE_PUBLICATION,
  UPDATE_PUBLICATION,
  DELETE_PUBLICATION,
  TOGGLE_PUBLICATION_STATUS
} from '../graphql/queries';

const Publications = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPublication, setEditingPublication] = useState(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [viewingPublication, setViewingPublication] = useState(null);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [formData, setFormData] = useState({
    PubName: '',
    PubAbbrev: '',
    IssueSet: 0,
    SubProductTypeID: '',
    IsActive: true
  });

  const { loading, error, data, refetch } = useQuery(
    showActiveOnly ? GET_ACTIVE_PUBLICATIONS : GET_PUBLICATIONS
  );

  const [getPublication, { loading: viewLoading }] = useLazyQuery(GET_PUBLICATION, {
    onCompleted: (data) => {
      setViewingPublication(data.gsPublication);
      setShowViewPopup(true);
    },
    onError: (err) => {
      console.error('Error fetching publication details:', err);
      alert('Error fetching publication details. Please try again.');
    }
  });

  const [createPublication] = useMutation(CREATE_PUBLICATION, {
    onCompleted: () => {
      refetch();
      resetForm();
    },
    onError: (err) => {
      console.error('Error creating publication:', err);
    }
  });

  const [updatePublication] = useMutation(UPDATE_PUBLICATION, {
    onCompleted: () => {
      refetch();
      resetForm();
    },
    onError: (err) => {
      console.error('Error updating publication:', err);
    }
  });

  const [deletePublication] = useMutation(DELETE_PUBLICATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (err) => {
      console.error('Error deleting publication:', err);
    }
  });

  const [togglePublicationStatus] = useMutation(TOGGLE_PUBLICATION_STATUS, {
    onCompleted: () => {
      refetch();
    },
    onError: (err) => {
      console.error('Error toggling publication status:', err);
    }
  });

  const resetForm = () => {
    setFormData({
      PubName: '',
      PubAbbrev: '',
      IssueSet: 0,
      SubProductTypeID: '',
      IsActive: true
    });
    setShowForm(false);
    setEditingPublication(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const publicationData = {
      PubName: formData.PubName,
      PubAbbrev: formData.PubAbbrev || null,
      IssueSet: formData.IssueSet || null,
      SubProductTypeID: formData.SubProductTypeID ? parseInt(formData.SubProductTypeID) : null,
      IsActive: formData.IsActive
    };

    try {
      if (editingPublication) {
        await updatePublication({
          variables: {
            gsPublicationID: editingPublication.gsPublicationID,
            input: publicationData
          }
        });
      } else {
        await createPublication({
          variables: {
            input: publicationData
          }
        });
      }
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleEdit = (publication) => {
    setEditingPublication(publication);
    setFormData({
      PubName: publication.PubName || '',
      PubAbbrev: publication.PubAbbrev || '',
      IssueSet: publication.IssueSet || 0,
      SubProductTypeID: publication.SubProductTypeID || '',
      IsActive: publication.IsActive
    });
    setShowForm(true);
  };

  const handleView = (gsPublicationID) => {
    getPublication({
      variables: { gsPublicationID }
    });
  };

  const closeViewPopup = () => {
    setShowViewPopup(false);
    setViewingPublication(null);
  };

  const handleDelete = async (gsPublicationID) => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      try {
        await deletePublication({
          variables: { gsPublicationID }
        });
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const handleToggleStatus = async (gsPublicationID) => {
    try {
      await togglePublicationStatus({
        variables: { gsPublicationID }
      });
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  if (loading) return <div className="loading">Loading publications...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  const publications = showActiveOnly ? data?.activeGsPublications || [] : data?.gsPublications || [];

  return (
    <div className="publications-container">
      <div className="publications-header">
        <div className="header-content">
          <h1 className="page-title">Publications Management</h1>
          <p className="page-subtitle">Manage your publication catalog</p>
        </div>
        <div className="header-controls">
          <div className="filter-controls">
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
              />
              <span className="checkmark"></span>
              Show Active Only
            </label>
          </div>
          <button 
            className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Cancel' : '+ Add New Publication'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>{editingPublication ? 'Edit Publication' : 'Add New Publication'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="publication-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Publication Name *</label>
                  <input
                    type="text"
                    value={formData.PubName}
                    onChange={(e) => setFormData({ ...formData, PubName: e.target.value })}
                    placeholder="Enter publication name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Abbreviation</label>
                  <input
                    type="text"
                    value={formData.PubAbbrev}
                    onChange={(e) => setFormData({ ...formData, PubAbbrev: e.target.value })}
                    placeholder="Enter abbreviation"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Issue Set</label>
                  <input
                    type="number"
                    value={formData.IssueSet}
                    onChange={(e) => setFormData({ ...formData, IssueSet: parseInt(e.target.value) || 0 })}
                    placeholder="Enter issue set number"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Sub Product Type ID</label>
                  <input
                    type="number"
                    value={formData.SubProductTypeID}
                    onChange={(e) => setFormData({ ...formData, SubProductTypeID: e.target.value })}
                    placeholder="Enter sub product type ID"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.IsActive}
                    onChange={(e) => setFormData({ ...formData, IsActive: e.target.checked })}
                  />
                  <span className="checkbox-custom"></span>
                  Active Publication
                </label>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn btn-submit">
                  {editingPublication ? 'Update Publication' : 'Create Publication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="publications-content">
        {publications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No Publications Found</h3>
            <p>
              {showActiveOnly 
                ? "No active publications available. Try showing all publications or create a new one."
                : "No publications available yet. Create your first publication to get started."
              }
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              + Add New Publication
            </button>
          </div>
        ) : (
          <div className="publications-grid">
            {publications.map((publication) => (
              <div key={publication.gsPublicationID} className="publication-card">
                <div className="card-content">
                  <div className="publication-header">
                    <div className="publication-title">
                      <h3>{publication.PubName}</h3>
                      {publication.PubAbbrev && (
                        <span className="publication-abbrev">({publication.PubAbbrev})</span>
                      )}
                    </div>
                    <div className={`status-badge ${publication.IsActive ? 'active' : 'inactive'}`}>
                      {publication.IsActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  <div className="publication-details">
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">ID:</span>
                        <span className="detail-value">{publication.gsPublicationID}</span>
                      </div>
                      {publication.IssueSet && (
                        <div className="detail-item">
                          <span className="detail-label">Issue Set:</span>
                          <span className="detail-value">{publication.IssueSet}</span>
                        </div>
                      )}
                      {publication.SubProductTypeID && (
                        <div className="detail-item">
                          <span className="detail-label">Type ID:</span>
                          <span className="detail-value">{publication.SubProductTypeID}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="publication-actions">
                  <button
                    className="action-btn view-btn"
                    onClick={() => handleView(publication.gsPublicationID)}
                    title="View publication details"
                    disabled={viewLoading}
                  >
                    👁️ View
                  </button>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(publication)}
                    title="Edit publication"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className={`action-btn ${publication.IsActive ? 'deactivate-btn' : 'activate-btn'}`}
                    onClick={() => handleToggleStatus(publication.gsPublicationID)}
                    title={publication.IsActive ? 'Deactivate publication' : 'Activate publication'}
                  >
                    {publication.IsActive ? '⏸️ Deactivate' : '▶️ Activate'}
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(publication.gsPublicationID)}
                    title="Delete publication"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Publication Popup */}
      {showViewPopup && viewingPublication && (
        <div className="popup-overlay" onClick={closeViewPopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>Publication Details</h2>
              <button className="popup-close-btn" onClick={closeViewPopup} title="Close">
                ✕
              </button>
            </div>
            
            <div className="popup-body">
              <div className="view-details">
                <div className="view-item">
                  <label>Publication ID:</label>
                  <span>{viewingPublication.gsPublicationID}</span>
                </div>
                
                <div className="view-item">
                  <label>Publication Name:</label>
                  <span>{viewingPublication.PubName || 'N/A'}</span>
                </div>
                
                <div className="view-item">
                  <label>Abbreviation:</label>
                  <span>{viewingPublication.PubAbbrev || 'N/A'}</span>
                </div>
                
                <div className="view-item">
                  <label>Issue Set:</label>
                  <span>{viewingPublication.IssueSet || 'N/A'}</span>
                </div>
                
                <div className="view-item">
                  <label>Sub Product Type ID:</label>
                  <span>{viewingPublication.SubProductTypeID || 'N/A'}</span>
                </div>
                
                <div className="view-item">
                  <label>Status:</label>
                  <span className={`status-indicator ${viewingPublication.IsActive ? 'active' : 'inactive'}`}>
                    {viewingPublication.IsActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="popup-footer">
              <button className="btn btn-secondary" onClick={closeViewPopup}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .publications-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .publications-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #e9ecef;
        }

        .header-content {
          flex: 1;
        }

        .page-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.025em;
        }

        .page-subtitle {
          font-size: 1.1rem;
          color: #6c757d;
          margin: 0;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .filter-controls {
          display: flex;
          align-items: center;
        }

        .filter-checkbox {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-weight: 500;
          color: #495057;
          position: relative;
          padding-left: 2rem;
        }

        .filter-checkbox input[type="checkbox"] {
          position: absolute;
          opacity: 0;
          left: 0;
        }

        .filter-checkbox .checkmark {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 1.25rem;
          width: 1.25rem;
          background-color: #fff;
          border: 2px solid #dee2e6;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .filter-checkbox input:checked ~ .checkmark {
          background-color: #007bff;
          border-color: #007bff;
        }

        .filter-checkbox input:checked ~ .checkmark:after {
          content: "✓";
          position: absolute;
          color: white;
          font-size: 0.875rem;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
        }

        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, #0056b3, #004085);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #545b62;
          transform: translateY(-1px);
        }

        .form-section {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid #e9ecef;
        }

        .form-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .form-header {
          margin-bottom: 1.5rem;
        }

        .form-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
        }

        .publication-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 600;
          color: #495057;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .form-group input {
          padding: 0.875rem 1rem;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s ease;
          background-color: #fff;
        }

        .form-group input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-weight: 500;
          color: #495057;
          position: relative;
          padding-left: 2rem;
        }

        .checkbox-label input[type="checkbox"] {
          position: absolute;
          opacity: 0;
          left: 0;
        }

        .checkbox-custom {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 1.25rem;
          width: 1.25rem;
          background-color: #fff;
          border: 2px solid #dee2e6;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .checkbox-label input:checked ~ .checkbox-custom {
          background-color: #007bff;
          border-color: #007bff;
        }

        .checkbox-label input:checked ~ .checkbox-custom:after {
          content: "✓";
          position: absolute;
          color: white;
          font-size: 0.875rem;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid #e9ecef;
        }

        .btn-cancel {
          background: #6c757d;
          color: white;
        }

        .btn-cancel:hover {
          background: #545b62;
        }

        .btn-submit {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
        }

        .btn-submit:hover {
          background: linear-gradient(135deg, #20c997, #17a2b8);
          transform: translateY(-1px);
        }

        .publications-content {
          min-height: 400px;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: #f8f9fa;
          border-radius: 12px;
          border: 2px dashed #dee2e6;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #495057;
          margin: 0 0 0.5rem 0;
        }

        .empty-state p {
          color: #6c757d;
          margin: 0 0 2rem 0;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .publications-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .publication-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e9ecef;
          overflow: hidden;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .publication-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border-color: #007bff;
        }

        .card-content {
          padding: 1.5rem;
        }

        .publication-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .publication-title {
          flex: 1;
        }

        .publication-title h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0 0 0.25rem 0;
          line-height: 1.3;
        }

        .publication-abbrev {
          font-size: 0.9rem;
          color: #6c757d;
          font-weight: 500;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .status-badge.active {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .status-badge.inactive {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .publication-details {
          margin-bottom: 1rem;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f8f9fa;
        }

        .detail-label {
          font-weight: 600;
          color: #495057;
          font-size: 0.9rem;
        }

        .detail-value {
          color: #2c3e50;
          font-weight: 500;
          text-align: right;
        }

        .publication-actions {
          display: flex;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
        }

        .action-btn {
          flex: 1;
          padding: 0.5rem 0.75rem;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          background: white;
          color: #495057;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
        }

        .action-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .view-btn {
          border-color: #17a2b8;
          color: #17a2b8;
        }

        .view-btn:hover:not(:disabled) {
          background: #17a2b8;
          color: white;
        }

        .edit-btn {
          border-color: #ffc107;
          color: #856404;
        }

        .edit-btn:hover {
          background: #ffc107;
          color: #212529;
        }

        .activate-btn {
          border-color: #28a745;
          color: #28a745;
        }

        .activate-btn:hover {
          background: #28a745;
          color: white;
        }

        .deactivate-btn {
          border-color: #fd7e14;
          color: #fd7e14;
        }

        .deactivate-btn:hover {
          background: #fd7e14;
          color: white;
        }

        .delete-btn {
          border-color: #dc3545;
          color: #dc3545;
        }

        .delete-btn:hover {
          background: #dc3545;
          color: white;
        }

        /* Popup Styles */
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .popup-content {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: popupSlideIn 0.3s ease-out;
        }

        @keyframes popupSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e9ecef;
          background: #f8f9fa;
          border-radius: 12px 12px 0 0;
        }

        .popup-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .popup-close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6c757d;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .popup-close-btn:hover {
          background: #e9ecef;
          color: #495057;
        }

        .popup-body {
          padding: 2rem;
        }

        .view-details {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .view-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .view-item label {
          font-weight: 600;
          color: #495057;
          font-size: 1rem;
        }

        .view-item span {
          font-weight: 500;
          color: #2c3e50;
          text-align: right;
        }

        .status-indicator {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .status-indicator.active {
          background: #d4edda;
          color: #155724;
        }

        .status-indicator.inactive {
          background: #f8d7da;
          color: #721c24;
        }

        .popup-footer {
          padding: 1.5rem;
          border-top: 1px solid #e9ecef;
          display: flex;
          justify-content: flex-end;
          background: #f8f9fa;
          border-radius: 0 0 12px 12px;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          font-size: 1.1rem;
          color: #6c757d;
        }

        .error {
          background: #f8d7da;
          color: #721c24;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #f5c6cb;
          margin: 1rem 0;
        }

        @media (max-width: 768px) {
          .publications-container {
            padding: 1rem;
          }

          .publications-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .header-controls {
            justify-content: space-between;
          }

          .publications-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .publication-actions {
            flex-wrap: wrap;
            gap: 0.25rem;
          }

          .action-btn {
            font-size: 0.8rem;
            padding: 0.4rem 0.6rem;
          }

          .popup-content {
            width: 95%;
            margin: 1rem;
          }

          .popup-body {
            padding: 1.5rem;
          }

          .view-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .view-item span {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default Publications; 