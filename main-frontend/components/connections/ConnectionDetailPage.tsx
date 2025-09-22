import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ConnectionDetail from "./ConnectionDetail";
import { API_BASE } from "../../src/lib/api";

export default function ConnectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [connection, setConnection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnection = async () => {
      try {
        const res = await fetch(`${API_BASE}/v1/connections/${id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load connection");
        setConnection(await res.json());
      } catch (err) {
        console.error("Failed to fetch connection:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConnection();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!connection) return <p className="text-center mt-10">Connection not found</p>;

  return (
    <ConnectionDetail
      connection={connection}
      onRemindMe={() => console.log("Reminder set!")}
      onBack={() => window.history.back()}
    />
  );
}
