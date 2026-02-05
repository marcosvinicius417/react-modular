import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "../modules/ui/sidebar";
import { CalendarProvider } from "../modules/event-calendar/calendar-context";

const AppLayout = () => {
  return (
    <CalendarProvider>
      <SidebarProvider>
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </CalendarProvider>
  );
};

export default AppLayout;