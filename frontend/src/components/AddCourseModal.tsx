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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
      <div className="bg-box2 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-accent1/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-text font-bold">
            {initialData ? "Edit Course" : "Add Course"}
          </h2>
          <button
            onClick={onClose}
            className="text-text/60 hover:text-text transition-colors duration-200 p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-text mb-2">
              Course Name *
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-box1 border-2 border-accent1/30 rounded-xl text-text placeholder-text/50 focus:outline-none focus:border-accent2 focus:ring-2 focus:ring-accent2/20 transition-all duration-200"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Enter course name"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-2">
              Professor *
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-box1 border-2 border-accent1/30 rounded-xl text-text placeholder-text/50 focus:outline-none focus:border-accent2 focus:ring-2 focus:ring-accent2/20 transition-all duration-200"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              placeholder="Enter professor name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-2">
              Semester *
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-box1 border-2 border-accent1/30 rounded-xl text-text placeholder-text/50 focus:outline-none focus:border-accent2 focus:ring-2 focus:ring-accent2/20 transition-all duration-200"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="e.g., Fall 2024"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-2">
              Notes
            </label>
            <textarea
              className="w-full px-4 py-3 bg-box1 border-2 border-accent1/30 rounded-xl text-text placeholder-text/50 focus:outline-none focus:border-accent2 focus:ring-2 focus:ring-accent2/20 transition-all duration-200 resize-none"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-accent1/60 text-text font-medium transition-all duration-200 cursor-pointer hover:bg-accent1/50 hover:shadow-md hover:scale-105 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-accent2 text-white font-medium transition-all duration-200 cursor-pointer hover:bg-accent2/90 hover:shadow-md hover:scale-105 active:scale-95"
            >
              {initialData ? "Save Changes" : "Add Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
