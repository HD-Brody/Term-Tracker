"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faListCheck } from "@fortawesome/free-solid-svg-icons";
import { getCourses } from "../lib/supabaseQueries";

interface SidebarProps {
  activePage?: string;
  children?: React.ReactNode;
}

export default function Sidebar({
  activePage = "Dashboard",
  children,
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showCoursesDropdown, setShowCoursesDropdown] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);

  const navigationItems = [
    { name: "Dashboard", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Calendar", href: "/calendar" },
  ];

  // Fetch courses for the dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    
    if (isExpanded) {
      fetchCourses();
    }
  }, [isExpanded]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleCoursesDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCoursesDropdown(!showCoursesDropdown);
  };

  // Control text visibility with delay to match width transition
  useEffect(() => {
    if (isExpanded) {
      // Show text after width transition starts
      const timer = setTimeout(() => setShowText(true), 180);
      return () => clearTimeout(timer);
    } else {
      // Hide text immediately when collapsing
      setShowText(false);
      setShowCoursesDropdown(false);
    }
  }, [isExpanded]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`
          bg-accent1 shadow-lg transition-all duration-300 ease-in-out
          ${isExpanded ? "w-64" : "w-16"}
          flex flex-col items-center relative
        `}
        onClick={toggleSidebar}
      >
        {/* Logo Section */}
        <div className="w-full p-4 flex items-center justify-center">
          {showText ? (
            <div className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faListCheck} size="2x" className="text-text" />
              <span className="text-text font-bold text-[25px]">
                TermTracker
              </span>
            </div>
          ) : (
            <FontAwesomeIcon icon={faListCheck} size="2x" className="text-text" />
          )}
        </div>

        {/* Navigation Links - Only show when expanded */}
        {showText && (
          <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 px-2">
            <div className="flex flex-col items-start">
              {navigationItems.map((item) => (
                <div key={item.name} className="mb-6 w-full relative">
                  {item.name === "Courses" ? (
                    <div
                      className="ml-4 text-[25px] cursor-pointer hover:text-accent4 transition-colors duration-200 relative"
                      onClick={toggleCoursesDropdown}
                    >
                      {item.name}
                      {/* Dropdown arrow */}
                      <svg
                        className={`inline-block ml-2 w-4 h-4 transition-transform duration-200 ${
                          showCoursesDropdown ? 'rotate-180' : 'rotate-0'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      
                      {/* Courses Dropdown */}
                      {showCoursesDropdown && (
                        <div 
                          className="absolute left-0 top-full mt-2 w-56 bg-box1 rounded-lg shadow-xl border border-accent1/20 z-50"
                        >
                          <div className="p-3">
                            <div className="text-sm font-medium text-text/60 mb-2 px-2">Your Courses</div>
                            {courses.length > 0 ? (
                              <div className="space-y-1">
                                {courses.map((course) => (
                                  <a
                                    key={course.id}
                                    href={`/courses?id=${course.id}&name=${encodeURIComponent(course.name)}&code=${encodeURIComponent(course.course_code || '')}&professor=${encodeURIComponent(course.professor || '')}&semester=${encodeURIComponent(course.semester || '')}`}
                                    className="block px-3 py-2 text-sm text-text hover:bg-accent1/20 rounded-md transition-colors duration-200"
                                  >
                                    <div className="font-medium">{course.name}</div>
                                    {course.course_code && (
                                      <div className="text-xs text-accent2">{course.course_code}</div>
                                    )}
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <div className="px-3 py-2 text-sm text-text/60">
                                No courses yet
                              </div>
                            )}

                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className="ml-4 text-[25px] hover:text-accent4 transition-colors duration-200 cursor-pointer"
                    >
                      {item.name}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Toggle Button - Centered when closed, fixed distance from right when expanded */}
        <div
          className={`
          absolute top-1/2 transform -translate-y-1/2 transition-all duration-300
          ${isExpanded ? "right-4" : "left-1/2 -translate-x-1/2"}
        `}
        >
          <button
            className="
              w-8 h-8 rounded-full
              flex items-center justify-center transition-all duration-200
            "
          >
            <svg
              className={`w-4 h-4 text-accent4 transition-transform duration-300 ${
                isExpanded ? "rotate-0" : "rotate-180"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="5"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#FFFBF0] overflow-auto px-40 py-20">
        {children}
      </main>
    </div>
  );
}
