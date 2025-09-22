import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { QrCode, Settings, User } from "lucide-react";
import { API_BASE } from "../../src/lib/api";

interface User {
  name?: string;
  photoUrl?: string;
  linkedin?: string;
  tags?: string[];
}

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
  event?: string;
  profile: UserProfile;
}

interface ConnectionStats {
  total: number;
  thisWeek: number;
  thisMonth: number;
  pending: number;
}

interface HomeScreenProps {
  onViewConnections: () => void;
  onEditProfile: () => void;
}

export default function HomeScreen({
  onViewConnections,
  onEditProfile,
}: HomeScreenProps) {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<ConnectionStats | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUser = await fetch(`${API_BASE}/v1/auth/me`, { credentials: "include" });
        if (resUser.ok) {
          const data = await resUser.json();
          setUser(data.user);
        }

        const [resStats, resConns] = await Promise.all([
          fetch(`${API_BASE}/v1/connections/stats`, { credentials: "include" }),
          fetch(`${API_BASE}/v1/connections`, { credentials: "include" }),
        ]);

        if (resStats.ok) setStats(await resStats.json());
        if (resConns.ok) setConnections(await resConns.json());
      } catch (err) {
        console.error("Failed to fetch homepage data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Avatar + Name */}
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 border-2 border-white/20">
                <AvatarImage src={user?.photoUrl} />
                <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : <User />}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-semibold text-lg sm:text-xl lg:text-2xl">
                  Welcome back!
                </h1>
                <p className="text-white/80 text-sm sm:text-base lg:text-lg">
                  {user?.name || "there"}
                </p>
              </div>
            </div>

            {/* Settings */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onEditProfile}
              className="text-white hover:bg-white/10 w-10 h-10 sm:w-12 sm:h-12 self-start sm:self-center"
            >
              <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {["Connections", "This Week", "This Month", "Pending"].map(
              (label, idx) => {
                const values = [
                  stats?.total ?? 0,
                  stats?.thisWeek ?? 0,
                  stats?.thisMonth ?? 0,
                  stats?.pending ?? 0,
                ];
                return (
                  <div
                    key={label}
                    className="bg-white/10 rounded-xl p-4 text-center"
                  >
                    <div className="text-lg sm:text-xl font-bold">
                      {loading ? (
                        <span className="animate-pulse">--</span>
                      ) : (
                        values[idx]
                      )}
                    </div>
                    <div className="text-white/80 text-xs sm:text-sm">
                      {label}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 space-y-6 py-8">
        {/* Primary Scan Button */}
        <Card className="bg-gradient-to-r from-secondary to-secondary/80 border-0 shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <Button
              onClick={() => (window.location.href = "/u/:code")}
              className="w-full h-14 sm:h-16 bg-white/20 hover:bg-white/30 border border-white/30 text-secondary-foreground"
            >
              <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                <QrCode className="w-6 h-6 sm:w-8 sm:h-8" />
                <span className="font-medium text-base sm:text-lg">
                  Scan QR Code
                </span>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* My QR */}
        <Card
          className="border border-border/50 hover:shadow-md transition cursor-pointer"
          onClick={() => (window.location.href = "/my-qrcode")}
        >
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6 sm:w-7 sm:h-7 text-secondary" />
            </div>
            <p className="font-medium text-base sm:text-lg">My QR</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Share your profile
            </p>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h3 className="font-medium text-lg sm:text-xl mb-4">
              Recent Activity
            </h3>

            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-3 animate-pulse"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-muted rounded w-2/3" />
                      <div className="h-3 bg-muted rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : connections.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No recent connections yet.
              </p>
            ) : (
              <div className="space-y-4">
                {connections.slice(0, 5).map((c) => (
                  <div
                    key={c._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                        <AvatarImage src={c.profile?.photoUrl || undefined} />
                        <AvatarFallback>
                          {c.profile?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm sm:text-base">
                          Connected with{" "}
                          <span className="font-semibold">
                            {c.profile?.name}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </p>
                        {c.profile?.tags?.length ? (
                          <p className="text-xs text-muted-foreground">
                            {c.profile.tags.join(", ")}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 sm:mt-6">
              <Button
                variant="outline"
                onClick={onViewConnections}
                className="w-full"
              >
                View All Connections
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
