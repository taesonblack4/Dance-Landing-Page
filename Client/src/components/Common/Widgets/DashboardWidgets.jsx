// src/components/DashboardWidgets.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../styles/private/Common/Widgets.css';
import { ADMIN_ROUTES, USER_ROUTES } from '../db-urls';

/* --- Small presentational pieces --- */
const StatCard = ({ label, value, loading }) => (
  <div className="card">
    <div className="card-label">{label}</div>
    <div className="card-value">{loading ? '—' : value ?? '0'}</div>
  </div>
);

const PostPreview = ({ post, loading }) => (
  <div className="card">
    <div className="card-label">Latest post</div>
    {loading ? (
      <div>Loading…</div>
    ) : post ? (
      <>
        <div className="card-title">{post.title}</div>
        <div className="card-subtext">
          {post.content?.slice(0, 140)}
          {post.content?.length > 140 ? '…' : ''}
        </div>
        <div className="card-meta">
          Posted: {new Date(post.created_at).toLocaleString()}
        </div>
      </>
    ) : (
      <div>No posts</div>
    )}
  </div>
);

const ListWidget = ({ title, items = [], renderItem, loading }) => (
  <div className="card">
    <div className="card-label">{title}</div>
    {loading ? (
      <div>Loading…</div>
    ) : items.length ? (
      items.slice(0, 5).map(renderItem)
    ) : (
      <div className="card-empty">No items</div>
    )}
  </div>
);

/* --- Hook to fetch dashboard data --- */
function useDashboardData({ role = 'admin' } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const endpoint =
    role === 'admin'
      ? ADMIN_ROUTES.dashboard
      : USER_ROUTES.myDashboard;

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem('accessToken');
    async function load() {
      setLoading(true);
      try {
        const resp = await axios.get(endpoint, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!cancelled) setData(resp.data);
      } catch (err) {
        console.error('Dashboard fetch error', err);
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    // optional: poll every 60s
    const timer = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [endpoint]);

  return { data, loading };
}

/* --- Admin widgets (arrange the cards) --- */
export function AdminWidgets() {
  const { data, loading } = useDashboardData({ role: 'admin' });

  return (
    <div className="widgets-grid">
      <StatCard label="Users (this wk)" value={data?.usersThisWeek} loading={loading} />
      <StatCard label="Leads (this wk)" value={data?.leadsThisWeek} loading={loading} />
      <StatCard label="Total users" value={data?.userCount} loading={loading} />
      <StatCard label="Total leads" value={data?.leadCount} loading={loading} />
      <PostPreview post={data?.latestPost} loading={loading} />
    </div>
  );
}

/* --- User widgets --- */
export function UserWidgets() {
  const { data, loading } = useDashboardData({ role: 'user' });

  return (
    <div className="widgets-grid">
      <ListWidget
        title="Active goals"
        items={data?.activeGoals ?? []}
        loading={loading}
        renderItem={(g) => (
          <div key={g.id} className="goal-item">
            <div className="card-title">{g.title}</div>
            <div className="goal-status">
              {g.status} • updated {new Date(g.updated_at).toLocaleDateString()}
            </div>
          </div>
        )}
      />
      <PostPreview post={data?.latestPost} loading={loading} />
    </div>
  );
}
