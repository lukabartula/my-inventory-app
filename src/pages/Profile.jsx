import React, { useEffect, useState } from "react";
import API from "../api/api";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));

      const res = await API.get(`/users/${payload.id}`);
      setCurrentUser(res.data);
    } catch {
      toast.error("Failed to load profile.");
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await API.get("/users");
      setAllUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/users/${id}`);
      toast.success("User deleted.");
      fetchAllUsers();
    } catch (err) {
      toast.error("Failed to delete user.");
    }
  };

  const handleRoleChange = async (user, newRole) => {
    try {
      await API.put(`/users/${user.id}`, {
        ...user,
        role: newRole,
      });
      toast.success("User role updated.");
      fetchAllUsers();
    } catch (err) {
      toast.error("Failed to update role.");
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchAllUsers();
    }
  }, [currentUser]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="profile-section">
          <h1>My Profile</h1>
          {currentUser && (
            <div>
              <p>
                <strong>Name:</strong> {currentUser.first_name}{" "}
                {currentUser.last_name}
              </p>
              <p>
                <strong>Email:</strong> {currentUser.email}
              </p>
              <p>
                <strong>Role:</strong> {currentUser.role}
              </p>
            </div>
          )}
        </div>

        {currentUser?.role === "admin" && (
          <>
            <h2 className="all-users-header">All Users</h2>
            {loading ? (
              <p style={{ marginLeft: "20px" }}>Loading users...</p>
            ) : (
              <table className="data-table all-users-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Change Role</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        {user.first_name} {user.last_name}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <select
                          className="role-select"
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user, e.target.value)
                          }
                        >
                          <option value="admin">admin</option>
                          <option value="staff">staff</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(user.id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
