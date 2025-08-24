"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faListCheck } from "@fortawesome/free-solid-svg-icons";

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
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex bg-accent1 w-1/2 h-120 rounded-2xl shadow-lg mx-auto">

        <div className="flex items-center w-4/7">
          <div className="p-20 w-100">
            <FontAwesomeIcon icon={faListCheck} size="6x" className="text-white mb-5" />
            <h1 className="text-white text-4xl font-bold mb-5">
              Welcome to TermTracker!
            </h1>
            <h2 className="text-white text-2xl">
              Stay on top of your semester.
            </h2>
          </div>
        </div>

        <div className="flex items-center justify-center bg-box1 rounded-r-2xl w-3/7">
          <div className="px-15 py-20 ">
            <h1 className="text-4xl font-bold mb-6">
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
                className="w-full border-2 border-box2 bg-box2 p-3 rounded-xl focus:outline-none focus:border-accent2 focus:ring-2 focus:ring-accent2/20"
                disabled={loading}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border-2 border-box2 bg-box2 p-3 rounded-xl focus:outline-none focus:border-accent2 focus:ring-2 focus:ring-accent2/20"
                disabled={loading}
              />

              {isSignUp ? (
                <button
                  onClick={handleSignup}
                  disabled={loading}
                  className="w-full bg-accent3 text-white p-3 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-accent3 text-white p-3 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>
              )}
            </form>
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-test cursor-pointer hover:underline"
                disabled={loading}
              >
                {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
