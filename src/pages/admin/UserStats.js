import { useEffect, useState } from "react";
import { API_BASE } from "../config";

function useAdminApi(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    async function run() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(${API_BASE}${path}, {
          headers: { Authorization: Bearer ${token} },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Request failed");
        setData(json);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [path]);
  
  return { data, loading, error };
}

function UserStats() {
  const { data, loading, error } = useAdminApi("/admin/user-stats");
  
  if (loading) return <div>Loading user statistics...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  
  const stats = [
    {
      label: "Total Users",
      value: data?.totalUsers || 0,
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      label: "Active Today",
      value: data?.activeToday || 0,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      label: "New This Week",
      value: data?.newThisWeek || 0,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      label: "Suspended",
      value: data?.suspendedUsers || 0,
      gradient: "from-rose-500 to-orange-500",
    },
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={rounded-2xl p-5 bg-gradient-to-r ${stat.gradient} text-white shadow-lg}
        >
          <div className="text-sm opacity-80">{stat.label}</div>
          <div className="text-3xl font-bold">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}

function UserFilters({ filters, setFilters }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function UserActionButton({ userId, action, currentStatus, onUpdate }) {
  const [busy, setBusy] = useState(false);
  
  async function handleAction() {
    setBusy(true);
    try {
      const token = localStorage.getItem("admin_token");
      await fetch(${API_BASE}/admin/actions/${action}-user, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: Bearer ${token},
        },
        body: JSON.stringify({ user_id: userId }),
      });
      onUpdate();
    } catch (error) {
      console.error(Failed to ${action} user:, error);
    } finally {
      setBusy(false);
    }
  }
  
  const buttonStyles = {
    suspend: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
    activate: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
    delete: "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100",
    promote: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
  };
  
  // Don't show suspend button for already suspended users
  if (action === "suspend" && currentStatus === "suspended") return null;
  // Don't show activate button for active users
  if (action === "activate" && currentStatus === "active") return null;
  
  return (
    <button
      disabled={busy}
      onClick={handleAction}
      className={px-3 py-1.5 rounded-lg text-sm font-medium border transition ${buttonStyles[action]} disabled:opacity-60}
    >
      {busy ? "..." : action}
    </button>
  );
}

function UsersTable({ users, onUpdate }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 font-semibold flex justify-between items-center">
        <span>All Users</span>
        <span className="text-sm text-gray-500 font-normal">
          {users.length} users found
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Joined</th>
              <th className="text-left px-4 py-3">Last Active</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">{user.id}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white text-sm font-medium">
                      {user.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    {user.name || "No name"}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "moderator"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role || "user"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : user.status === "suspended"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {user.status || "pending"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleDateString() : "Never"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <UserActionButton 
                      userId={user.id} 
                      action="suspend" 
                      currentStatus={user.status}
                      onUpdate={onUpdate}
                    />
                    <UserActionButton 
                      userId={user.id} 
                      action="activate" 
                      currentStatus={user.status}
                      onUpdate={onUpdate}
                    />
                    <UserActionButton 
                      userId={user.id} 
                      action="promote" 
                      currentStatus={user.status}
                      onUpdate={onUpdate}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BulkActions({ selectedUsers, onBulkAction }) {
  if (selectedUsers.length === 0) return null;
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {selectedUsers.length} users selected
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onBulkAction("suspend")}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
          >
            Suspend Selected
          </button>
          <button
            onClick={() => onBulkAction("activate")}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
          >
            Activate Selected
          </button>
          <button
            onClick={() => onBulkAction("delete")}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
          >
            Delete Selected
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mt-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-60"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    role: "",
  });
  
  const usersPerPage = 10;
  
  // Fetch users
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(${API_BASE}/admin/users, {
          headers: { Authorization: Bearer ${token} },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Request failed");
        setUsers(json.users || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);
  
  // Filter users
  useEffect(() => {
    let filtered = users;
    
    if (filters.search) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status);
    }
    
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }
    
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, filters]);
  
  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);
  
  function refreshUsers() {
    window.location.reload();
  }
  
  async function handleBulkAction(action) {
    if (selectedUsers.length === 0) return;
    
    try {
      const token = localStorage.getItem("admin_token");
      await fetch(${API_BASE}/admin/actions/bulk-${action}, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: Bearer ${token},
        },
        body: JSON.stringify({ user_ids: selectedUsers }),
      });
      setSelectedUsers([]);
      refreshUsers();
    } catch (error) {
      console.error(Bulk ${action} failed:, error);
    }
  }
  
  function toggleUserSelection(userId) {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }
  
  function toggleSelectAll() {
    setSelectedUsers(
      selectedUsers.length === paginatedUsers.length 
        ? [] 
        : paginatedUsers.map(user => user.id)
    );
  }
  
  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <button 
          onClick={refreshUsers}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>
      
      <UserStats />
      
      <UserFilters filters={filters} setFilters={setFilters} />
      
      <BulkActions 
        selectedUsers={selectedUsers} 
        onBulkAction={handleBulkAction} 
      />
      
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 font-semibold flex justify-between items-center">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
              onChange={toggleSelectAll}
              className="rounded border-gray-300"
            />
            <span>All Users</span>
          </div>
          <span className="text-sm text-gray-500 font-normal">
            Showing {startIndex + 1}-{Math.min(startIndex + usersPerPage, filteredUsers.length)} of {filteredUsers.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="text-left px-4 py-3">Select</th>
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Joined</th>
                <th className="text-left px-4 py-3">Last Active</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{user.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white text-sm font-medium">
                        {user.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      {user.name || "No name"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "moderator"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role || "user"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : user.status === "suspended"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {user.status || "pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleDateString() : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <UserActionButton 
                        userId={user.id} 
                        action="suspend" 
                        currentStatus={user.status}
                        onUpdate={refreshUsers}
                      />
                      <UserActionButton 
                        userId={user.id} 
                        action="activate" 
                        currentStatus={user.status}
                        onUpdate={refreshUsers}
                      />
                      <UserActionButton 
                        userId={user.id} 
                        action="promote" 
                        currentStatus={user.status}
                        onUpdate={refreshUsers}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      )}
    </div>
  );
}