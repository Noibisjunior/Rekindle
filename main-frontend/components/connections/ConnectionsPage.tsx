import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


interface UserProfile {
  id: string;
  name: string;
  photoUrl?: string | null;
  tags?: string[];
}


interface Connection {
  _id: string;
  status: "pending" | "accepted";
  createdAt: string;
  profile: UserProfile;
  aUserId: string;
  bUserId: string;
  isSender: boolean;
  isReceiver: boolean;
}

interface ConnectionsPageProps {
  user: { id: string; name: string; photo?: string } | null;
}

export default function ConnectionsPage({ user }: ConnectionsPageProps) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await fetch("/v1/connections", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load connections");
        const data = await res.json();
        setConnections(data);
      } catch (err) {
        console.error("Failed to fetch connections:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, []);

  const acceptConnection = async (id: string) => {
    try {
      const res = await fetch(`/v1/connections/${id}/accept`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to accept connection");
      setConnections((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: "accepted" } : c))
      );
    } catch (err) {
      console.error(err);
      alert("Could not accept connection. Try again.");
    }
  };

  const rejectConnection = async (id: string) => {
    try {
      const res = await fetch(`/v1/connections/${id}/reject`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to reject connection");
      setConnections((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Could not reject connection. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-6">Your Connections</h1>

      {loading ? (
        <p className="text-center text-muted-foreground">Loading...</p>
      ) : connections.length === 0 ? (
        <p className="text-center text-muted-foreground">No connections yet.</p>
      ) : (
        <div className="space-y-4">
          {connections.map((c) => (
  <div
    key={c._id}
    className="flex items-center justify-between bg-white dark:bg-card rounded-xl shadow-sm p-4"
  >
    <div className="flex items-center space-x-3">
      <Avatar className="w-12 h-12">
        {c.profile.photoUrl ? (
          <AvatarImage src={c.profile.photoUrl} />
        ) : (
          <AvatarFallback>
            {c.profile.name?.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        )}
      </Avatar>
      <div>
        <p className="font-medium">{c.profile.name}</p>
          <p className="text-xs text-muted-foreground">
            {c.profile?.tags}
          </p>
        <p className="text-xs text-muted-foreground">
          Joined on {new Date(c.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>

    {/* Status / Actions */}
    {c.status === "pending" ? (
      c.isSender ? (
        <span className="text-sm text-muted-foreground">Request Sent</span>
      ) : c.isReceiver ? (
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => acceptConnection(c._id)}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => rejectConnection(c._id)}
            className="hover:bg-red-50 text-red-600"
          >
            Reject
          </Button>
        </div>
      ) : null
    ) : c.isReceiver ? (
      <>
      <span className="text-sm text-green-600">Connection Accepted</span>
      <Button onClick={() => (window.location.href = `/connections/${c._id}`)} 
      size="sm" variant="outline"> View Details </Button>
    </>) : (
      <>
      <span className="text-sm text-green-600">Connected</span>
      <Button onClick={() => (window.location.href = `/connections/${c._id}`)}
      size="sm" variant="outline"> View Details </Button>
</>)}
  </div>
))}


        </div>
      )}
    </div>
  );
}

