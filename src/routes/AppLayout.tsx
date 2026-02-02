import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "../modules/ui/sidebar";
import { AppSidebar } from "../modules/app-sidebar";
import { CalendarProvider } from "../modules/event-calendar/calendar-context";

const AppLayout = () => {
  return (
    <CalendarProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </CalendarProvider>
  );
};

export default AppLayout;
