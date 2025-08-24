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
      <div className="w-full flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-text text-3xl lg:text-4xl font-bold">
            {course.name}
          </h1>
          <div className="w-12 h-12 bg-accent3 rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 17.804A9.953 9.953 0 0112 15c2.21 0 4.254.72 5.879 1.929M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </header>

        {/* Course content will go here in the future */}
        <div className="bg-box1 rounded-xl shadow-lg p-6">
          <p className="text-text text-lg">Course content coming soon...</p>
        </div>
      </div>
    </Layout>
  );
}
