import { useEffect, useState } from "react";
import { Link, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  TrendingUp,
  Download,
  AlertTriangle,
  Shield,
  Server,
  Activity,
  UserCheck,
  UserX,
  Send,
  Plus,
  Crown,
  Zap,
  Star,
  MessageSquare,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Sparkles,
  HardDrive,
  Clock,
  Globe,
  Target,
  Heart,
} from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { Outlet } from 'react-router-dom';


// This is a custom hook to simulate API calls and data fetching
function useAdminApi(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const simulateApiCall = () => {
      // We are using a setTimeout to simulate a network request delay
      setTimeout(() => {
        // Mock data responses for different paths
        const mockData = {
          "/admin/metrics": {
            total_users: 12847,
            new_users: 324,
            total_conversions: 8945,
            total_downloads: 15623
          },
          "/admin/recent-users": {
            users: [
              { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "active", created_at: "2024-08-15" },
              { id: 2, name: "Bob Smith", email: "bob@example.com", status: "suspended", created_at: "2024-08-20" },
              { id: 3, name: "Carol Davis", email: "carol@example.com", status: "active", created_at: "2024-08-25" },
              { id: 4, name: "David Wilson", email: "david@example.com", status: "active", created_at: "2024-08-28" }
            ]
          },
          "/admin/flagged": {
            items: [
              { id: 1, content_type: "Document", user_id: 123, reason: "Inappropriate content", status: "pending" },
              { id: 2, content_type: "Article", user_id: 456, reason: "Copyright violation", status: "pending" }
            ]
          },
          "/admin/system-health": {
            status: "healthy",
            database_size: "2.4 GB",
            files_processed_today: 156,
            system_uptime: "99.8%"
          },
          "/admin/growth-chart": {
            data: [
              { month: 'Jan', users: 1200, conversions: 890, revenue: 4500 },
              { month: 'Feb', users: 1900, conversions: 1560, revenue: 7800 },
              { month: 'Mar', users: 2400, conversions: 1980, revenue: 9900 },
              { month: 'Apr', users: 3500, conversions: 2760, revenue: 13800 },
              { month: 'May', users: 4200, conversions: 3340, revenue: 16700 },
              { month: 'Jun', users: 5800, conversions: 4450, revenue: 22250 }
            ]
          },
          "/admin/content-chart": {
            data: [
              { name: 'Documents', value: 45, color: '#6366F1' },
              { name: 'Books', value: 30, color: '#10B981' },
              { name: 'Articles', value: 15, color: '#F59E0B' },
              { name: 'Others', value: 10, color: '#EF4444' }
            ]
          },
          "/admin/engagement-data": {
            data: [
              { day: 'Mon', sessions: 280, downloads: 150, users: 180 },
              { day: 'Tue', sessions: 350, downloads: 180, users: 200 },
              { day: 'Wed', sessions: 420, downloads: 210, users: 250 },
              { day: 'Thu', sessions: 400, downloads: 190, users: 220 },
              { day: 'Fri', sessions: 550, downloads: 300, users: 350 },
              { day: 'Sat', sessions: 600, downloads: 320, users: 400 },
              { day: 'Sun', sessions: 580, downloads: 310, users: 380 }
            ],
            metrics: [
              { title: 'Avg. Session', value: '7m 45s', icon: Clock, gradient: 'from-blue-500 to-indigo-600', bgGradient: 'from-blue-50 to-indigo-50', change: '+3.2%' },
              { title: 'Bounce Rate', value: '25.6%', icon: Globe, gradient: 'from-emerald-500 to-teal-600', bgGradient: 'from-emerald-50 to-teal-50', change: '-5.1%' },
              { title: 'Conversions', value: '4.8%', icon: Target, gradient: 'from-purple-500 to-fuchsia-600', bgGradient: 'from-purple-50 to-fuchsia-50', change: '+1.4%' },
              { title: 'Favorites', value: '15.2K', icon: Heart, gradient: 'from-rose-500 to-pink-600', bgGradient: 'from-rose-50 to-pink-50', change: '+8.9%' }
            ]
          }
        };
        setData(mockData[path] || {});
        setLoading(false);
      }, 500);
    };

    simulateApiCall();
  }, [path]);

  return { data, loading, error };
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-border"></div>
        <div className="absolute inset-0 animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-transparent bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-border" style={{ animationDirection: 'reverse', animationDuration: '0.75s' }}></div>
      </div>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5"></div>
      <div className="relative flex items-center">
        <div className="p-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
          <AlertTriangle className="h-5 w-5 text-white" />
        </div>
        <div className="ml-4">
          <h4 className="font-semibold text-red-800">Error Occurred</h4>
          <p className="text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );
}

function MessageModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center space-y-4">
        <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 inline-block shadow-lg">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Success!</h3>
        <p className="text-gray-600">{message}</p>
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function KPIs() {
  const { data, loading, error } = useAdminApi("/admin/metrics");

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const metrics = [
    {
      title: "Total Users",
      value: data?.total_users || 0,
      icon: Users,
      gradient: "from-indigo-600 via-purple-600 to-pink-600",
      bgGradient: "from-indigo-50 to-purple-50",
      iconBg: "from-indigo-500 to-purple-600",
      change: "+12.5%",
      trend: "up"
    },
    {
      title: "New Users",
      value: data?.new_users || 0,
      icon: UserCheck,
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      bgGradient: "from-emerald-50 to-teal-50",
      iconBg: "from-emerald-500 to-teal-600",
      change: "+8.2%",
      trend: "up"
    },
    {
      title: "Total Conversions",
      value: data?.total_conversions || 0,
      icon: Sparkles,
      gradient: "from-amber-600 via-orange-600 to-red-600",
      bgGradient: "from-amber-50 to-orange-50",
      iconBg: "from-amber-500 to-orange-600",
      change: "+15.7%",
      trend: "up"
    },
    {
      title: "Downloads",
      value: data?.total_downloads || 0,
      icon: Download,
      gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
      bgGradient: "from-violet-50 to-purple-50",
      iconBg: "from-violet-500 to-purple-600",
      change: "+22.1%",
      trend: "up"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div
            key={index}
            className={`relative overflow-hidden bg-gradient-to-br ${metric.bgGradient} rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 group`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${metric.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>
                    {metric.change}
                  </div>
                  <div className="text-xs text-gray-500">vs last month</div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">{metric.title}</p>
                <p className={`text-4xl font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>
                  {metric.value.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GrowthChart() {
  const { data, loading, error } = useAdminApi("/admin/growth-chart");

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  const growthData = data?.data || [];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-1">
        <div className="bg-white rounded-3xl">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Growth Analytics
                </h3>
                <p className="text-gray-600 mt-1">Track your platform's growth trajectory</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="conversionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#usersGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="conversions"
                  stroke="#10B981"
                  strokeWidth={3}
                  fill="url(#conversionsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryChart() {
  const { data, loading, error } = useAdminApi("/admin/content-chart");

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  const categoryData = data?.data || [];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-1">
        <div className="bg-white rounded-3xl">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Content Distribution
                </h3>
                <p className="text-gray-600 mt-1">Breakdown by content type</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={30}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3 shadow-sm"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700 font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentUsers() {
  const { data, loading, error } = useAdminApi("/admin/recent-users");

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  const users = data?.users || [];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          User Management
        </h1>
        <p className="text-xl text-gray-600">Manage and monitor your platform users</p>
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-1">
          <div className="bg-white rounded-3xl">
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">Recent Users</h3>
                    <p className="text-gray-600">Latest platform registrations</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                  <div className="text-sm text-gray-500">Active users</div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">User</th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Joined</th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-12 w-12 rounded-2xl bg-gradient-to-r ${
                            index % 4 === 0 ? 'from-blue-500 to-purple-600' :
                              index % 4 === 1 ? 'from-emerald-500 to-teal-600' :
                                index % 4 === 2 ? 'from-amber-500 to-orange-600' :
                                  'from-pink-500 to-rose-600'
                            } flex items-center justify-center shadow-lg`}>
                            <span className="text-white text-lg font-bold">
                              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-lg font-bold text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500 font-medium">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-base text-gray-900 font-medium">
                        {user.email}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                          user.status === 'active'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                            : 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                          }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-base text-gray-700">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <SuspendButton userId={user.id} currentStatus={user.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuspendButton({ userId, currentStatus }) {
  const [busy, setBusy] = useState(false);
  const [showModal, setShowModal] = useState(false);

  async function suspend() {
    setBusy(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowModal(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        disabled={busy || currentStatus === 'suspended'}
        onClick={suspend}
        className={`inline-flex items-center px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg transform hover:scale-105 ${
          currentStatus === 'active'
            ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white hover:shadow-xl'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
      >
        <UserX className="h-4 w-4 mr-2" />
        {busy ? 'Processing...' : currentStatus === 'suspended' ? 'Suspended' : 'Suspend'}
      </button>
      {showModal && (
        <MessageModal
          message={`User ID ${userId} has been suspended.`}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

function FlaggedContent() {
  const { data, loading, error } = useAdminApi("/admin/flagged");

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  const items = data?.items || [];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Content Moderation
        </h1>
        <p className="text-xl text-gray-600">Review and manage flagged content</p>
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 p-1">
          <div className="bg-white rounded-3xl">
            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">Content Safety</h3>
                    <p className="text-gray-600">Flagged items requiring attention</p>
                  </div>
                </div>
              </div>
            </div>
            {items.length === 0 ? (
              <div className="px-8 py-16 text-center">
                <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 inline-block shadow-xl mb-6">
                  <Shield className="h-16 w-16 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">All Clear!</h4>
                <p className="text-gray-600 text-lg">No flagged content at the moment</p>
                <p className="text-sm text-gray-500 mt-2">Your community guidelines are being followed</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Content</th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">User</th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Reason</th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all duration-300">
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-3 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 shadow-lg">
                              <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div className="ml-4">
                              <div className="text-base font-bold text-gray-900">{item.content_type}</div>
                              <div className="text-sm text-gray-500 font-medium">ID: {item.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-base text-gray-900 font-medium">
                          User {item.user_id}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-base text-gray-900 font-medium">{item.reason}</div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                            {item.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex space-x-3">
                            <ResolveButton id={item.id} action="approve" />
                            <ResolveButton id={item.id} action="reject" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResolveButton({ id, action }) {
  const [busy, setBusy] = useState(false);
  const [showModal, setShowModal] = useState(false);

  async function run() {
    setBusy(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowModal(true);
    } finally {
      setBusy(false);
    }
  }

  const isApprove = action === 'approve';
  const Icon = isApprove ? CheckCircle : XCircle;

  return (
    <>
      <button
        disabled={busy}
        onClick={run}
        className={`inline-flex items-center px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg transform hover:scale-105 ${
          isApprove
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white hover:shadow-xl'
            : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white hover:shadow-xl'
          }`}
      >
        <Icon className="h-4 w-4 mr-2" />
        {busy ? 'Processing...' : action}
      </button>
      {showModal && (
        <MessageModal
          message={`Content ID ${id} has been ${action}d successfully.`}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

function QuickActions() {
  const [modEmail, setModEmail] = useState("");
  const [announce, setAnnounce] = useState("");
  const [loading, setLoading] = useState({ moderator: false, announcement: false });
  const [modalMessage, setModalMessage] = useState("");

  async function addModerator() {
    if (!modEmail) return;
    setLoading(prev => ({ ...prev, moderator: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setModEmail("");
      setModalMessage("Moderator added successfully!");
    } catch (error) {
      setModalMessage("Failed to add moderator");
    } finally {
      setLoading(prev => ({ ...prev, moderator: false }));
    }
  }

  async function sendAnnouncement() {
    if (!announce) return;
    setLoading(prev => ({ ...prev, announcement: true }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnnounce("");
      setModalMessage("Announcement sent successfully!");
    } catch (error) {
      setModalMessage("Failed to send announcement");
    } finally {
      setLoading(prev => ({ ...prev, announcement: false }));
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {modalMessage && (
        <MessageModal
          message={modalMessage}
          onClose={() => setModalMessage("")}
        />
      )}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-1">
          <div className="bg-white rounded-3xl p-8">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-gray-900">Add Moderator</h3>
                <p className="text-gray-600">Grant moderation privileges</p>
              </div>
            </div>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter moderator email address"
                value={modEmail}
                onChange={(e) => setModEmail(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg transition-all duration-300 bg-gray-50 hover:bg-white"
              />
              <button
                onClick={addModerator}
                disabled={loading.moderator || !modEmail}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading.moderator ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Adding Moderator...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Crown className="h-5 w-5 mr-2" />
                    Add Moderator
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-1">
          <div className="bg-white rounded-3xl p-8">
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg">
                <Send className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-gray-900">Global Announcement</h3>
                <p className="text-gray-600">Broadcast to all users</p>
              </div>
            </div>
            <div className="space-y-4">
              <textarea
                placeholder="Type your announcement message here..."
                value={announce}
                onChange={(e) => setAnnounce(e.target.value)}
                rows="3"
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg transition-all duration-300 bg-gray-50 hover:bg-white resize-none"
              />
              <button
                onClick={sendAnnouncement}
                disabled={loading.announcement || !announce}
                className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading.announcement ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Broadcasting...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Send Announcement
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemHealth() {
  const { data, loading, error } = useAdminApi("/admin/system-health");

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  const getHealthColor = (status) => {
    if (status === 'healthy') return 'from-emerald-500 to-teal-600';
    if (status === 'warning') return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getHealthIcon = (status) => {
    if (status === 'healthy') return CheckCircle;
    if (status === 'warning') return AlertTriangle;
    return XCircle;
  };

  const HealthIcon = getHealthIcon(data?.status || 'healthy');

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-1">
        <div className="bg-white rounded-3xl">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  System Health Monitor
                </h3>
                <p className="text-gray-600 mt-1">Real-time system performance metrics</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-600 shadow-lg">
                <Server className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 inline-block shadow-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <HardDrive className="h-10 w-10 text-white" />
                </div>
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">Database Size</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {data?.database_size || '0 MB'}
                </p>
              </div>
              <div className="text-center group">
                <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 inline-block shadow-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="h-10 w-10 text-white" />
                </div>
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">Files Today</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {data?.files_processed_today || 0}
                </p>
              </div>
              <div className="text-center group">
                <div className={`p-6 rounded-3xl bg-gradient-to-r ${getHealthColor(data?.status)} inline-block shadow-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <HealthIcon className="h-10 w-10 text-white" />
                </div>
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">System Status</p>
                <p className={`text-3xl font-bold bg-gradient-to-r ${getHealthColor(data?.status)} bg-clip-text text-transparent`}>
                  {data?.status === 'healthy' ? 'Healthy' : data?.status || 'Unknown'}
                </p>
              </div>
            </div>
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-md">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <span className="ml-3 text-lg font-bold text-gray-700">System Uptime</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {data?.system_uptime || '99.9%'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    const currentPath = location.pathname.replace('/dashboard', '');
    return currentPath === path;
  };

  function logout() {
    // This would contain your actual logout logic
    navigate("/admin-login");
  }

  const navItems = [
    { path: "", label: "Dashboard", icon: BarChart3, gradient: "from-blue-500 to-purple-600" },
    { path: "/users", label: "Users", icon: Users, gradient: "from-indigo-500 to-purple-600" },
    { path: "/content", label: "Content", icon: Shield, gradient: "from-orange-500 to-red-600" },
    { path: "/reports", label: "Reports", icon: TrendingUp, gradient: "from-emerald-500 to-teal-600" },
    { path: "/settings", label: "Settings", icon: Settings, gradient: "from-gray-500 to-slate-600" }
  ];

  return (
    <div className="w-80 min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      <div className="relative z-10 p-8">
        <div className="text-center mb-12">
          <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 inline-block shadow-2xl mb-6">
            <Crown className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            EchoVerse
          </h2>
          <p className="text-slate-400 font-medium">Admin Control Center</p>
        </div>
        <nav className="space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                  active
                    ? 'bg-white/20 text-white font-bold shadow-xl backdrop-blur-sm border border-white/20'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white hover:shadow-lg'
                }`}
              >
                {active && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20 rounded-2xl`}></div>
                )}
                <div className={`p-2 rounded-xl bg-gradient-to-r ${item.gradient} shadow-lg ${
                  active ? 'shadow-xl' : 'group-hover:shadow-xl'
                  } transition-all duration-300`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="relative font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-8 left-8 right-8">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-2xl transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardHome() {
  return (
    <div className="space-y-12 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="text-center py-8">
        <div className="inline-block p-4 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-2xl mb-6">
          <Sparkles className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Dashboard Overview
        </h1>
        <p className="text-2xl text-gray-600 font-medium">Welcome back! Here's your platform insights</p>
      </div>
      <KPIs />
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
        <GrowthChart />
        <CategoryChart />
      </div>
      <QuickActions />
      <SystemHealth />
    </div>
  );
}

function UserStats() {
  return <RecentUsers />;
}

function ContentStats() {
  return <FlaggedContent />;
}

function EngagementStats() {
  const { data, loading, error } = useAdminApi("/admin/engagement-data");

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const engagementData = data?.data || [];
  const performanceMetrics = data?.metrics || [];

  return (
    <div className="space-y-12 min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="text-center py-8">
        <div className="inline-block p-4 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-2xl mb-6">
          <TrendingUp className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
          Engagement Reports
        </h1>
        <p className="text-2xl text-gray-600 font-medium">Detailed weekly and monthly performance reports</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-1">
          <div className="bg-white rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  Weekly Performance
                </h3>
                <p className="text-gray-600 mt-1">7-day engagement overview</p>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={engagementData}>
                <defs>
                  <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="downloadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" tick={{ fontSize: 14, fontWeight: 'bold' }} />
                <YAxis tick={{ fontSize: 14, fontWeight: 'bold' }} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '20px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Area type="monotone" dataKey="sessions" stroke="#3B82F6" strokeWidth={3} fill="url(#sessionsGradient)" />
                <Area type="monotone" dataKey="downloads" stroke="#10B981" strokeWidth={3} fill="url(#downloadsGradient)" />
                <Area type="monotone" dataKey="users" stroke="#8B5CF6" strokeWidth={3} fill="url(#usersGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className={`relative overflow-hidden bg-gradient-to-br ${metric.bgGradient} rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 group`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${metric.gradient} shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>
                      {metric.change}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">improvement</div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">{metric.title}</p>
                  <p className={`text-3xl font-bold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>
                    {metric.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-12 min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <div className="text-center py-8">
        <div className="inline-block p-4 rounded-3xl bg-gradient-to-r from-gray-700 via-slate-700 to-zinc-700 shadow-2xl mb-6">
          <Settings className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-700 via-slate-700 to-zinc-700 bg-clip-text text-transparent mb-4">
          System Settings
        </h1>
        <p className="text-2xl text-gray-600 font-medium">Configure and customize your platform</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-1">
            <div className="bg-white rounded-3xl p-8">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                  <Server className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900">System Configuration</h3>
                  <p className="text-gray-600">Core platform settings</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                    Max File Size (MB)
                  </label>
                  <input
                    type="number"
                    defaultValue="50"
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg transition-all duration-300 bg-gray-50 hover:bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                    Allowed File Types
                  </label>
                  <input
                    type="text"
                    defaultValue="pdf, txt, docx, epub"
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg transition-all duration-300 bg-gray-50 hover:bg-white font-medium"
                  />
                </div>
                <button className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                  <div className="flex items-center justify-center">
                    <Star className="h-5 w-5 mr-2" />
                    Save Configuration
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-1">
            <div className="bg-white rounded-3xl p-8">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900">Notification Preferences</h3>
                  <p className="text-gray-600">Manage alert settings</p>
                </div>
              </div>
              <div className="space-y-6">
                {[
                  { label: "Email Notifications", checked: true },
                  { label: "User Registration Alerts", checked: true },
                  { label: "System Health Alerts", checked: true },
                  { label: "Security Alerts", checked: true },
                  { label: "Performance Warnings", checked: false }
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl shadow-inner">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-xl ${setting.checked ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gray-300'} shadow-md transition-all duration-300`}>
                        {setting.checked ? <CheckCircle className="h-5 w-5 text-white" /> : <XCircle className="h-5 w-5 text-gray-500" />}
                      </div>
                      <span className="ml-4 text-lg font-medium text-gray-800">{setting.label}</span>
                    </div>
                    <div className="relative inline-block w-14 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input
                        type="checkbox"
                        name={`toggle-${index}`}
                        id={`toggle-${index}`}
                        defaultChecked={setting.checked}
                        className="toggle-checkbox absolute block w-8 h-8 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 checked:right-0 checked:border-blue-600 focus:outline-none"
                      />
                      <label htmlFor={`toggle-${index}`} className="toggle-label block overflow-hidden h-8 rounded-full bg-gray-300 cursor-pointer checked:bg-blue-600"></label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminApp() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-12 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000); // Redirect after 5 seconds
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-12">
        <div className="p-6 rounded-3xl bg-gradient-to-r from-red-500 to-pink-600 inline-block shadow-xl mb-6 animate-bounce-slow">
          <AlertTriangle className="h-16 w-16 text-white" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">The page you are looking for does not exist.</p>
        <p className="text-md text-gray-500">You will be redirected to the dashboard in 5 seconds.</p>
        <Link to="/admin-dashboard" className="mt-8 inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}


// Main App component to handle routing
function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminApp />}>
        <Route index element={<DashboardHome />} />
        <Route path="users" element={<UserStats />} />
        <Route path="content" element={<ContentStats />} />
        <Route path="reports" element={<EngagementStats />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;