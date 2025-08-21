# Sidebar Component

A collapsible sidebar component for the TermTracker application with smooth transitions and navigation.

## Features

- **Collapsible Design**: Sidebar can be expanded/collapsed with smooth slide transitions
- **Navigation Links**: Dashboard, Courses, Tasks, Calendar with active state highlighting
- **Responsive**: Adapts to different screen sizes
- **Smooth Animations**: 300ms transition for expand/collapse and arrow rotation
- **Color Scheme**: Matches the app's warm orange/peach theme (#E8966E)

## Usage

### Basic Usage

```tsx
import Sidebar from './components/Sidebar';

function MyPage() {
  return (
    <Sidebar activePage="Dashboard">
      <div>
        <h1>Dashboard Content</h1>
        <p>Your page content goes here</p>
      </div>
    </Sidebar>
  );
}
```

### With Layout Component

```tsx
import Layout from './components/Layout';

function MyPage() {
  return (
    <Layout activePage="Courses">
      <div>
        <h1>Courses Content</h1>
        <p>Your page content goes here</p>
      </div>
    </Layout>
  );
}
```

## Props

### Sidebar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activePage` | `string` | `'Dashboard'` | The currently active navigation page |
| `children` | `React.ReactNode` | - | Content to render in the main area |

### Layout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activePage` | `string` | `'Dashboard'` | The currently active navigation page |
| `children` | `React.ReactNode` | - | Content to render in the main area |

## Navigation Items

The sidebar includes these navigation links:
- **Dashboard** (`/`) - 📊
- **Courses** (`/courses`) - 📚
- **Tasks** (`/tasks`) - ✅
- **Calendar** (`/calendar`) - 📅

## Styling

The sidebar uses the following color scheme:
- **Background**: `#E8966E` (warm orange/peach)
- **Text**: `#2D1810` (dark brown)
- **Active/Hover**: `#D77A61` with opacity variations
- **Main Content Background**: `#FFFBF0` (cream)

## Behavior

- **Default State**: Collapsed (shows only logo and toggle button)
- **Toggle**: Click the arrow button to expand/collapse
- **Arrow Direction**: 
  - Right arrow (▶) when collapsed
  - Left arrow (◀) when expanded
- **Transition**: 300ms smooth slide animation
- **Active Link**: Bold text with subtle background highlight

## Examples

See `SidebarExample.tsx` for complete usage examples with different active pages.
