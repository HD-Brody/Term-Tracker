import { useEffect, useState } from "react";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: any) => void;
  initialData?: any;
}

export default function AddCourseModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddCourseModalProps) {
  const [courseName, setCourseName] = useState("");
  const [professor, setProfessor] = useState("");
  const [semester, setSemester] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (initialData) {
      // If initialData exists, pre-fill the state
      setCourseName(initialData.name || "");
      setProfessor(initialData.professor || "");
      setSemester(initialData.semester || "");
      setNotes(initialData.notes || "");
    } else {
      // Otherwise, clear the state for a new course
      setCourseName("");
      setProfessor("");
      setSemester("");
      setNotes("");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName.trim()) return;
    onSave({
      id: initialData?.id, // Include the ID if in edit mode
      courseName,
      professor,
      semester,
      notes,
    });
    setCourseName("");
    setProfessor("");
    setSemester("");
    setNotes("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-box2 rounded-2xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl text-text font-semibold mb-4">
          {initialData ? "Edit Course" : "Add Course"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Course Name *</label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Professor</label>
            <input
              type="text"
              className="mt-1 w-full bg- rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Semester</label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Notes</label>
            <textarea
              className="mt-1 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-accent2 text-white transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-accent3 text-white transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-105 active:scale-95"
            >
              {initialData ? "Save Changes" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
