"use client";
import { useAuth } from "@/lib/authProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { addCourse, getCourses, updateCourse, deleteCourse, getTasks, updateTask, deleteTask } from "../lib/supabaseQueries";
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

  // Fetch tasks with course information
  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Get top 3 upcoming deadlines from all courses
  const getUpcomingDeadlines = () => {
    if (!tasks || tasks.length === 0) return [];
    
    // Filter out completed tasks and sort by due date
    const activeTasks = tasks
      .filter((task: any) => !task.completed && task.due_date)
      .sort((a: any, b: any) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    
    // Return top 3
    return activeTasks.slice(0, 3);
  };

  // Get course code for a task
  const getCourseCode = (task: any) => {
    if (task.courses && task.courses.name) {
      // Find the course to get its code
      const course = courses.find(c => c.id === task.course_id);
      return course?.course_code || '';
    }
    return '';
  };

  // Get course name for a task
  const getCourseName = (task: any) => {
    if (task.courses && task.courses.name) {
      return task.courses.name;
    }
    return '';
  };

  // Format due date for display
  const formatDueDate = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
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

  // Handle task completion toggle
  const handleToggleTaskCompletion = async (taskId: string, currentCompleted: boolean) => {
    setIsLoading(true);
    try {
      await updateTask(taskId, { completed: !currentCompleted });
      // Refresh tasks after updating
      await fetchTasks();
    } catch (error) {
      console.error("Error updating task completion:", error);
      alert("Failed to update task completion. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle opening edit task modal
  const handleOpenEditTaskModal = (task: any) => {
    // For now, just show an alert since we don't have the edit modal in dashboard
    alert(`Edit task: ${task.title}\nThis would open an edit modal in a future update.`);
  };

  // Handle removing a task
  const handleRemoveTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to remove this task?")) {
      setIsLoading(true);
      try {
        await deleteTask(taskId);
        // Refresh tasks after deletion
        await fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth"); // redirect to login
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchCourses(); // Fetch courses when user is authenticated
    }
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <Layout activePage="Dashboard">
      <div className="w-full flex flex-col"> {/* Updated class to remove min-h-full */}
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-text text-3xl lg:text-4xl font-bold">
            Welcome,{" "}
            {user?.user_metadata?.full_name ||
              user?.email?.split("@")[0] ||
              "User"}
            !
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

        {/* Courses */}
        <section className="bg-box1 rounded-xl shadow-lg px-6 pt-4 pb-6 mb-6 flex-1 min-h-[250px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-text text-xl font-bold">Courses</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isLoading}
              className="bg-accent2 text-white pl-3 pr-4 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer hover:bg-accent2/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {isLoading ? "Loading..." : "Add Course"}
            </button>
          </div>

          <div
            className={
              courses.length > 0
                ? "grid grid-cols-4 gap-6 flex-1"
                : "flex items-center justify-center w-full h-48"
            }
          >
            {/* Course Cards */}
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <div
                  key={course.id || index}
                  className="bg-box2 rounded-xl shadow-lg px-6 py-4 border border-accent1/10"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-text text-lg font-bold">
                      <a 
                        href={`/courses?id=${course.id}&name=${encodeURIComponent(course.name)}&code=${encodeURIComponent(course.course_code || '')}&professor=${encodeURIComponent(course.professor || '')}&semester=${encodeURIComponent(course.semester || '')}`}
                        className="hover:text-accent2 transition-colors duration-200 cursor-pointer"
                      >
                        {course.name}
                      </a>
                    </h3>
                    {course.course_code && (
                      <span className="text-accent2 text-sm font-medium bg-accent2/10 px-3 py-1 rounded-lg">
                        {course.course_code}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 mb-3">
                    <p className="text-text text-sm">
                      <span className="font-medium">Professor:</span> {course.professor}
                    </p>
                    <p className="text-text text-sm">
                      <span className="font-medium">Semester:</span> {course.semester}
                    </p>
                    {course.notes && (
                      <p className="text-text text-sm opacity-70">
                        <span className="font-medium">Notes:</span> {course.notes}
                      </p>
                    )}
                  </div>
                  <a href="#" className="text-accent2 text-sm font-medium hover:underline transition-colors duration-200 block w-fit mb-2">
                    Add Syllabus
                  </a>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleOpenEditModal(course)}
                      disabled={isLoading}
                      className="text-accent2 text-sm font-medium transition-all duration-200 cursor-pointer hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="text-white bg-accent2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer hover:bg-accent2/90 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
                <p className="text-text/60 text-lg mb-2">No courses yet</p>
                <p className="text-text/40 text-sm">Add your first course to get started!</p>
              </div>
            )}
          </div>
        </section>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 min-h-80"> {/* Updated class to add mb-8 */}
          {/* Upcoming Deadlines */}
          <section className="bg-box1 rounded-xl shadow-lg p-6 flex flex-col flex-1">
            <h2 className="text-xl font-bold mb-4 text-text">Upcoming Deadlines</h2>
            <div className="space-y-4 flex-1">
              {getUpcomingDeadlines().length > 0 ? (
                getUpcomingDeadlines().map((task) => (
                  <div key={task.id} className="bg-box2 rounded-xl shadow px-4 py-3 flex items-center justify-between border border-accent1/10">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleToggleTaskCompletion(task.id, task.completed)}
                        disabled={isLoading}
                        className={`w-4 h-4 border-2 rounded flex-shrink-0 transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed ${
                          task.completed 
                            ? 'bg-accent3 border-accent3 text-white' 
                            : 'border-accent3 hover:bg-accent3/20'
                        }`}
                      >
                        {task.completed && (
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <div>
                        <p className="text-text font-medium">
                          {task.title} - {getCourseCode(task)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 bg-accent1/20 text-accent4 rounded-full text-xs font-medium border border-accent1/30">
                            {task.tag}
                          </span>
                          <span className="text-sm text-text/60">{formatDueDate(task.due_date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenEditTaskModal(task)}
                        disabled={isLoading}
                        className="p-1.5 text-text/60 hover:text-text hover:bg-box1 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleRemoveTask(task.id)}
                        disabled={isLoading}
                        className="p-1.5 text-accent2 hover:bg-accent2/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-box2 rounded-xl shadow-md p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-accent3/20 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-accent3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-text text-xl font-medium mb-2">No upcoming deadlines</h3>
                  <p className="text-text/60">All caught up! Add some tasks to see them here.</p>
                </div>
              )}
            </div>
          </section>

          {/* Calendar */}
          <section className="bg-box1 rounded-xl shadow-lg p-6 flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-text">Calendar</h2>
            </div>
          </section>
        </div>

        {/* Logout Button - Fixed Position Bottom Right */}
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/auth");
          }}
          className="fixed bottom-6 right-6 bg-accent2 text-white px-6 py-3 rounded-xl font-medium shadow-lg z-50 transition-all duration-200 cursor-pointer hover:bg-accent2/90 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
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