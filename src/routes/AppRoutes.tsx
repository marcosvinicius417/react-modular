import { Routes, Route } from "react-router-dom";
import BigCalendar from "../modules/big-calendar";
import { CalendarProvider } from "../modules/event-calendar/calendar-context";

const AppRoutes = () => {
  return (
    <CalendarProvider>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-1 flex-col gap-4 p-2 pt-0">
              <BigCalendar />
            </div>
          }
        />
      </Routes>
    </CalendarProvider>
  );
};

export default AppRoutes;
