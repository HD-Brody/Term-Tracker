"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`
      }
    });
    
    if (error) {
      setMessage(`Sign up error: ${error.message}`);
    } else {
      setMessage("Check your email to confirm sign up!");
    }
    setLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setMessage(`Login error: ${error.message}`);
    } else if (data.user) {
      setMessage("Login successful! Redirecting...");
      // Redirect to dashboard after successful login
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
    setLoading(false);
  }

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    setMessage("Logged out successfully");
    setLoading(false);
  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {isSignUp ? "Sign Up" : "Log In"}
      </h1>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes("error") || message.includes("Error") 
            ? "bg-red-100 text-red-700" 
            : "bg-green-100 text-green-700"
        }`}>
          {message}
        </div>
      )}
      
      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        
        {isSignUp ? (
          <button 
            onClick={handleSignup} 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded cursor-pointer hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        ) : (
          <button 
            onClick={handleLogin} 
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded cursor-pointer hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        )}
      </form>
      
      <div className="mt-4 text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-blue-600 hover:underline"
          disabled={loading}
        >
          {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
        </button>
      </div>
      
      <button
        onClick={handleLogout}
        disabled={loading}
        className="mt-4 w-full bg-gray-500 text-white p-3 rounded hover:bg-gray-600 disabled:opacity-50"
      >
        Log Out
      </button>
    </div>
  );
}
