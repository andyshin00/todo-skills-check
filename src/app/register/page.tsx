"use client";
import { NextResponse } from "next/server";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ message: "failed" });
    }

    router.push("/login");
  }

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <h1>Register</h1>
          <div>
            <label htmlFor="">email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="">paassword</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Create Account</button>
        </form>
      </div>
    </>
  );
}
