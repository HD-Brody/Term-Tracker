"use client";
import { useAuth } from "@/lib/authProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

export default function CoursePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');
  const courseName = searchParams.get('name');
  const [course, setCourse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (courseId && courseName) {
      setCourse({
        id: courseId,
        name: courseName
      });
    }
  }, [courseId, courseName]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;
  if (!course) return <p>Course not found</p>;

  return (
    <Layout activePage="Courses">
      <div className="w-full flex flex-col space-y-8">
        {/* Course Header Section */}
        <header className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-text text-3xl lg:text-4xl font-bold mb-2">
              CSC110 – Intro to Computer Science
            </h1>
            <p className="text-text/70 text-lg">
              Professor: Sadia Sharmin | Fall 2025
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-box2 text-text rounded-lg hover:bg-accent1/20 transition-colors border border-accent1/30">
              Edit
            </button>
            <button className="px-4 py-2 bg-accent2 text-white rounded-lg hover:bg-accent2/80 transition-colors">
              Remove
            </button>
          </div>
        </header>

        {/* Task List Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-text text-2xl font-semibold">Task List</h2>
            <button className="px-6 py-3 bg-accent3 text-white rounded-lg hover:bg-accent3/80 transition-colors shadow-md">
              + Add Task
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'completed', label: 'Completed' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  activeTab === tab.id
                    ? 'bg-accent3 text-white shadow-md'
                    : 'bg-box2 text-text hover:bg-accent1/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Task Cards */}
          <div className="space-y-4">
            {/* Task Card Skeleton 1 */}
            <div className="bg-box1 rounded-xl shadow-md p-6 flex items-center space-x-4">
              <div className="w-5 h-5 border-2 border-accent3 rounded flex-shrink-0"></div>
              <div className="flex-1">
                <h3 className="text-text font-medium text-lg">Assignment 1: Variables and Data Types</h3>
                <p className="text-text/60 text-sm">Due: Oct 15, 2025</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-accent1/20 text-accent4 rounded-full text-sm font-medium border border-accent1/30">
                  Assignment
                </span>
                <button className="p-2 text-text/60 hover:text-text hover:bg-box2 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button className="p-2 text-accent2 hover:bg-accent2/10 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Task Card Skeleton 2 */}
            <div className="bg-box1 rounded-xl shadow-md p-6 flex items-center space-x-4">
              <div className="w-5 h-5 border-2 border-accent3 rounded flex-shrink-0"></div>
              <div className="flex-1">
                <h3 className="text-text font-medium text-lg">Lab 3: Control Structures</h3>
                <p className="text-text/60 text-sm">Due: Oct 20, 2025</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-accent2/20 text-accent2 rounded-full text-sm font-medium border border-accent2/30">
                  Lab
                </span>
                <button className="p-2 text-text/60 hover:text-text hover:bg-box2 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button className="p-2 text-accent2 hover:bg-accent2/10 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Task Card Skeleton 3 */}
            <div className="bg-box1 rounded-xl shadow-md p-6 flex items-center space-x-4">
              <div className="w-5 h-5 border-2 border-accent3 rounded flex-shrink-0"></div>
              <div className="flex-1">
                <h3 className="text-text font-medium text-lg">Midterm Exam</h3>
                <p className="text-text/60 text-sm">Due: Nov 5, 2025</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-accent4/20 text-accent4 rounded-full text-sm font-medium border border-accent4/30">
                  Exam
                </span>
                <button className="p-2 text-text/60 hover:text-text hover:bg-box2 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button className="p-2 text-accent2 hover:bg-accent2/10 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Empty State (commented out - uncomment to show) */}
            {/* 
            <div className="bg-box1 rounded-xl shadow-md p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-accent3/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-accent3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-text text-xl font-medium mb-2">No tasks yet</h3>
              <p className="text-text/60 mb-6">Click + Add Task to get started.</p>
            </div>
            */}
          </div>
        </section>
      </div>
    </Layout>
  );
}
