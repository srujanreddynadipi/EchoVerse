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

function EngagementStats() {
  const { data, loading, error } = useAdminApi("/admin/reports/engagement");
  if (loading) return <div>Loading engagement stats...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  
  const stats = [
    {
      label: "Daily Active Users",
      value: data?.dailyActiveUsers || "1,247",
      change: "+12%",
      positive: true,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      label: "Session Duration",
      value: data?.avgSessionDuration || "8m 32s",
      change: "+5%",
      positive: true,
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      label: "Content Interactions",
      value: data?.contentInteractions || "15.2k",
      change: "+18%",
      positive: true,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      label: "Bounce Rate",
      value: data?.bounceRate || "23.4%",
      change: "-3%",
      positive: true,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={rounded-2xl p-5 bg-gradient-to-r ${stat.gradient} text-white shadow-lg}
        >
          <div className="text-sm opacity-80">{stat.label}</div>
          <div className="text-3xl font-bold">{stat.value}</div>
          <div className={text-sm mt-1 ${stat.positive ? 'text-green-200' : 'text-red-200'}}>
            {stat.change} vs last week
          </div>
        </div>
      ))}
    </div>
  );
}

function UserGrowthChart() {
  const { data, loading, error } = useAdminApi("/admin/reports/user-growth");
  if (loading) return <div>Loading growth data...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  // Mock data for demonstration
  const mockData = [
    { day: "Mon", users: 120, signups: 15 },
    { day: "Tue", users: 135, signups: 22 },
    { day: "Wed", users: 148, signups: 18 },
    { day: "Thu", users: 162, signups: 28 },
    { day: "Fri", users: 180, signups: 25 },
    { day: "Sat", users: 195, signups: 20 },
    { day: "Sun", users: 210, signups: 17 },
  ];

  const chartData = data?.weeklyGrowth || mockData;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">User Growth</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            <span className="text-gray-600">Total Users</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-gray-600">New Signups</span>
          </div>
        </div>
      </div>
      <div className="h-64 flex items-end gap-4">
        {chartData.map((day, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="relative flex flex-col items-center gap-1 w-full">
              <div 
                className="w-full bg-indigo-200 rounded-t"
                style={{ height: ${(day.users / 250) * 180}px }}
              ></div>
              <div 
                className="w-full bg-emerald-400 rounded-t"
                style={{ height: ${(day.signups / 30) * 60}px }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 font-medium">{day.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentAnalytics() {
  const { data, loading, error } = useAdminApi("/admin/reports/content");
  if (loading) return <div>Loading content analytics...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  const categories = [
    { name: "Images", count: data?.categories?.images || 3420, color: "bg-blue-500" },
    { name: "Videos", count: data?.categories?.videos || 1856, color: "bg-purple-500" },
    { name: "Documents", count: data?.categories?.documents || 892, color: "bg-green-500" },
    { name: "Audio", count: data?.categories?.audio || 445, color: "bg-orange-500" },
  ];

  const total = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Content Distribution</h3>
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.name} className="flex items-center gap-4">
            <div className="w-20 text-sm font-medium text-gray-700">{cat.name}</div>
            <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className={h-3 ${cat.color} transition-all duration-500}
                style={{ width: ${(cat.count / total) * 100}% }}
              />
            </div>
            <div className="text-sm font-semibold text-gray-800 w-16 text-right">
              {cat.count.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopPerformers() {
  const { data, loading, error } = useAdminApi("/admin/reports/top-performers");
  if (loading) return <div>Loading top performers...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  const performers = data?.topContent || [
    { id: "c_1234", title: "Amazing Sunset Photography", views: 45200, likes: 2840, user: "john_photo" },
    { id: "c_1235", title: "React Best Practices Guide", views: 38900, likes: 2156, user: "dev_sarah" },
    { id: "c_1236", title: "Homemade Pasta Tutorial", views: 32100, likes: 1923, user: "chef_mario" },
    { id: "c_1237", title: "JavaScript Tips & Tricks", views: 28700, likes: 1745, user: "code_ninja" },
    { id: "c_1238", title: "Landscape Design Ideas", views: 25300, likes: 1502, user: "garden_guru" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 font-semibold">
        Top Performing Content
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="text-left px-6 py-3">Content</th>
              <th className="text-left px-6 py-3">Creator</th>
              <th className="text-left px-6 py-3">Views</th>
              <th className="text-left px-6 py-3">Likes</th>
              <th className="text-left px-6 py-3">Engagement Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {performers.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-500">ID: {item.id}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.user}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.views.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.likes.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">
                    {((item.likes / item.views) * 100).toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportFilters() {
  const [timeRange, setTimeRange] = useState("7d");
  const [category, setCategory] = useState("all");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row gap-4">
      <div className="flex gap-2 items-center">
        <label className="text-sm font-medium text-gray-700">Time Range:</label>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>
      <div className="flex gap-2 items-center">
        <label className="text-sm font-medium text-gray-700">Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="all">All Content</option>
          <option value="images">Images</option>
          <option value="videos">Videos</option>
          <option value="documents">Documents</option>
          <option value="audio">Audio</option>
        </select>
      </div>
      <div className="sm:ml-auto flex gap-2">
        <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm">
          Export CSV
        </button>
        <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm">
          Share Report
        </button>
      </div>
    </div>
  );
}

function ActivityTimeline() {
  const { data, loading, error } = useAdminApi("/admin/reports/activity");
  if (loading) return <div>Loading activity...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  const activities = data?.recentActivity || [
    { id: 1, type: "signup", user: "alice_dev", time: "2 minutes ago", icon: "👤" },
    { id: 2, type: "upload", user: "bob_designer", time: "5 minutes ago", icon: "📁" },
    { id: 3, type: "report", user: "charlie_user", time: "12 minutes ago", icon: "🚨" },
    { id: 4, type: "login", user: "diana_admin", time: "18 minutes ago", icon: "🔐" },
    { id: 5, type: "upload", user: "eve_creator", time: "25 minutes ago", icon: "📁" },
    { id: 6, type: "signup", user: "frank_new", time: "32 minutes ago", icon: "👤" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 font-semibold">
        Recent Activity
      </div>
      <div className="p-4 max-h-80 overflow-y-auto">
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="text-lg">{activity.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {activity.type === 'signup' && 'New user registration'}
                  {activity.type === 'upload' && 'Content uploaded'}
                  {activity.type === 'report' && 'Content reported'}
                  {activity.type === 'login' && 'Admin login'}
                </div>
                <div className="text-xs text-gray-500">
                  by {activity.user} • {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RevenueMetrics() {
  const { data, loading, error } = useAdminApi("/admin/reports/revenue");
  if (loading) return <div>Loading revenue data...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  const metrics = [
    {
      label: "Monthly Revenue",
      value: data?.monthlyRevenue || "$12,450",
      target: "$15,000",
      percentage: 83,
      color: "bg-emerald-500",
    },
    {
      label: "Premium Conversions",
      value: data?.conversions || "127",
      target: "150",
      percentage: 85,
      color: "bg-blue-500",
    },
    {
      label: "Avg. Revenue Per User",
      value: data?.arpu || "$4.25",
      target: "$5.00",
      percentage: 85,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Revenue Metrics</h3>
      <div className="space-y-6">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{metric.label}</span>
              <span className="text-sm text-gray-500">Target: {metric.target}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <div className="flex-1">
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={h-2 ${metric.color} transition-all duration-500}
                    style={{ width: ${metric.percentage}% }}
                  />
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-600">{metric.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModerationStats() {
  const { data, loading, error } = useAdminApi("/admin/reports/moderation");
  if (loading) return <div>Loading moderation stats...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  const moderationData = [
    { type: "Auto-approved", count: data?.autoApproved || 1248, color: "bg-emerald-500" },
    { type: "Manual review", count: data?.manualReview || 156, color: "bg-amber-500" },
    { type: "Rejected", count: data?.rejected || 23, color: "bg-red-500" },
    { type: "Appeals", count: data?.appeals || 7, color: "bg-blue-500" },
  ];

  const totalContent = moderationData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Moderation Overview</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {moderationData.map((item) => (
          <div key={item.type} className="text-center">
            <div className={w-16 h-16 ${item.color} rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-2}>
              {item.count}
            </div>
            <div className="text-sm font-medium text-gray-700">{item.type}</div>
            <div className="text-xs text-gray-500">
              {((item.count / totalContent) * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          Total content processed: <span className="font-semibold">{totalContent.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminReports() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      <ReportFilters />
      <EngagementStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserGrowthChart />
        <ContentAnalytics />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopPerformers />
        <div className="space-y-4">
          <ActivityTimeline />
          <ModerationStats />
        </div>
      </div>
    </div>
  );
}