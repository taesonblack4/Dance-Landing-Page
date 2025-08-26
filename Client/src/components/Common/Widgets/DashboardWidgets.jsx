// src/components/DashboardWidgets.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

/* --- Small presentational pieces --- */
const StatCard = ({ label, value, loading }) => (
  <div style={cardStyle}>
    <div style={{ fontSize: 12, opacity: 0.7, color: 'black' }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 700 , color: 'red'}}>
      {loading ? '—' : value ?? '0'}
    </div>
  </div>
);

const PostPreview = ({ post, loading }) => (
  <div style={cardStyle}>
    <div style={{ fontSize: 12, opacity: 0.7 , color: 'black'}}>Latest post</div>
    {loading ? <div>Loading…</div> : post ? (
      <>
        <div style={{color: 'red'}}>
            <div style={{ fontWeight: 700 }}>{post.title}</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>{post.content?.slice(0, 140)}{post.content?.length > 140 ? '…' : ''}</div>
            <div style={{ marginTop: 8, fontSize: 11, opacity: 0.6 }}>Posted: {new Date(post.created_at).toLocaleString()}</div>
        </div>
      </>
    ) : <div>No posts</div>}
  </div>
);

const ListWidget = ({ title, items = [], renderItem, loading }) => (
  <div style={cardStyle}>
    <div style={{ fontSize: 12, opacity: 0.7 , color: 'black'}}>{title}</div>
    {loading ? <div>Loading…</div> : items.length ? items.slice(0,5).map(renderItem) : <div style={{ marginTop: 8 }}>No items</div>}
  </div>
);

const cardStyle = {
  background: '#fff',
  padding: 16,
  borderRadius: 8,
  boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
  minWidth: 200,
  minHeight: 86
};

/* --- Hook to fetch dashboard data --- */
function useDashboardData({ role = 'admin' } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const endpoint = role === 'admin' ? 'http://localhost:4004/admin/dashboard' : 'http://localhost:4004/basic/users/me/dashboard';

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem('accessToken');
    async function load() {
      setLoading(true);
      try {
        const resp = await axios.get(endpoint, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
      <StatCard label="Users (this wk)" value={data?.usersThisWeek} loading={loading} />
      <StatCard label="Leads (this wk)" value={data?.leadsThisWeek} loading={loading} />
      <StatCard label="Total users" value={data?.userCount} loading={loading} />
      <StatCard label="Total leads" value={data?.leadCount} loading={loading} />
      <PostPreview post={data?.latestPost} loading={loading} />
      {/* <ListWidget
        title="Recent feedback"
        items={data?.feedbackRecent ?? []}
        loading={loading}
        renderItem={(fb) => (
          <div key={fb.id} style={{ marginTop: 8 }}>
            <div style={{ fontWeight: 600 }}>{fb.user?.full_name || 'User'}</div>
            <div style={{ fontSize: 13 }}>{fb.message.slice(0,80)}{fb.message.length>80 && '…'}</div>
          </div>
        )}
      /> */}
      {/* <ListWidget
        title="Bookings today"
        items={data?.bookingsToday ?? []}
        loading={loading}
        renderItem={(b) => (
          <div key={b.id} style={{ marginTop: 8 }}>
            <div style={{ fontWeight: 700 }}>{b.user?.full_name}</div>
            <div style={{ fontSize: 13 }}>{new Date(b.startsAt).toLocaleTimeString()} — {b.status}</div>
          </div>
        )}
      /> */}
    </div>
  );
}

/* --- User widgets --- */
export function UserWidgets() {
  const { data, loading } = useDashboardData({ role: 'user' });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
      <ListWidget
        title="Active goals"
        items={data?.activeGoals ?? []}
        loading={loading}
        renderItem={(g) => (
          <div key={g.id} style={{ marginTop: 8 }}>
            <div style={{ fontWeight: 700 , color: 'black'}}>{g.title}</div>
            <div style={{ fontSize: 12 , color: 'red' }}>{g.status} • updated {new Date(g.updated_at).toLocaleDateString()}</div>
          </div>
        )}
      />
      {/* <ListWidget
        title="Top 3 goals"
        items={data?.topGoals ?? []}
        loading={loading}
        renderItem={(g) => <div key={g.id} style={{ marginTop: 8 }}>{g.title}</div>}
      /> */}
      <PostPreview post={data?.latestPost} loading={loading} />
      {/* <ListWidget
        title="Recent bookings"
        items={data?.recentBookings ?? []}
        loading={loading}
        renderItem={(b) => <div key={b.id} style={{ marginTop: 8 }}>{new Date(b.startsAt).toLocaleString()} — {b.status}</div>}
      /> */}
    </div>
  );
}
