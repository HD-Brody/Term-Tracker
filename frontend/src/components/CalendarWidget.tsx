"use client";

import { useEffect, useState, useMemo } from 'react';
import { getTasks, getCourses } from "../lib/supabaseQueries";

interface Task {
  id: string;
  title: string;
  due_date: string;
  tag: string;
  completed: boolean;
  course_id: string;
  courses?: {
    name: string;
    course_code?: string;
  };
}

interface Course {
  id: string;
  name: string;
  course_code?: string;
  professor?: string;
  semester?: string;
}

export default function CalendarWidget() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch tasks and courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksData, coursesData] = await Promise.all([
          getTasks(),
          getCourses()
        ]);
        setTasks(tasksData || []);
        setCourses(coursesData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Convert tasks to calendar events
  const calendarEvents = useMemo(() => {
    if (!tasks.length || !courses.length) return [];
    
    return tasks
      .filter((task: Task) => task.due_date && !task.completed) // Only show incomplete tasks with due dates
      .map((task: Task) => {
        const course = courses.find(c => c.id === task.course_id);
        const courseCode = course?.course_code || '';
        
        // Determine color based on tag
        let backgroundColor = 'var(--color-accent3)'; // default assignment color
        
        if (task.tag.toLowerCase().includes('exam') || task.tag.toLowerCase().includes('test')) {
          backgroundColor = 'var(--color-accent2)'; // exam color
        } else if (task.tag.toLowerCase().includes('project')) {
          backgroundColor = 'var(--color-accent4)'; // project color
        }

        return {
          id: task.id,
          title: task.title,
          date: task.due_date,
          backgroundColor,
          courseCode,
          tag: task.tag
        };
      });
  }, [tasks, courses]);

  // Get calendar data for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDateObj = new Date(startDate);
    
    while (currentDateObj <= lastDay || days.length < 42) {
      days.push(new Date(currentDateObj));
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }
    
    return days;
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return calendarEvents.filter(event => event.date === dateStr);
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  if (loading) {
    return (
      <div className="bg-box1 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text">Calendar</h2>
        </div>
        <div className="text-center py-8">
          <div className="text-text/60">Loading calendar...</div>
        </div>
      </div>
    );
  }

  const calendarDays = getCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-box1 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-text">Calendar</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-1 text-text/60 hover:text-text hover:bg-box2 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-text font-medium min-w-[120px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-1 text-text/60 hover:text-text hover:bg-box2 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-text/60 py-2">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((date, index) => {
          const events = getEventsForDate(date);
          const isTodayDate = isToday(date);
          const isCurrentMonthDate = isCurrentMonth(date);
          
          return (
            <div
              key={index}
              className={`
                min-h-[60px] p-1 border border-box2 rounded
                ${isTodayDate ? 'bg-accent1/20 border-accent1' : ''}
                ${!isCurrentMonthDate ? 'opacity-40' : ''}
                ${isCurrentMonthDate ? 'bg-box2/50' : 'bg-box2/20'}
              `}
            >
              <div className="text-right text-xs text-text/70 mb-1">
                {date.getDate()}
              </div>
              
              {/* Events for this day */}
              <div className="space-y-1">
                {events.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded text-white font-medium truncate"
                    style={{ backgroundColor: event.backgroundColor }}
                    title={`${event.title} - ${event.courseCode}`}
                  >
                    {event.title}
                  </div>
                ))}
                {events.length > 2 && (
                  <div className="text-xs text-text/60 text-center">
                    +{events.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Type Legend */}
      <div className="mt-4 pt-4 border-t border-box2">
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--color-accent3)' }}></div>
            <span className="text-text/70">Assignments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--color-accent2)' }}></div>
            <span className="text-text/70">Exams</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--color-accent4)' }}></div>
            <span className="text-text/70">Projects</span>
          </div>
        </div>
      </div>
    </div>
  );
}
