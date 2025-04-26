"use client";

import React, { useState } from "react";

export default function EmailTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testEmail = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test: true,
        }),
      });

      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        setResult(data);
      } else {
        const text = await response.text();
        setError(`Non-JSON response: ${text.substring(0, 200)}...`);
      }
    } catch (error) {
      setError(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-10 mb-10">
      <div className="p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Email Testing Tool</h2>
        <p className="mb-4">
          This is a development tool to test the email functionality.
        </p>
        <button
          onClick={testEmail}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Test Email"}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
            <strong>Error:</strong>
            <pre className="whitespace-pre-wrap overflow-auto mt-2 text-sm">
              {error}
            </pre>
          </div>
        )}

        {result && (
          <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
            <strong>Success:</strong>
            <pre className="whitespace-pre-wrap overflow-auto mt-2 text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
