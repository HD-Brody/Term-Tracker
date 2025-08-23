"use client";
import { useAuth } from "@/lib/authProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { addCourse, getCourses, updateCourse, deleteCourse } from "../lib/supabaseQueries";
import Layout from "../components/Layout";
import AddCourseModal from "../components/AddCourseModal";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch courses from Supabase
  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      alert("Failed to load courses. Please try again.");
    }
  };

  const handleAddCourse = async (course: any) => {
    setIsLoading(true);
    try {
      const newCourse = await addCourse(
        course.courseName,
        course.courseCode,
        course.professor,
        course.semester,
        course.notes
      );
      
      if (newCourse && newCourse[0]) {
        setCourses([...courses, newCourse[0]]);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCourse = async (course: any) => {
    setIsLoading(true);
    try {
      const updatedCourse = await updateCourse(course.id, {
        name: course.courseName,
        course_code: course.courseCode,
        professor: course.professor,
        semester: course.semester,
        notes: course.notes,
      });
      
      if (updatedCourse && updatedCourse[0]) {
        const updatedCourses = courses.map((c) =>
          c.id === course.id ? updatedCourse[0] : c
        );
        setCourses(updatedCourses);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCourse = async (courseId: string) => {
    setIsLoading(true);
    try {
      await deleteCourse(courseId);
      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditModal = (course: any) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
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
      fetchCourses(); // Fetch courses when user is authenticated
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
        <section className="bg-box1 rounded-xl shadow-lg px-6 py-4 mb-10 h-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-text text-xl font-bold">Courses</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isLoading}
              className="bg-accent2 text-box1 px-4 py-2 rounded-md transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Add Course"}
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-custom">
            {/* Course Cards */}
            {courses.map((course, index) => (
              <div
                key={course.id || index}
                className="bg-box2 rounded-xl shadow-lg px-6 py-4 w-80 flex-shrink-0"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-text text-lg font-bold">
                    {course.name}
                  </h3>
                  {course.course_code && (
                    <span className="text-accent2 text-sm font-medium bg-accent2/10 px-2 py-1 rounded-md">
                      {course.course_code}
                    </span>
                  )}
                </div>
                <p className="text-text text-sm mt-2">
                  Professor: {course.professor}
                </p>
                <p className="text-text text-sm">Semester: {course.semester}</p>
                {course.notes && (
                  <p className="text-text text-sm mt-2 opacity-70">
                    Notes: {course.notes}
                  </p>
                )}
                <a href="#" className="text-accent2 text-sm mt-2 block w-fit">
                  View Syllabus
                </a>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleOpenEditModal(course)}
                    disabled={isLoading}
                    className="text-sm transition-all duration-200 cursor-pointer hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to remove this course?"
                        )
                      ) {
                        handleRemoveCourse(course.id);
                      }
                    }}
                    disabled={isLoading}
                    className="text-box1 bg-accent2 px-3 py-1 rounded-lg text-sm transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <section className="bg-box1 rounded-xl shadow-lg p-6 h-80 flex flex-col">
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
          <section className="bg-box1 rounded-xl shadow-lg p-6">
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
        onClose={handleCloseModal}
        onSave={editingCourse ? handleEditCourse : handleAddCourse}
        initialData={editingCourse}
        isLoading={isLoading}
      />
    </Layout>
  );
}
