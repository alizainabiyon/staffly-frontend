# Attendance Detail Page

## Overview

The Attendance Detail Page is a new feature that provides detailed attendance information for a specific date. It displays individual employee attendance records, summary statistics, and allows for easy navigation between the attendance history view and detailed view.

## Features

### 1. **Summary Statistics Cards**
- **Total Employees**: Shows the total number of employees
- **Present**: Count of employees present on the selected date
- **Absent**: Count of employees absent on the selected date
- **Attendance Rate**: Percentage of employees present

### 2. **Additional Statistics**
- **Late Arrivals**: Number of employees who arrived late
- **Total Working Hours**: Sum of all working hours for the day
- **Total Overtime**: Sum of all overtime hours for the day

### 3. **Employee Attendance Table**
- **Employee Information**: Name, profile picture, position, and department
- **Check-in/Check-out Times**: Individual employee arrival and departure times
- **Status**: Attendance status with color-coded badges
- **Working Hours**: Individual working hours for each employee
- **Overtime Hours**: Individual overtime hours for each employee
- **Notes**: Any additional notes or comments

### 4. **Actions**
- **View Employee**: Navigate to employee details (placeholder for future implementation)
- **Edit**: Edit attendance records for the selected date
- **Export**: Export attendance data (placeholder for future implementation)

## Navigation

### From Attendance History
1. Click the **Eye** button (👁️) in the "View Details" column
2. The detail page will open showing attendance information for that specific date

### Back to History
1. Click the **Back** button (←) in the top-left corner
2. You'll return to the attendance history view

## Component Structure

```
AttendanceContainer (Parent)
├── AttendanceHistory (Default View)
│   └── Monthly attendance summary table
└── AttendanceDetailPage (Detail View)
    ├── Header with navigation
    ├── Summary statistics cards
    ├── Additional statistics row
    └── Employee attendance table
```

## File Locations

- **Main Component**: `components/payroll/attendance/AttendanceDetailPage.tsx`
- **Container**: `components/payroll/attendance/AttendanceContainer.tsx`
- **Updated History**: `components/payroll/attendance/AttendanceHistory.tsx`
- **Page Integration**: `app/dashboard/payroll/attendance/page.tsx`

## State Management

The component uses Redux for state management:
- **`fetchAttendanceById`**: Fetches detailed attendance data for a specific date
- **`selectDailyAttendanceRecords`**: Selects individual employee attendance records
- **`selectAttendanceLoadingAttendance`**: Selects loading state for attendance data
- **`selectAttendanceError`**: Selects error state if any

## UI Design Patterns

The component follows the existing design system:
- **Cards**: Used for statistics and content sections
- **Badges**: Color-coded status indicators
- **DataTable**: Consistent table component with sorting and pagination
- **Icons**: Lucide React icons for visual consistency
- **Colors**: Semantic color coding (green for present, red for absent, etc.)

## Future Enhancements

1. **Employee Detail Navigation**: Implement the "View Employee" action
2. **Export Functionality**: Add CSV/PDF export for attendance data
3. **Real-time Updates**: Add WebSocket support for live attendance updates
4. **Bulk Actions**: Allow editing multiple employee records at once
5. **Attendance Trends**: Show attendance patterns over time

## Usage Example

```tsx
// In your parent component
<AttendanceContainer 
  employees={employees} 
  onEditAttendance={handleEditAttendance}
/>

// The container automatically handles navigation between views
```

## Styling

The component uses Tailwind CSS classes and follows the existing design system:
- **Responsive Grid**: Adapts to different screen sizes
- **Consistent Spacing**: Uses the established spacing scale
- **Color Scheme**: Follows the application's color palette
- **Typography**: Consistent font weights and sizes
