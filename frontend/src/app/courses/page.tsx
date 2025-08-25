"use client";
import { useAuth } from "@/lib/authProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { updateCourse, deleteCourse, addTask, getTasks, deleteTask, updateTask } from "../../lib/supabaseQueries";
import Layout from "../../components/Layout";
import AddCourseModal from "../../components/AddCourseModal";
import AddTaskModal from "../../components/AddTaskModal";
import EditTaskModal from "../../components/EditTaskModal";

export default function CoursePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');
  const courseName = searchParams.get('name');
  const courseCode = searchParams.get('code');
  const courseProf = searchParams.get('professor');
  const courseSemester = searchParams.get('semester');
  const [course, setCourse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (courseId && courseName) {
      setCourse({
        id: courseId,
        name: courseName,
        code: courseCode || '',
        professor: courseProf || '',
        semester: courseSemester || ''
      });
    }
  }, [courseId, courseName, courseCode, courseProf, courseSemester]);

  // Fetch tasks for this course
  useEffect(() => {
    if (courseId) {
      fetchTasks();
    }
  }, [courseId]);

  const fetchTasks = async () => {
    try {
      const allTasks = await getTasks();
      // Filter tasks for this specific course
      const courseTasks = allTasks?.filter((task: any) => task.course_id === courseId) || [];
      setTasks(courseTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleEditCourse = async (courseData: any) => {
    setIsLoading(true);
    try {
      const updatedCourse = await updateCourse(courseData.id, {
        name: courseData.courseName,
        course_code: courseData.courseCode,
        professor: courseData.professor,
        semester: courseData.semester,
        notes: courseData.notes,
      });
      
      if (updatedCourse && updatedCourse[0]) {
        // Update the local course state
        setCourse({
          id: updatedCourse[0].id,
          name: updatedCourse[0].name,
          code: updatedCourse[0].course_code || '',
          professor: updatedCourse[0].professor || '',
          semester: updatedCourse[0].semester || ''
        });
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCourse = async () => {
    if (window.confirm("Are you sure you want to remove this course?")) {
      setIsLoading(true);
      try {
        await deleteCourse(courseId!);
        // Redirect to dashboard after successful deletion
        router.push("/");
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Failed to delete course. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOpenEditModal = () => {
    setEditingCourse({
      id: course.id,
      name: course.name,
      course_code: course.code,
      professor: course.professor,
      semester: course.semester,
      notes: course.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleAddTask = async (taskData: any) => {
    setIsLoading(true);
    try {
      const newTask = await addTask(
        courseId!,
        taskData.title,
        taskData.tag,
        taskData.dueDate
      );
      
      if (newTask) {
        // Refresh tasks after adding
        await fetchTasks();
        handleCloseTaskModal();
      }
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenTaskModal = () => {
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
  };

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

  const handleEditTask = async (taskData: any) => {
    setIsLoading(true);
    try {
      const updatedTask = await updateTask(taskData.id, {
        title: taskData.title,
        tag: taskData.tag,
        due_date: taskData.dueDate,
      });
      
      if (updatedTask) {
        // Refresh tasks after updating
        await fetchTasks();
        handleCloseEditTaskModal();
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditTaskModal = (task: any) => {
    setEditingTask(task);
    setIsEditTaskModalOpen(true);
  };

  const handleCloseEditTaskModal = () => {
    setIsEditTaskModalOpen(false);
    setEditingTask(null);
  };

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
              {course.code ? `${course.code} - ` : ''}{course.name}
            </h1>
            <p className="text-text/70 text-lg">
              {course.professor && `Professor: ${course.professor}`}{course.professor && course.semester && ' | '}{course.semester}
            </p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleOpenEditModal}
              disabled={isLoading}
              className="px-4 py-2 bg-box2 text-text rounded-lg hover:bg-accent1/20 transition-colors border border-accent1/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edit
            </button>
            <button 
              onClick={handleRemoveCourse}
              disabled={isLoading}
              className="px-4 py-2 bg-accent2 text-white rounded-lg hover:bg-accent2/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove
            </button>
          </div>
        </header>

        {/* Task List Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-text text-2xl font-semibold">Task List</h2>
            <button 
              onClick={handleOpenTaskModal}
              className="px-6 py-3 bg-accent3 text-white rounded-lg hover:bg-accent3/80 transition-colors shadow-md"
            >
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
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="bg-box1 rounded-xl shadow-md p-6 flex items-center space-x-4">
                  <div className="w-5 h-5 border-2 border-accent3 rounded flex-shrink-0"></div>
                  <div className="flex-1">
                    <h3 className="text-text font-medium text-lg">{task.title}</h3>
                                         <p className="text-text/60 text-sm">
                       Due: {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { 
                         month: 'short', 
                         day: 'numeric', 
                         year: 'numeric' 
                       }) : 'No due date'}
                     </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-accent1/20 text-accent4 rounded-full text-sm font-medium border border-accent1/30">
                      {task.tag}
                    </span>
                                         <button 
                       onClick={() => handleOpenEditTaskModal(task)}
                       disabled={isLoading}
                       className="p-2 text-text/60 hover:text-text hover:bg-box2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                       </svg>
                     </button>
                                         <button 
                       onClick={() => handleRemoveTask(task.id)}
                       disabled={isLoading}
                       className="p-2 text-accent2 hover:bg-accent2/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                       </svg>
                     </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-box1 rounded-xl shadow-md p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-accent3/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-accent3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-text text-xl font-medium mb-2">No tasks yet</h3>
                <p className="text-text/60 mb-6">Click + Add Task to get started.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Edit Course Modal */}
      <AddCourseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleEditCourse}
        initialData={editingCourse}
        isLoading={isLoading}
      />

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        onSave={handleAddTask}
        isLoading={isLoading}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={isEditTaskModalOpen}
        onClose={handleCloseEditTaskModal}
        onSave={handleEditTask}
        initialData={editingTask}
        isLoading={isLoading}
      />
    </Layout>
  );
}
