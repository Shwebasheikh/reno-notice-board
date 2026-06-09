import { useEffect, useState } from "react";

export default function Home() {
  const [notices, setNotices] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    category: "General",
    priority: "Normal",
    publishDate: "",
    image: "",
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notices");
      const data = await res.json();
      setNotices(data);
    } catch (err) {
      alert("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.body || !formData.publishDate) {
      alert("Please fill Title, Body and Date");
      return;
    }

    setLoading(true);

    try {
      if (editId) {
        await fetch(`/api/notices/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        alert("Notice updated!");
        setEditId(null);
      } else {
        await fetch("/api/notices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        alert("Notice created!");
      }

      setFormData({
        title: "",
        body: "",
        category: "General",
        priority: "Normal",
        publishDate: "",
        image: "",
      });

      fetchNotices();
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (notice: any) => {
    setFormData({
      title: notice.title,
      body: notice.body,
      category: notice.category,
      priority: notice.priority,
      publishDate: notice.publishDate.split("T")[0],
      image: notice.image,
    });

    setEditId(notice.id);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    await fetch(`/api/notices/${id}`, {
      method: "DELETE",
    });

    alert("Notice deleted!");
    fetchNotices();
  };

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", fontFamily: "Arial" }}>
      
      <h1 style={{ textAlign: "center" }}>Notice Board System</h1>

      {/* SEARCH */}
      <input
        placeholder="Search notices..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

      {/* FORM */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          placeholder="Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <textarea
          placeholder="Body"
          value={formData.body}
          onChange={(e) =>
            setFormData({ ...formData, body: e.target.value })
          }
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        >
          <option>Exam</option>
          <option>Event</option>
          <option>General</option>
        </select>

        <select
          value={formData.priority}
          onChange={(e) =>
            setFormData({ ...formData, priority: e.target.value })
          }
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        >
          <option>Normal</option>
          <option>Urgent</option>
        </select>

        <input
          type="date"
          value={formData.publishDate}
          onChange={(e) =>
            setFormData({ ...formData, publishDate: e.target.value })
          }
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "10px 15px",
            background: editId ? "orange" : "green",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading
            ? "Processing..."
            : editId
            ? "Update Notice"
            : "Add Notice"}
        </button>
      </div>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* LIST */}
      {notices
        .filter((n) =>
          n.title.toLowerCase().includes(search.toLowerCase())
        )
        .map((notice) => (
          <div
            key={notice.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              
            }}
          >
            <h3>{notice.title}</h3>
            <p>{notice.body}</p>

            <p>Category: {notice.category}</p>
            <p>Priority: {notice.priority}</p>

            <p>
              Date:{" "}
              {new Date(notice.publishDate).toLocaleDateString()}
            </p>

            <button
              onClick={() => handleEdit(notice)}
              style={{
                marginRight: "10px",
                background: "orange",
                color: "white",
                border: "none",
                padding: "5px 10px",
              }}
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(notice.id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
              }}
            >
              Delete
            </button>
          </div>
        ))}
    </div>
  );
}