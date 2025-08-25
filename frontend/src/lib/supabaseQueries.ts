import { supabase } from "./supabaseClient";

// Course Queries
export async function addCourse(
  name: string,
  courseCode: string,
  professor?: string,
  semester?: string,
  notes?: string
) {
  const { data, error } = await supabase
    .from("courses")
    .insert([{ name, course_code: courseCode, professor, semester, notes }])
    .select();

  if (error) throw error;
  return data;
}

export async function getCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function updateCourse(
  id: string,
  updates: {
    name?: string;
    course_code?: string;
    professor?: string;
    semester?: string;
    notes?: string;
  }
) {
  const { data, error } = await supabase
    .from("courses")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}

export async function deleteCourse(id: string) {
  const { error } = await supabase.from("courses").delete().eq("id", id);

  if (error) throw error;
}

// Task Queries
export async function addTask(courseId: string, title: string, tag: string, dueDate?: string) {
  const { data, error } = await supabase
    .from("tasks")
    .insert([
      { course_id: courseId, title, tag, due_date: dueDate }
    ])
    .select();

  if (error) throw error;
  return data;
}

export async function getTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*, courses(name)")
    .order("due_date", { ascending: true });

  if (error) throw error;
  return data;
}

export async function updateTask(id: string, updates: { title?: string; due_date?: string; status?: string }) {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
}

export async function deleteTask(id: string) {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
