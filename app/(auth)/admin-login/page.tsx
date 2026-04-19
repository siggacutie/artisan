"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    // Check if already logged in as admin
    fetch('/api/admin/auth/me')
      .then(r => {
        if (r.ok) {
          router.replace("/admin")
        }
      })
      .catch(() => {})
  }, [router])

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Enter email and password")
      return
    }
    setLoading(true)
    setError("")

    try {
      const result = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password,
        }),
      })

      const data = await result.json()

      if (result.ok) {
        router.replace("/admin")
      } else {
        setError(data.error || "Invalid credentials or access denied")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: "#050810", minHeight: "100vh",
      display: "flex", alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "#0d1120", borderRadius: 16,
        border: "1px solid rgba(255,215,0,0.15)",
        padding: 40, maxWidth: 400, width: "100%"
      }}>
        <div style={{
          textAlign: "center", marginBottom: 32
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>
            🔒
          </div>
          <div style={{
            fontFamily: "Orbitron", fontSize: 18,
            fontWeight: 700, color: "white"
          }}>
            Admin Access
          </div>
          <div style={{ color: "#6b7280", fontSize: 13,
            marginTop: 4 }}>
            ArtisanStore.xyz
          </div>
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 8, padding: "10px 14px",
            color: "#ef4444", fontSize: 13, marginBottom: 20
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ color: "#9ca3af", fontSize: 12,
            display: "block", marginBottom: 6 }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="admin@artisanstore.xyz"
            style={{
              width: "100%", background: "#050810",
              border: "1px solid rgba(255,215,0,0.2)",
              borderRadius: 8, padding: "12px 14px",
              color: "white", fontSize: 14, outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ color: "#9ca3af", fontSize: 12,
            display: "block", marginBottom: 6 }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="Enter password"
              style={{
                width: "100%", background: "#050810",
                border: "1px solid rgba(255,215,0,0.2)",
                borderRadius: 8, padding: "12px 44px 12px 14px",
                color: "white", fontSize: 14, outline: "none",
                boxSizing: "border-box"
              }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{
                position: "absolute", right: 12,
                top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none",
                color: "#6b7280", cursor: "pointer",
                fontSize: 12
              }}
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%", padding: "14px",
            background: loading ? "#374151" : "#ffd700",
            color: "black", border: "none", borderRadius: 8,
            fontSize: 15, fontWeight: 700, cursor: loading
              ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>
    </div>
  )
}
