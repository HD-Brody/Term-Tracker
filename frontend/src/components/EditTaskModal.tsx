import { useState, useEffect } from "react";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

const TASK_TAGS = [
  "Assignment",
  "Homework", 
  "Lab",
  "Quiz",
  "Test",
  "Midterm",
  "Final Exam",
  "Reading"
];

export default function EditTaskModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isLoading = false,
}: EditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (initialData) {
      // If initialData exists, pre-fill the state
      setTitle(initialData.title || "");
      setTag(initialData.tag || "");
      setDueDate(initialData.due_date ? initialData.due_date.split('T')[0] : "");
    } else {
      // Otherwise, clear the state
      setTitle("");
      setTag("");
      setDueDate("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !tag || !dueDate) return;
    
    onSave({
      id: initialData?.id, // Include the ID if in edit mode
      title: title.trim(),
      tag,
      dueDate
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
      <div className="bg-box2 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-accent1/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-text font-bold">Edit Task</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-text/60 hover:text-text transition-colors duration-200 p-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-text mb-2">
              Title *
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-box1 border-2 border-accent1/30 rounded-xl text-text placeholder-text/50 focus:outline-none focus:border-accent2 focus:ring-2 focus:ring-accent2/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              autoFocus
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-2">
              Tag *
            </label>
            <select
              className="w-full px-4 py-3 bg-box1 border-2 border-accent1/30 rounded-xl text-text focus:outline-none focus:border-accent2 focus:ring-2 focus:ring-accent2/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              required
              disabled={isLoading}
            >
              <option value="">Select a tag</option>
              {TASK_TAGS.map((taskTag) => (
                <option key={taskTag} value={taskTag}>
                  {taskTag}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-2">
              Due Date *
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-box1 border-2 border-accent1/30 rounded-xl text-text focus:outline-none focus:border-accent2 focus:ring-2 focus:ring-accent2/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-box1 text-text rounded-xl border-2 border-accent1/30 hover:bg-accent1/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !title.trim() || !tag || !dueDate}
              className="flex-1 px-4 py-3 bg-accent3 text-white rounded-xl hover:bg-accent3/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-accent3/50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
