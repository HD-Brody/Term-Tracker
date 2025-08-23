"use client";
import { useAuth } from "@/lib/authProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Layout from "../components/Layout";
import AddCourseModal from "../components/AddCourseModal";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCourse = (course: any) => {
    const newCourse = {
      id: Date.now(), // simple unique id for now
      name: course.courseName,
      professor: course.professor,
      semester: course.semester,
      notes: course.notes
    };
  
    setCourses([...courses, newCourse]); // Later: Supabase insert
  };

  const handleRemoveCourse = (courseId: number) => {
    setCourses(courses.filter((course) => course.id !== courseId));
    // Later: hook up Supabase delete
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth"); // redirect to login
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchTasks = async () => {
        const { data } = await supabase.from("tasks").select("*");
        setTasks(data || []);
      };
      fetchTasks();
    }
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <Layout activePage="Dashboard">
      <div className="min-w-1/2">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-text text-4xl font-bold">
            Welcome,{" "}
            {user?.user_metadata?.full_name ||
              user?.email?.split("@")[0] ||
              "User"}
            !
          </h1>
          <div className="w-12 h-12 bg-accent3 rounded-full flex items-center justify-center">
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

        {/* Courses */}
        <section className="bg-box1 rounded-xl shadow-md px-6 py-4 mb-10 h-70">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-text text-xl font-bold">Courses</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-accent2 text-box1 px-4 py-2 rounded-md transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-105 active:scale-95"
            >
              Add Course
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-custom">
            {/* Course Cards */}

            {/* <div className="bg-box2 rounded-xl shadow-md px-6 py-4 w-64 flex-shrink-0">
              <h3 className="text-text text-lg font-bold mb-4">Calculus 1</h3>
              <p className="text-text text-sm mt-2">Professor: Dr. Boris Khesin</p>
              <p className="text-text text-sm">Semester: Fall 2025</p>
              <a href="#" className="text-accent2 text-sm mt-2 block">View Syllabus</a>
              <div className="flex justify-between mt-4">
                <button className="text-sm underline">Edit</button>
                <button className="text-box1 bg-accent2 px-3 py-1 rounded-lg text-sm">Remove</button>
              </div>
            </div> */}

            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-box2 rounded-xl shadow-md px-6 py-4 w-80 flex-shrink-0"
              >
                <h3 className="text-text text-lg font-bold mb-4">
                  {course.name}
                </h3>
                <p className="text-text text-sm mt-2">
                  Professor: {course.professor}
                </p>
                <p className="text-text text-sm">Semester: {course.semester}</p>
                <a href="#" className="text-accent2 text-sm mt-2 block w-fit">
                  View Syllabus
                </a>
                <div className="flex justify-between mt-4">
                  <button 
                    className="text-sm transition-all duration-200 cursor-pointer hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to remove this course?")) {
                        handleRemoveCourse(course.id);
                      }
                    }}
                    className="text-box1 bg-accent2 px-3 py-1 rounded-lg text-sm transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-105 active:scale-95"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Deadlines */}
          <section className="bg-box1 rounded-xl shadow-md p-6 h-80 flex flex-col">
            <h2 className="text-xl font-bold mb-6">Upcoming deadlines</h2>
            <div className="space-y-4 overflow-y-auto scrollbar-vertical flex-1">
              {/* <div className="bg-box2 rounded-xl shadow px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="w-4 h-4"/>
                  <div>
                    <p className="text-text">Research assignment - GGR196</p>
                    <span className="text-sm opacity-50">in 3 days</span>
                  </div>
                </div>
                <button className="text-md">Edit</button>
              </div>

              <div className="bg-box2 rounded-xl shadow px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="w-4 h-4"/>
                  <div>
                    <p className="text-text">Research assignment - GGR196</p>
                    <span className="text-sm opacity-50">in 3 days</span>
                  </div>
                </div>
                <button className="text-md">Edit</button>
              </div>

              <div className="bg-box2 rounded-xl shadow px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="w-4 h-4"/>
                  <div>
                    <p className="text-text">Research assignment - GGR196</p>
                    <span className="text-sm opacity-50">in 3 days</span>
                  </div>
                </div>
                <button className="text-md">Edit</button>
              </div>

              <div className="bg-box2 rounded-xl shadow px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="w-4 h-4"/>
                  <div>
                    <p className="text-text">Research assignment - GGR196</p>
                    <span className="text-sm opacity-50">in 3 days</span>
                  </div>
                </div>
                <button className="text-md">Edit</button>
              </div> */}
            </div>
          </section>

          {/* Calendar */}
          <section className="bg-box1 rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4"></div>
          </section>
        </div>

        {/* Logout Button - Fixed Position Bottom Right */}
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/auth");
          }}
          className="fixed bottom-6 right-6 bg-accent4 text-white px-4 py-2 rounded-md hover:bg-red-700 shadow-lg z-50 transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-105 active:scale-95"
        >
          Log Out
        </button>
      </div>

      {/* Add Course Modal */}
      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddCourse}
      />
    </Layout>
  );
}