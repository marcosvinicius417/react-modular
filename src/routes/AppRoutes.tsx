import { Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import BigCalendar from "../modules/big-calendar";
import { CalendarProvider } from "../modules/event-calendar/calendar-context";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <CalendarProvider>
              <div className="flex flex-1 flex-col gap-4 p-2 pt-0">
                <BigCalendar />
              </div>
            </CalendarProvider>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
