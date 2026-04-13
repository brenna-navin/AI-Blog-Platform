import type { CSSProperties } from "react";

type Post = {
  id: number;
  title: string;
  status: "Draft" | "Published" | "Scheduled";
  category: string;
  updatedAt: string;
};

const posts: Post[] = [
  {
    id: 1,
    title: "How I Built My Dream Blog Setup",
    status: "Published",
    category: "Tech",
    updatedAt: "Apr 9, 2026",
  },
  {
    id: 2,
    title: "5 Writing Habits That Keep Me Consistent",
    status: "Draft",
    category: "Lifestyle",
    updatedAt: "Apr 8, 2026",
  },
  {
    id: 3,
    title: "My Favorite Tools for Creators in 2026",
    status: "Scheduled",
    category: "Productivity",
    updatedAt: "Apr 12, 2026",
  },
];

const statusColors: Record<Post["status"], string> = {
  Published: "#d1fae5",
  Draft: "#fef3c7",
  Scheduled: "#dbeafe",
};

export default function AdminPage() {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div>
          <p style={styles.eyebrow}>Blog Admin Panel</p>
          <h1 style={styles.title}>Manage your content with confidence.</h1>
          <p style={styles.subtitle}>
            Review posts, track stats, and create your next article from one
            simple dashboard.
          </p>
        </div>

        <div style={styles.heroActions}>
          <button style={styles.primaryButton}>+ New Post</button>
          <button style={styles.secondaryButton}>View Blog</button>
        </div>
      </section>

      <section style={styles.statsGrid}>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Total Posts</p>
          <h2 style={styles.cardValue}>48</h2>
          <span style={styles.cardHint}>+6 this month</span>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Published</p>
          <h2 style={styles.cardValue}>36</h2>
          <span style={styles.cardHint}>75% live content</span>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Drafts</p>
          <h2 style={styles.cardValue}>9</h2>
          <span style={styles.cardHint}>3 need review</span>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>Monthly Views</p>
          <h2 style={styles.cardValue}>18.4K</h2>
          <span style={styles.cardHint}>+12% from last month</span>
        </div>
      </section>

      <section style={styles.contentGrid}>
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h3 style={styles.panelTitle}>Recent Posts</h3>
              <p style={styles.panelText}>Latest activity across your blog.</p>
            </div>
            <button style={styles.smallButton}>Manage All</button>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHead}>Title</th>
                  <th style={styles.tableHead}>Category</th>
                  <th style={styles.tableHead}>Status</th>
                  <th style={styles.tableHead}>Updated</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td style={styles.tableCellStrong}>{post.title}</td>
                    <td style={styles.tableCell}>{post.category}</td>
                    <td style={styles.tableCell}>
                      <span
                        style={{
                          ...styles.badge,
                          backgroundColor: statusColors[post.status],
                        }}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td style={styles.tableCell}>{post.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={styles.sidebar}>
          <div style={styles.panel}>
            <h3 style={styles.panelTitle}>Quick Actions</h3>
            <div style={styles.actionList}>
              <button style={styles.actionButton}>Write New Article</button>
              <button style={styles.actionButton}>Upload Cover Image</button>
              <button style={styles.actionButton}>Check Comments</button>
              <button style={styles.actionButton}>Edit Categories</button>
            </div>
          </div>

          <div style={styles.panel}>
            <h3 style={styles.panelTitle}>Performance Snapshot</h3>
            <p style={styles.metricLabel}>Top Post</p>
            <p style={styles.metricValue}>Designing a Blog Readers Love</p>
            <p style={styles.panelText}>4.2K views this month</p>
            <div style={styles.progressTrack}>
              <div style={styles.progressFill} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #eef2ff 100%)",
    padding: "32px",
    fontFamily: "Arial, sans-serif",
    color: "#0f172a",
  },
  hero: {
    display: "flex",
    justifyContent: "space-between",
    gap: "24px",
    alignItems: "center",
    flexWrap: "wrap",
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
    marginBottom: "24px",
  },
  eyebrow: {
    margin: 0,
    color: "#2563eb",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontSize: "0.8rem",
  },
  title: {
    margin: "12px 0",
    fontSize: "2.4rem",
    lineHeight: 1.1,
    maxWidth: "680px",
  },
  subtitle: {
    margin: 0,
    fontSize: "1rem",
    color: "#475569",
    maxWidth: "640px",
  },
  heroActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  primaryButton: {
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    padding: "14px 20px",
    borderRadius: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#0f172a",
    padding: "14px 20px",
    borderRadius: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "18px",
    marginBottom: "24px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 16px 30px rgba(15, 23, 42, 0.06)",
  },
  cardLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.95rem",
  },
  cardValue: {
    margin: "10px 0 8px",
    fontSize: "2rem",
  },
  cardHint: {
    color: "#2563eb",
    fontWeight: 600,
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "24px",
  },
  panel: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 16px 30px rgba(15, 23, 42, 0.06)",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  panelTitle: {
    margin: 0,
    fontSize: "1.25rem",
  },
  panelText: {
    margin: "6px 0 0",
    color: "#64748b",
  },
  smallButton: {
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    color: "#0f172a",
    padding: "10px 14px",
    borderRadius: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHead: {
    textAlign: "left",
    padding: "14px 0",
    color: "#64748b",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "0.95rem",
  },
  tableCell: {
    padding: "18px 0",
    borderBottom: "1px solid #f1f5f9",
    color: "#475569",
  },
  tableCellStrong: {
    padding: "18px 0",
    borderBottom: "1px solid #f1f5f9",
    color: "#0f172a",
    fontWeight: 700,
  },
  badge: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    color: "#0f172a",
    fontWeight: 700,
    fontSize: "0.85rem",
  },
  sidebar: {
    display: "grid",
    gap: "24px",
  },
  actionList: {
    display: "grid",
    gap: "12px",
    marginTop: "16px",
  },
  actionButton: {
    border: "none",
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "14px 16px",
    borderRadius: "14px",
    fontWeight: 700,
    textAlign: "left",
    cursor: "pointer",
  },
  metricLabel: {
    margin: "16px 0 6px",
    color: "#64748b",
    fontSize: "0.95rem",
  },
  metricValue: {
    margin: 0,
    fontSize: "1.15rem",
    fontWeight: 700,
  },
  progressTrack: {
    width: "100%",
    height: "10px",
    borderRadius: "999px",
    background: "#dbeafe",
    overflow: "hidden",
    marginTop: "18px",
  },
  progressFill: {
    width: "78%",
    height: "100%",
    background: "linear-gradient(90deg, #2563eb 0%, #06b6d4 100%)",
    borderRadius: "999px",
  },
};
