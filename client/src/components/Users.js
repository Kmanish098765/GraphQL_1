import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USERS, CREATE_USER, UPDATE_USER, DELETE_USER } from '../graphql/queries';

const Users = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const { data, loading, error, refetch } = useQuery(GET_USERS);
  console.log(data);
  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser({
          variables: {
            id: editingUser.gsEmployeesId,
            input: formData
          }
        });
      } else {
        await createUser({
          variables: {
            input: formData
          }
        });
      }
      setFormData({ name: '', email: '' });
      setShowForm(false);
      setEditingUser(null);
      refetch();
    } catch (err) {
      console.error('Error saving user:', err);
      alert('Error saving user: ' + err.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ FirstName: user.FirstName, LastName: user.LastName, Email: user.Email });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser({
          variables: { id }
        });
        refetch();
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Error deleting user: ' + err.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '' });
    setShowForm(false);
    setEditingUser(null);
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">Error loading users: {error.message}</div>;

  return (
    <div className="users">
      <div className="section-header">
        <h2>Users</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New User
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-group">
                <label htmlFor="FirstName">FirstName:</label>
                <input
                  type="text"
                  id="FirstName"
                  value={formData.FirstName}
                  onChange={(e) => setFormData({...formData, FirstName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="LastName">LastName:</label>
                <input
                  type="text"
                  id="LastName"
                  value={formData.LastName}
                  onChange={(e) => setFormData({...formData, LastName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="Email">Email:</label>
                <input
                  type="email"
                  id="Email"
                  value={formData.Email}
                  onChange={(e) => setFormData({...formData, Email: e.target.value})}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Update' : 'Create'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.gsEmployees?.map(user => (
              <tr key={user.gsEmployeesId}>
                <td>{user.gsEmployeesId}</td>
                <td>{user.FirstName}</td>
                <td>{user.Email}</td>
                <td>{new Date(user.Dateadded).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(user.gsEmployeesId)}
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

export default Users; 