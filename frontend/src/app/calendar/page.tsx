"use client";

import Layout from "../../components/Layout";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'

export default function CalendarPage() {
  return (
    <Layout activePage="Calendar">
      <div className="w-full flex flex-col space-y-8">
        {/* Calendar Header Section */}
        <header className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-text text-3xl lg:text-4xl font-bold mb-2">
              Academic Calendar
            </h1>
            <p className="text-text/70 text-lg">
              Track your assignments, exams, and important dates
            </p>
          </div>
        </header>

        {/* Calendar Container */}
        <section className="space-y-6">
          <div className="bg-box1 rounded-xl shadow-md p-6">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek,listWeek'
              }}
              height="auto"
              events={[
                { 
                  title: 'Assignment 1', 
                  date: '2025-08-20', 
                  backgroundColor: 'var(--color-accent3)', 
                  borderColor: 'var(--color-accent3)',
                  extendedProps: { type: 'assignment', course: 'CS101' }
                },
                { 
                  title: 'Midterm', 
                  date: '2025-09-05', 
                  backgroundColor: 'var(--color-accent2)', 
                  borderColor: 'var(--color-accent2)',
                  extendedProps: { type: 'exam', course: 'CS101' }
                },
                { 
                  title: 'Project Due', 
                  date: '2025-09-15', 
                  backgroundColor: 'var(--color-accent4)', 
                  borderColor: 'var(--color-accent4)',
                  extendedProps: { type: 'project', course: 'CS201' }
                }
              ]}
              dayMaxEvents={true}
              moreLinkClick="popover"
              eventClick={(info) => {
                const event = info.event;
                const type = event.extendedProps.type || 'event';
                const course = event.extendedProps.course || 'Unknown Course';
                alert(`${type.toUpperCase()}: ${event.title}\nCourse: ${course}\nDate: ${event.start?.toLocaleDateString()}`);
              }}
              dayCellDidMount={(arg) => {
                // Add custom styling to today's cell
                if (arg.date.toDateString() === new Date().toDateString()) {
                  arg.el.style.backgroundColor = 'var(--color-accent1)';
                  arg.el.style.opacity = '0.1';
                }
              }}
              eventDidMount={(info) => {
                // Add custom styling to events based on type
                const type = info.event.extendedProps.type;
                if (type === 'assignment') {
                  info.el.style.borderLeft = '4px solid var(--color-accent3)';
                } else if (type === 'exam') {
                  info.el.style.borderLeft = '4px solid var(--color-accent2)';
                } else if (type === 'project') {
                  info.el.style.borderLeft = '4px solid var(--color-accent4)';
                }
              }}
            />
          </div>

          {/* Event Type Legend */}
          <div className="bg-box1 rounded-xl shadow-md p-6">
            <h3 className="text-text text-xl font-semibold mb-4">Event Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--color-accent3)' }}></div>
                <span className="text-text font-medium">Assignments</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--color-accent2)' }}></div>
                <span className="text-text font-medium">Exams</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--color-accent4)' }}></div>
                <span className="text-text font-medium">Projects</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        /* FullCalendar Custom Styling */
        .fc {
          font-family: var(--font-sans), Arial, Helvetica, sans-serif;
          color: var(--color-text);
        }

        /* Header styling */
        .fc-toolbar {
          margin-bottom: 1.5rem !important;
        }

        .fc-toolbar-title {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          color: var(--color-text) !important;
        }

        .fc-button {
          background-color: var(--color-box2) !important;
          border: 1px solid var(--color-accent1) !important;
          color: var(--color-text) !important;
          border-radius: 0.5rem !important;
          padding: 0.5rem 1rem !important;
          font-weight: 500 !important;
          transition: all 0.2s ease-in-out !important;
        }

        .fc-button:hover {
          background-color: var(--color-accent1) !important;
          color: var(--color-text) !important;
          transform: translateY(-1px) !important;
        }

        .fc-button:focus {
          box-shadow: 0 0 0 2px var(--color-accent1) !important;
          outline: none !important;
        }

        .fc-button-active {
          background-color: var(--color-accent3) !important;
          color: white !important;
          border-color: var(--color-accent3) !important;
        }

        .fc-button:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
        }

        /* Today button special styling */
        .fc-today-button {
          background-color: var(--color-accent3) !important;
          color: white !important;
          border-color: var(--color-accent3) !important;
        }

        .fc-today-button:hover {
          background-color: var(--color-accent3) !important;
          opacity: 0.9 !important;
        }

        /* Calendar grid styling */
        .fc-daygrid-day {
          border-color: var(--color-box2) !important;
        }

        .fc-daygrid-day-number {
          color: var(--color-text) !important;
          font-weight: 500 !important;
        }

        .fc-daygrid-day.fc-day-today {
          background-color: var(--color-accent1) !important;
          opacity: 0.1 !important;
        }

        .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
          font-weight: 700 !important;
          color: var(--color-accent4) !important;
        }

        /* Weekend styling */
        .fc-day-sun, .fc-day-sat {
          background-color: var(--color-box2) !important;
          opacity: 0.7 !important;
        }

        /* Event styling */
        .fc-event {
          border-radius: 0.375rem !important;
          border: none !important;
          padding: 0.25rem 0.5rem !important;
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          transition: all 0.2s ease-in-out !important;
        }

        .fc-event:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
        }

        .fc-event-title {
          color: white !important;
          font-weight: 600 !important;
        }

        /* More events link */
        .fc-daygrid-more-link {
          color: var(--color-accent3) !important;
          font-weight: 500 !important;
          text-decoration: none !important;
        }

        .fc-daygrid-more-link:hover {
          color: var(--color-accent4) !important;
          text-decoration: underline !important;
        }

        /* Popover styling */
        .fc-popover {
          background-color: var(--color-box1) !important;
          border: 1px solid var(--color-accent1) !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
        }

        .fc-popover-header {
          background-color: var(--color-accent1) !important;
          color: var(--color-text) !important;
          border-bottom: 1px solid var(--color-accent1) !important;
          border-radius: 0.5rem 0.5rem 0 0 !important;
        }

        .fc-popover-close {
          color: var(--color-text) !important;
        }

        /* List view styling */
        .fc-list {
          background-color: transparent !important;
        }

        .fc-list-day {
          background-color: var(--color-accent1) !important;
          color: var(--color-text) !important;
          font-weight: 600 !important;
          padding: 0.75rem 1rem !important;
          border-radius: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }

        .fc-list-event {
          background-color: var(--color-box2) !important;
          border: 1px solid var(--color-accent1) !important;
          border-radius: 0.375rem !important;
          margin-bottom: 0.25rem !important;
          transition: all 0.2s ease-in-out !important;
        }

        .fc-list-event:hover {
          background-color: var(--color-accent1) !important;
          transform: translateX(4px) !important;
        }

        .fc-list-event-dot {
          border-color: var(--color-accent3) !important;
        }

        .fc-list-event-time {
          color: var(--color-accent4) !important;
          font-weight: 500 !important;
        }

        .fc-list-event-title {
          color: var(--color-text) !important;
          font-weight: 600 !important;
        }

        /* Week view styling */
        .fc-timegrid {
          background-color: transparent !important;
        }

        .fc-timegrid-slot {
          border-color: var(--color-box2) !important;
        }

        .fc-timegrid-slot-label {
          color: var(--color-text) !important;
          font-weight: 500 !important;
        }

        .fc-timegrid-axis {
          background-color: var(--color-box2) !important;
          border-color: var(--color-accent1) !important;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .fc-toolbar {
            flex-direction: column !important;
            gap: 1rem !important;
          }
          
          .fc-toolbar-chunk {
            display: flex !important;
            justify-content: center !important;
          }

          .fc-button {
            padding: 0.375rem 0.75rem !important;
            font-size: 0.875rem !important;
          }
        }
      `}</style>
    </Layout>
  );
}
