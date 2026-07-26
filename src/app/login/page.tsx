"use client";
import { NextResponse } from "next/server";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ message: "failed" });
    }

    router.push("/tasks");
  }

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div>
            <label htmlFor="">email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="">password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}
