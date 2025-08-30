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

function ContentStats() {
  const { data, loading, error } = useAdminApi("/admin/content-stats");
  
  if (loading) return <div>Loading content statistics...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  
  const stats = [
    {
      label: "Total Content",
      value: data?.totalContent || 0,
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      label: "Pending Review",
      value: data?.pendingReview || 0,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      label: "Flagged Items",
      value: data?.flaggedItems || 0,
      gradient: "from-rose-500 to-red-500",
    },
    {
      label: "Approved Today",
      value: data?.approvedToday || 0,
      gradient: "from-emerald-500 to-teal-500",
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

function ContentFilters({ filters, setFilters }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search content by title, user, or ID..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">All Types</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="text">Text</option>
            <option value="document">Document</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="flagged">Flagged</option>
          </select>
          <select
            value={filters.flagged}
            onChange={(e) => setFilters({ ...filters, flagged: e.target.value })}
            className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">All Content</option>
            <option value="flagged">Flagged Only</option>
            <option value="not-flagged">Not Flagged</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function ContentActionButton({ contentId, action, currentStatus, onUpdate }) {
  const [busy, setBusy] = useState(false);
  
  async function handleAction() {
    setBusy(true);
    try {
      const token = localStorage.getItem("admin_token");
      const endpoint = action === "approve" || action === "reject" 
        ? ${API_BASE}/admin/content/${contentId}/resolve
        : ${API_BASE}/admin/actions/${action}-content;
        
      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: Bearer ${token},
        },
        body: JSON.stringify({ 
          ...(action === "approve" || action === "reject" ? { action } : { content_id: contentId })
        }),
      });
      onUpdate();
    } catch (error) {
      console.error(Failed to ${action} content:, error);
    } finally {
      setBusy(false);
    }
  }
  
  const buttonStyles = {
    approve: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
    reject: "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100",
    delete: "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
    flag: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
  };
  
  // Don't show approve for already approved content
  if (action === "approve" && currentStatus === "approved") return null;
  // Don't show reject for already rejected content
  if (action === "reject" && currentStatus === "rejected") return null;
  
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

function ContentPreview({ content }) {
  const getPreviewContent = () => {
    switch (content.type) {
      case "image":
        return (
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white text-xs">
            IMG
          </div>
        );
      case "video":
        return (
          <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-400 rounded-lg flex items-center justify-center text-white text-xs">
            VID
          </div>
        );
      case "text":
        return (
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-lg flex items-center justify-center text-white text-xs">
            TXT
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg flex items-center justify-center text-white text-xs">
            DOC
          </div>
        );
    }
  };
  
  return (
    <div className="flex items-center gap-3">
      {getPreviewContent()}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-gray-900 truncate">
          {content.title || "Untitled"}
        </div>
        <div className="text-xs text-gray-500 truncate">
          {content.description || "No description"}
        </div>
      </div>
    </div>
  );
}

function BulkContentActions({ selectedContent, onBulkAction }) {
  if (selectedContent.length === 0) return null;
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {selectedContent.length} items selected
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onBulkAction("approve")}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
          >
            Approve Selected
          </button>
          <button
            onClick={() => onBulkAction("reject")}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
          >
            Reject Selected
          </button>
          <button
            onClick={() => onBulkAction("delete")}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
          >
            Delete Selected
          </button>
        </div>
      </div>
    </div>
  );
}

function ContentTable({ content, onUpdate }) {
  const [selectedContent, setSelectedContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  
  const totalPages = Math.ceil(content.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContent = content.slice(startIndex, startIndex + itemsPerPage);
  
  function toggleContentSelection(contentId) {
    setSelectedContent(prev => 
      prev.includes(contentId) 
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  }
  
  function toggleSelectAll() {
    setSelectedContent(
      selectedContent.length === paginatedContent.length 
        ? [] 
        : paginatedContent.map(item => item.id)
    );
  }
  
  async function handleBulkAction(action) {
    if (selectedContent.length === 0) return;
    
    try {
      const token = localStorage.getItem("admin_token");
      await fetch(${API_BASE}/admin/actions/bulk-${action}-content, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: Bearer ${token},
        },
        body: JSON.stringify({ content_ids: selectedContent }),
      });
      setSelectedContent([]);
      onUpdate();
    } catch (error) {
      console.error(Bulk ${action} failed:, error);
    }
  }
  
  return (
    <>
      <BulkContentActions 
        selectedContent={selectedContent} 
        onBulkAction={handleBulkAction} 
      />
      
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 font-semibold flex justify-between items-center">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedContent.length === paginatedContent.length && paginatedContent.length > 0}
              onChange={toggleSelectAll}
              className="rounded border-gray-300"
            />
            <span>All Content</span>
          </div>
          <span className="text-sm text-gray-500 font-normal">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, content.length)} of {content.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="text-left px-4 py-3">Select</th>
                <th className="text-left px-4 py-3">Content</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Flags</th>
                <th className="text-left px-4 py-3">Uploaded</th>
                <th className="text-left px-4 py-3">Size</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedContent.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedContent.includes(item.id)}
                      onChange={() => toggleContentSelection(item.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <ContentPreview content={item} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.type === "image"
                          ? "bg-purple-100 text-purple-700"
                          : item.type === "video"
                          ? "bg-red-100 text-red-700"
                          : item.type === "text"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-medium">
                        {item.userName?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <span>{item.userName || User ${item.userId}}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.status === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.status === "rejected"
                          ? "bg-rose-100 text-rose-700"
                          : item.status === "flagged"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.status || "pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {item.flagCount > 0 ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                        {item.flagCount} flags
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.fileSize ? ${(item.fileSize / 1024 / 1024).toFixed(1)} MB : "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <ContentActionButton 
                        contentId={item.id} 
                        action="approve" 
                        currentStatus={item.status}
                        onUpdate={onUpdate}
                      />
                      <ContentActionButton 
                        contentId={item.id} 
                        action="reject" 
                        currentStatus={item.status}
                        onUpdate={onUpdate}
                      />
                      <ContentActionButton 
                        contentId={item.id} 
                        action="delete" 
                        currentStatus={item.status}
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
      
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-60"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 disabled:opacity-60"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FlaggedContentSection() {
  const { data, loading, error } = useAdminApi("/admin/flagged");
  
  if (loading) return <div>Loading flagged content...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  
  const items = data.items || [];
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
      <div className="px-4 py-3 border-b border-gray-100 font-semibold flex justify-between items-center">
        <span>Recently Flagged Content</span>
        <span className="text-sm text-gray-500 font-normal">
          {items.length} items need review
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">Content</th>
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Reason</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Flagged</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.slice(0, 5).map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">{item.id}</td>
                <td className="px-4 py-3">
                  <ContentPreview content={item} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-medium">
                      {item.userName?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    {item.userName || User ${item.user_id}}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.content_type}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.reason}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      item.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : item.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {item.flaggedAt ? new Date(item.flaggedAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-4 py-3 space-x-2">
                  <ContentActionButton 
                    contentId={item.id} 
                    action="approve" 
                    currentStatus={item.status}
                    onUpdate={() => window.location.reload()}
                  />
                  <ContentActionButton 
                    contentId={item.id} 
                    action="reject" 
                    currentStatus={item.status}
                    onUpdate={() => window.location.reload()}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length > 5 && (
        <div className="px-4 py-3 border-t border-gray-100 text-center">
          <Link 
            to="#all-flagged" 
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            View all {items.length} flagged items →
          </Link>
        </div>
      )}
    </div>
  );
}

function ContentQuickActions() {
  const [bulkApproveTag, setBulkApproveTag] = useState("");
  const [autoModerationRule, setAutoModerationRule] = useState("");
  
  async function bulkApproveByTag() {
    const token = localStorage.getItem("admin_token");
    await fetch(${API_BASE}/admin/actions/bulk-approve-by-tag, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Bearer ${token},
      },
      body: JSON.stringify({ tag: bulkApproveTag }),
    });
    setBulkApproveTag("");
    window.location.reload();
  }
  
  async function addModerationRule() {
    const token = localStorage.getItem("admin_token");
    await fetch(${API_BASE}/admin/actions/add-moderation-rule, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Bearer ${token},
      },
      body: JSON.stringify({ rule: autoModerationRule }),
    });
    setAutoModerationRule("");
  }
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col md:flex-row gap-3 mb-6">
      <div className="flex-1 flex gap-2">
        <input
          placeholder="Bulk approve by tag..."
          value={bulkApproveTag}
          onChange={(e) => setBulkApproveTag(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
        <button
          onClick={bulkApproveByTag}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Bulk Approve
        </button>
      </div>
      <div className="flex-1 flex gap-2">
        <input
          placeholder="Add auto-moderation rule..."
          value={autoModerationRule}
          onChange={(e) => setAutoModerationRule(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
        />
        <button
          onClick={addModerationRule}
          className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
        >
          Add Rule
        </button>
      </div>
    </div>
  );
}

export default function AdminContent() {
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    status: "",
    flagged: "",
  });
  
  // Fetch content
  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(${API_BASE}/admin/content, {
          headers: { Authorization: Bearer ${token} },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Request failed");
        setContent(json.content || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);
  
  // Filter content
  useEffect(() => {
    let filtered = content;
    
    if (filters.search) {
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.userName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.id?.toString().includes(filters.search)
      );
    }
    
    if (filters.type) {
      filtered = filtered.filter(item => item.type === filters.type);
    }
    
    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }
    
    if (filters.flagged === "flagged") {
      filtered = filtered.filter(item => item.flagCount > 0);
    } else if (filters.flagged === "not-flagged") {
      filtered = filtered.filter(item => item.flagCount === 0);
    }
    
    setFilteredContent(filtered);
  }, [content, filters]);
  
  function refreshContent() {
    window.location.reload();
  }
  
  if (loading) return <div>Loading content...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <button 
          onClick={refreshContent}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>
      
      <ContentStats />
      
      <FlaggedContentSection />
      
      <ContentQuickActions />
      
      <ContentFilters filters={filters} setFilters={setFilters} />
      
      <ContentTable 
        content={filteredContent} 
        onUpdate={refreshContent}
      />
    </div>
  );
}