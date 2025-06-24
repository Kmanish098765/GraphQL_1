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
    IssueSet: 0,
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
      IssueSet: 0,
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
      IssueSet: publication.IssueSet || 0,
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
        <h2>Publications Management</h2>
        <div className="header-controls">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showActiveOnly}
              onChange={(e) => setShowActiveOnly(e.target.checked)}
            />
            Show Active Only
          </label>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add New Publication'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="publication-form">
          <h3>{editingPublication ? 'Edit Publication' : 'Add New Publication'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Publication Name *</label>
              <input
                type="text"
                value={formData.PubName}
                onChange={(e) => setFormData({ ...formData, PubName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Publication Abbreviation</label>
              <input
                type="text"
                value={formData.PubAbbrev}
                onChange={(e) => setFormData({ ...formData, PubAbbrev: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Issue Set</label>
              <input
                type="text"
                value={formData.IssueSet}
                onChange={(e) => setFormData({ ...formData, IssueSet: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Sub Product Type ID</label>
              <input
                type="number"
                value={formData.SubProductTypeId}
                onChange={(e) => setFormData({ ...formData, SubProductTypeId: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                Active
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingPublication ? 'Update Publication' : 'Create Publication'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="publications-list">
        <h3>Publications ({publications.length})</h3>
        {publications.length === 0 ? (
          <p>No publications found.</p>
        ) : (
          <div className="publications-grid">
            {publications.map((publication) => (
              <div key={publication.gsPublicationID} className="publication-card">
                <div className="publication-header">
                  <h4>{publication.PubName}</h4>
                  <div className="publication-status">
                    <span className={`status-badge ${publication.isActive ? 'active' : 'inactive'}`}>
                      {publication.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="publication-details">
                  {publication.PubAbbrev && (
                    <p><strong>Abbreviation:</strong> {publication.PubAbbrev}</p>
                  )}
                  {publication.IssueSet && (
                    <p><strong>Issue Set:</strong> {publication.IssueSet}</p>
                  )}
                  {publication.SubProductTypeId && (
                    <p><strong>Type ID:</strong> {publication.SubProductTypeId}</p>
                  )}
                </div>

                <div className="publication-actions">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleEdit(publication)}
                  >
                    Edit
                  </button>
                  <button
                    className={`btn btn-sm ${publication.isActive ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => handleToggleStatus(publication.gsPublicationID)}
                  >
                    {publication.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(publication.gsPublicationID)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Publications; 