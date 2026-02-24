export type CalendarView = "month" | "week" | "day";
export type CalendarViewLabel = "Mês" | "Semana" | "Dia";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  label?: string;
  location?: string;
}


