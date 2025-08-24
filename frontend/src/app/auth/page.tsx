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
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="flex bg-accent1 w-full max-w-6xl h-auto min-h-[600px] rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Left side - Welcome section */}
        <div className="flex items-center justify-center w-full lg:w-1/2 p-8 lg:p-16">
          <div className="text-center lg:text-left">
            <FontAwesomeIcon 
              icon={faListCheck} 
              size="6x" 
              className="text-white mb-6 lg:mb-8" 
            />
            <h1 className="text-white text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 lg:mb-6 leading-tight">
              Welcome to TermTracker!
            </h1>
            <h2 className="text-white text-xl lg:text-2xl opacity-90">
              Stay on top of your semester.
            </h2>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="flex items-center justify-center bg-box1 w-full lg:w-1/2 p-8 lg:p-16">
          <div className="w-full max-w-md">
            <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-text">
              {isSignUp ? "Sign Up" : "Log In"}
            </h1>
            
            {message && (
              <div className={`mb-6 p-4 rounded-xl border ${
                message.includes("error") || message.includes("Error")
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-green-50 text-green-700 border-green-200"
              }`}>
                {message}
              </div>
            )}
            
            <form 
              className="space-y-6"
              onSubmit={isSignUp ? handleSignup : handleLogin}
            >
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-box2 border-2 border-accent1/30 rounded-xl text-text placeholder-text/50 focus:outline-none focus:border-accent2 focus:ring-2 focus:ring-accent2/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-box2 border-2 border-accent1/30 rounded-xl text-text placeholder-text/50 focus:outline-none focus:border-accent2 focus:ring-2 focus:ring-accent2/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent3 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 cursor-pointer hover:bg-accent3/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (isSignUp ? "Signing up..." : "Logging in...") : (isSignUp ? "Sign Up" : "Log In")}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-text/70 hover:text-text transition-colors duration-200 font-medium cursor-pointer"
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
