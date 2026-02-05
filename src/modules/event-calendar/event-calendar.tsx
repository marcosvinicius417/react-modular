import { useEffect, useMemo, useState } from "react";
import { useCalendarContext } from "./calendar-context";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";

import { ptBR } from "date-fns/locale";

import {
  addHoursToDate,
  AgendaDaysToShow,
  AgendaView,
  CalendarDndProvider,
  type CalendarEvent,
  type CalendarView,
  type CalendarViewLabel,
  DayView,
  EventDialog,
  EventGap,
  EventHeight,
  MonthView,
  WeekCellsHeight,
  WeekView,
} from "../event-calendar";
import { cn } from "./lib/utils";

import { CotinButton, CotinDropdownNew, CotinTitle } from '@cotin/biblioteca-componentes-react';

export interface EventCalendarProps {
  events?: CalendarEvent[];
  onEventAdd?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  className?: string;
  initialView?: CalendarView;
  initialViewLabel?: CalendarViewLabel;
}

export function EventCalendar({
  events = [],
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  className,
  initialView = "week",
  initialViewLabel = "Semana",
}: EventCalendarProps) {
  const { currentDate, setCurrentDate } = useCalendarContext();
  const [view, setView] = useState<CalendarView>(initialView);
  const [viewLabel, setViewLabel] =
    useState<CalendarViewLabel>(initialViewLabel);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  const viewOptions = [
    { value: "month", label: "Mês" },
    { value: "week", label: "Semana" },
    { value: "day", label: "Dia" },
    { value: "agenda", label: "Agenda" },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        isEventDialogOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "m":
          setView("month");
          break;
        case "w":
          setView("week");
          break;
        case "d":
          setView("day");
          break;
        case "a":
          setView("agenda");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEventDialogOpen]);

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, -1));
    } else if (view === "agenda") {
      setCurrentDate(addDays(currentDate, -AgendaDaysToShow));
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, 1));
    } else if (view === "agenda") {
      setCurrentDate(addDays(currentDate, AgendaDaysToShow));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleEventCreate = (startTime: Date) => {
    const minutes = startTime.getMinutes();
    const remainder = minutes % 15;
    if (remainder !== 0) {
      if (remainder < 7.5) {
        startTime.setMinutes(minutes - remainder);
      } else {
        startTime.setMinutes(minutes + (15 - remainder));
      }

      startTime.setSeconds(0);
      startTime.setMilliseconds(0);
    }

    const newEvent: CalendarEvent = {
      id: "",
      title: "",
      start: startTime,
      end: addHoursToDate(startTime, 1),
      allDay: false,
    };
    setSelectedEvent(newEvent);
    setIsEventDialogOpen(true);
  };

  const handleEventSave = (event: CalendarEvent) => {
    if (event.id) {
      onEventUpdate?.(event);
      // Show toast notification when an event is updated
      // toast(`Event "${event.title}" updated`, {
      //   description: format(new Date(event.start), "MMM d, yyyy"),
      //   position: "bottom-left",
      // });
    } else {
      onEventAdd?.({
        ...event,
        id: Math.random().toString(36).substring(2, 11),
      });
      // Show toast notification when an event is added
      // toast(`Event "${event.title}" added`, {
      //   description: format(new Date(event.start), "MMM d, yyyy"),
      //   position: "bottom-left",
      // });
    }
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleEventDelete = (eventId: string) => {
    const deletedEvent = events.find((e) => e.id === eventId);
    onEventDelete?.(eventId);
    setIsEventDialogOpen(false);
    setSelectedEvent(null);

    if (deletedEvent) {
      // toast(`Event "${deletedEvent.title}" deleted`, {
      //   description: format(new Date(deletedEvent.start), "MMM d, yyyy"),
      //   position: "bottom-left",
      // });
    }
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    onEventUpdate?.(updatedEvent);

    // Show toast notification when an event is updated via drag and drop
    // toast(`Event "${updatedEvent.title}" moved`, {
    //   description: format(new Date(updatedEvent.start), "MMM d, yyyy"),
    //   position: "bottom-left",
    // });
  };

  const viewTitle = useMemo(() => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy", { locale: ptBR });
    } else if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 0, locale: ptBR });
      const end = endOfWeek(currentDate, { weekStartsOn: 0, locale: ptBR });
      if (isSameMonth(start, end)) {
        return format(start, "MMMM yyyy", { locale: ptBR });
      } else {
        return `${format(start, "MMM", { locale: ptBR })} - ${format(end, "MMM yyyy", { locale: ptBR })}`;
      }
    } else if (view === "day") {
      return (
        <>
          <span className="min-sm:hidden" aria-hidden="true">
            {format(currentDate, "MMM d, yyyy", { locale: ptBR })}
          </span>
          <span className="max-sm:hidden min-md:hidden" aria-hidden="true">
            {format(currentDate, "MMMM d, yyyy", { locale: ptBR })}
          </span>
          <span className="max-md:hidden">
            {format(currentDate, "EEE MMMM d, yyyy", { locale: ptBR })}
          </span>
        </>
      );
    } else if (view === "agenda") {
      const start = currentDate;
      const end = addDays(currentDate, AgendaDaysToShow - 1);

      if (isSameMonth(start, end)) {
        return format(start, "MMMM yyyy", { locale: ptBR });
      } else {
        return `${format(start, "MMM", { locale: ptBR })} - ${format(end, "MMM yyyy", { locale: ptBR })}`;
      }
    } else {
      return format(currentDate, "MMMM yyyy", { locale: ptBR });
    }
  }, [currentDate, view]);

  return (
    <div
      className="flex has-data-[slot=month-view]:flex-1 flex-col rounded-lg"
      style={
        {
          "--event-height": `${EventHeight}px`,
          "--event-gap": `${EventGap}px`,
          "--week-cells-height": `${WeekCellsHeight}px`,
        } as React.CSSProperties
      }
    >
      <CalendarDndProvider onEventUpdate={handleEventUpdate}>
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-5 sm:px-4",
            className,
          )}
        >
          {/* Mês com setas ao lado */}
          <div className="flex items-center gap-2">
            <CotinTitle level='h4' id='view-title'>{viewTitle}</CotinTitle>
            <div className="flex items-center gap-1">
              <CotinButton
                id="previous-month"
                variant="icon"
                size="small"
                onClick={handlePrevious}
                icon={
                  <span className="text-black">
                    <ArrowBackIosIcon sx={{ fontSize: 20 }} />
                  </span>
                }
              />
              <CotinButton
                id="next-month"
                variant="icon"
                size="small"
                onClick={handleNext}
                icon={
                  <span className="text-black" >
                    <ArrowForwardIosIcon sx={{ fontSize: 20 }} />
                  </span>
                }
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center justify-between gap-2">
              {/* <Button
                className="max-sm:h-8 max-sm:px-2.5!"
                onClick={handleToday}
              >
                Hoje
              </Button> */}
              <CotinButton
                id="today"
                variant="primary"
                size="default"
                onClick={handleToday}
                text="Hoje"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <CotinButton
                id="new-event"
                variant="default"
                text="Novo Evento"
                onClick={() => {
                  setSelectedEvent(null);
                  setIsEventDialogOpen(true);
                }}
              />
              <CotinDropdownNew
                id="view-selector"
                options={viewOptions}
                placeholder={viewLabel}
                size="default"
                variant="simple"
                onSelectionChange={(option) => {
                  const viewMap: Record<string, CalendarView> = {
                    "month": "month",
                    "week": "week",
                    "day": "day",
                    "agenda": "agenda",
                  };
                  const labelMap: Record<string, CalendarViewLabel> = {
                    "month": "Mês",
                    "week": "Semana",
                    "day": "Dia",
                    "agenda": "Agenda",
                  };
                  setView(viewMap[option.value]);
                  setViewLabel(labelMap[option.value]);
                }}

              />

            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          {view === "month" && (
            <MonthView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}
          {view === "week" && (
            <WeekView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}
          {view === "day" && (
            <DayView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}
          {view === "agenda" && (
            <AgendaView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
            />
          )}
        </div>

        <EventDialog
          event={selectedEvent}
          isOpen={isEventDialogOpen}
          onClose={() => {
            setIsEventDialogOpen(false);
            setSelectedEvent(null);
          }}
          onSave={handleEventSave}
          onDelete={handleEventDelete}
        />
      </CalendarDndProvider>
    </div>
  );
}
