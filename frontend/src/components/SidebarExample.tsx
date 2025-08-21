"use client";
import Sidebar from './Sidebar';

export default function SidebarExample() {
  return (
    <div className="space-y-8">
      {/* Example 1: Dashboard (Active) */}
      <div>
        <h2 className="text-xl font-bold mb-4">Example 1: Dashboard (Active)</h2>
        <div className="border rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <Sidebar activePage="Dashboard">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Dashboard Content</h1>
              <p>This shows the Dashboard page with the Dashboard link highlighted as active.</p>
            </div>
          </Sidebar>
        </div>
      </div>

      {/* Example 2: Courses (Active) */}
      <div>
        <h2 className="text-xl font-bold mb-4">Example 2: Courses (Active)</h2>
        <div className="border rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <Sidebar activePage="Courses">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Courses Content</h1>
              <p>This shows the Courses page with the Courses link highlighted as active.</p>
            </div>
          </Sidebar>
        </div>
      </div>

      {/* Example 3: Tasks (Active) */}
      <div>
        <h2 className="text-xl font-bold mb-4">Example 3: Tasks (Active)</h2>
        <div className="border rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <Sidebar activePage="Tasks">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Tasks Content</h1>
              <p>This shows the Tasks page with the Tasks link highlighted as active.</p>
            </div>
          </Sidebar>
        </div>
      </div>

      {/* Example 4: Calendar (Active) */}
      <div>
        <h2 className="text-xl font-bold mb-4">Example 4: Calendar (Active)</h2>
        <div className="border rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <Sidebar activePage="Calendar">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">Calendar Content</h1>
              <p>This shows the Calendar page with the Calendar link highlighted as active.</p>
            </div>
          </Sidebar>
        </div>
      </div>
    </div>
  );
}
