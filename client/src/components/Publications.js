import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_PUBLICATIONS,
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
  const [formData, setFormData] = useState({
    PubName: '',
    PubAbbrev: '',
    IssueSet: '',
    SubProductTypeId: '',
    isActive: true
  });

  const { loading, error, data, refetch } = useQuery(
    showActiveOnly ? GET_ACTIVE_PUBLICATIONS : GET_PUBLICATIONS
  );

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
      IssueSet: '',
      SubProductTypeId: '',
      isActive: true
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
      SubProductTypeId: formData.SubProductTypeId ? parseInt(formData.SubProductTypeId) : null,
      isActive: formData.isActive
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
      IssueSet: publication.IssueSet || '',
      SubProductTypeId: publication.SubProductTypeId || '',
      isActive: publication.isActive
    });
    setShowForm(true);
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
                    type="text"
                    value={formData.IssueSet}
                    onChange={(e) => setFormData({ ...formData, IssueSet: e.target.value })}
                    placeholder="Enter issue set"
                  />
                </div>

                <div className="form-group">
                  <label>Sub Product Type ID</label>
                  <input
                    type="number"
                    value={formData.SubProductTypeId}
                    onChange={(e) => setFormData({ ...formData, SubProductTypeId: e.target.value })}
                    placeholder="Enter type ID"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span className="checkmark"></span>
                    Active Publication
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingPublication ? '✓ Update Publication' : '✓ Create Publication'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="publications-section">
        <div className="section-header">
          <h2>Publications ({publications.length})</h2>
          {publications.length > 0 && (
            <div className="view-options">
              <span className="results-count">{publications.length} publications found</span>
            </div>
          )}
        </div>

        {publications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No publications found</h3>
            <p>Get started by adding your first publication</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              + Add First Publication
            </button>
          </div>
        ) : (
          <div className="publications-list">
            {publications.map((publication) => (
              <div key={publication.gsPublicationID} className="publication-item">
                <div className="publication-main">
                  <div className="publication-info">
                    <div className="publication-title-section">
                      <h3 className="publication-title">{publication.PubName}</h3>
                      <div className="publication-status">
                        <span className={`status-badge ${publication.isActive ? 'status-active' : 'status-inactive'}`}>
                          {publication.isActive ? '● Active' : '○ Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="publication-details">
                      <div className="detail-grid">
                        {publication.PubAbbrev && (
                          <div className="detail-item">
                            <span className="detail-label">Abbreviation:</span>
                            <span className="detail-value">{publication.PubAbbrev}</span>
                          </div>
                        )}
                        {publication.IssueSet && (
                          <div className="detail-item">
                            <span className="detail-label">Issue Set:</span>
                            <span className="detail-value">{publication.IssueSet}</span>
                          </div>
                        )}
                        {publication.SubProductTypeId && (
                          <div className="detail-item">
                            <span className="detail-label">Type ID:</span>
                            <span className="detail-value">{publication.SubProductTypeId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="publication-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(publication)}
                    title="Edit publication"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className={`action-btn ${publication.isActive ? 'deactivate-btn' : 'activate-btn'}`}
                    onClick={() => handleToggleStatus(publication.gsPublicationID)}
                    title={publication.isActive ? 'Deactivate publication' : 'Activate publication'}
                  >
                    {publication.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
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

        .btn-primary {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
          box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
        }

        .btn-primary:hover {
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
          padding: 0.75rem;
          border: 2px solid #dee2e6;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          cursor: pointer;
          position: relative;
          padding-left: 2rem;
          font-weight: 500;
        }

        .checkbox-container input[type="checkbox"] {
          position: absolute;
          opacity: 0;
          left: 0;
        }

        .checkbox-container .checkmark {
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

        .checkbox-container input:checked ~ .checkmark {
          background-color: #28a745;
          border-color: #28a745;
        }

        .checkbox-container input:checked ~ .checkmark:after {
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
          border-top: 1px solid #dee2e6;
        }

        .publications-section {
          margin-top: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
        }

        .results-count {
          color: #6c757d;
          font-size: 0.95rem;
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
          color: #495057;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #6c757d;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .publications-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .publication-item {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 1px solid #e9ecef;
          transition: all 0.2s ease;
        }

        .publication-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }

        .publication-main {
          margin-bottom: 1.5rem;
        }

        .publication-title-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .publication-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
          line-height: 1.3;
        }

        .publication-status {
          flex-shrink: 0;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .status-active {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .status-inactive {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .publication-details {
          margin-top: 1rem;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .detail-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 1rem;
          color: #495057;
          font-weight: 500;
        }

        .publication-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          padding-top: 1.5rem;
          border-top: 1px solid #e9ecef;
        }

        .action-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .edit-btn {
          background: #007bff;
          color: white;
        }

        .edit-btn:hover {
          background: #0056b3;
          transform: translateY(-1px);
        }

        .activate-btn {
          background: #28a745;
          color: white;
        }

        .activate-btn:hover {
          background: #1e7e34;
          transform: translateY(-1px);
        }

        .deactivate-btn {
          background: #ffc107;
          color: #212529;
        }

        .deactivate-btn:hover {
          background: #e0a800;
          transform: translateY(-1px);
        }

        .delete-btn {
          background: #dc3545;
          color: white;
        }

        .delete-btn:hover {
          background: #c82333;
          transform: translateY(-1px);
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
          margin-bottom: 2rem;
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

          .form-row {
            grid-template-columns: 1fr;
          }

          .publication-title-section {
            flex-direction: column;
            gap: 0.75rem;
            align-items: flex-start;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }

          .publication-actions {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Publications; 