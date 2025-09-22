import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../src/lib/api";

export default function ScanQR() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      async (decodedText: string) => {
        if (isProcessing) return; 
        setIsProcessing(true);

        try {
          // Extract code if full URL is scanned
               let code = decodedText;
              if (decodedText.includes("/u/")) {
              code = decodedText.split("/u/").pop() || decodedText;
              }


          const res = await fetch(`${API_BASE}/v1/connect/${code}`, {
            method: "POST",
            credentials: "include",
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || "Failed to connect");
          }

          setSuccess("Connection request sent!");
          setTimeout(() => navigate("/connections"), 1200);
        } catch (err: any) {
          setError(err.message || "Something went wrong");
        } finally {
          scanner.clear().catch(() => {});
        }
      },
      (scanErr) => {
        console.warn("QR Scan Error:", scanErr);
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [navigate, isProcessing]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-4 py-2 bg-gray-900">
        <button onClick={() => navigate(-1)}>← Back</button>
        <h2 className="text-lg font-medium">Scan QR Code</h2>
        <button>🔦</button> {/* Flashlight toggle (future) */}
      </div>

      {/* Scanner */}
      <div
        id="reader"
        className="w-80 h-80 mt-10 border-4 border-yellow-500 rounded-xl"
      ></div>

      <p className="mt-6 text-center text-sm text-yellow-400">
        Position QR Code in the frame <br />
        The code will be scanned automatically
      </p>

      {/* Feedback */}
      {error && (
        <p className="mt-4 text-red-400 font-medium text-sm">{error}</p>
      )}
      {success && (
        <p className="mt-4 text-green-400 font-medium text-sm">{success}</p>
      )}
    </div>
  );
}
