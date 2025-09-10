import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Loader2, Copy, Check } from "lucide-react";

interface QRData {
  code: string;
  url: string;
  png: string;
}

export default function MyQRCodePage() {
  const [qr, setQr] = useState<QRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchQr = async () => {
      try {
        const res = await fetch("/v1/me/qr", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to generate QR code");
        }

        const data = await res.json();
        setQr(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchQr();
  }, []);

  const handleCopy = async () => {
    if (!qr?.url) return;
    try {
      await navigator.clipboard.writeText(qr.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Failed to copy link");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading your QR...</span>
      </div>
    );
  }

  if (error) {
    return (
      <p className="p-6 text-center text-red-500 font-medium">
        {error}
      </p>
    );
  }

  if (!qr) {
    return (
      <p className="p-6 text-center text-muted-foreground">
        Could not generate QR
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <Card className="max-w-md w-full shadow-lg">
        <CardContent className="p-6 flex flex-col items-center space-y-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-center">
            My QR Code
          </h1>
          <img
            src={qr.png}
            alt="My QR Code"
            className="w-48 h-48 sm:w-56 sm:h-56 border rounded-lg shadow-md"
          />
          <p className="text-center text-muted-foreground text-sm sm:text-base">
            Let others scan this QR code to connect with you instantly.
          </p>

          {/* Copy Button */}
          <Button
            onClick={handleCopy}
            variant={copied ? "default" : "outline"}
            className="w-full flex items-center justify-center space-x-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> <span>Copy Link</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
