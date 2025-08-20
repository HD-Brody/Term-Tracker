"use client";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await supabase.from("tasks").select("*");
      setTasks(data || []);
    };
    fetchTasks();
  }, []);

  return (
    <div className="bg-background min-h-screen p-20 w-3/4 mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-text text-3xl font-bold">Welcome, John Doe!</h1>
        <div className="w-12 h-12 bg-accent3 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A9.953 9.953 0 0112 15c2.21 0 4.254.72 5.879 1.929M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </header>

      {/* Courses */}
      <section className="bg-box1 rounded-[30px] shadow-md p-6 mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-text text-xl font-bold">Courses</h2>
          <button className="bg-accent2 text-box1 px-4 py-2 rounded-md">Add Course</button>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-custom">
          {/* Course Cards */}
          <div className="bg-box2 rounded-xl shadow-md p-6 w-64 flex-shrink-0">
            <h3 className="text-text text-lg font-bold mb-4">Calculus 1</h3>
            <p className="text-text text-sm mt-2">Professor: Dr. Boris Khesin</p>
            <p className="text-text text-sm">Semester: Fall 2025</p>
            <a href="#" className="text-accent2 text-sm mt-2 block">View Syllabus</a>
            <div className="flex justify-between mt-4">
              <button className="text-sm underline">Edit</button>
              <button className="text-box1 bg-accent2 px-3 py-1 rounded-lg text-sm">Remove</button>
            </div>
          </div>

          <div className="bg-box2 rounded-xl shadow-md p-6 w-64 flex-shrink-0">
            <h3 className="text-text text-lg font-bold mb-4">Calculus 1</h3>
            <p className="text-text text-sm mt-2">Professor: Dr. Boris Khesin</p>
            <p className="text-text text-sm">Semester: Fall 2025</p>
            <a href="#" className="text-accent2 text-sm mt-2 block">View Syllabus</a>
            <div className="flex justify-between mt-4">
              <button className="text-sm underline">Edit</button>
              <button className="text-box1 bg-accent2 px-3 py-1 rounded-lg text-sm">Remove</button>
            </div>
          </div>

          <div className="bg-box2 rounded-xl shadow-md p-6 w-64 flex-shrink-0">
            <h3 className="text-text text-lg font-bold mb-4">Calculus 1</h3>
            <p className="text-text text-sm mt-2">Professor: Dr. Boris Khesin</p>
            <p className="text-text text-sm">Semester: Fall 2025</p>
            <a href="#" className="text-accent2 text-sm mt-2 block">View Syllabus</a>
            <div className="flex justify-between mt-4">
              <button className="text-sm underline">Edit</button>
              <button className="text-box1 bg-accent2 px-3 py-1 rounded-lg text-sm">Remove</button>
            </div>
          </div>

        </div>

      </section>
    </div>
  );
}