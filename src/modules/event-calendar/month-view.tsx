import React, { useEffect, useMemo, useState } from "react";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { ptBR } from "date-fns/locale";
import { CotinDrawer } from "@cotin/biblioteca-componentes-react";

import { EventItem } from "./event-item";
import { getAllEventsForDay, getEventsForDay, getSpanningEventsForDay, sortEvents } from "./utils";
import type { CalendarEvent } from "./types";
import { useEventVisibility } from "./hooks/use-event-visibility";
import { EventGap, EventHeight, DefaultStartHour } from "./constants";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
  onEventCreate: (startTime: Date) => void;
}

export function MonthView({
  currentDate,
  events,
  onEventSelect,
  onEventCreate,
}: MonthViewProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, {
      weekStartsOn: 0,
      locale: ptBR,
    });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0, locale: ptBR });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const weekdays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(startOfWeek(new Date()), i);
      return format(date, "EEE", { locale: ptBR });
    });
  }, []);

  const weeks = useMemo(() => {
    const result = [];
    let week = [];

    for (let i = 0; i < days.length; i++) {
      week.push(days[i]);
      if (week.length === 7 || i === days.length - 1) {
        result.push(week);
        week = [];
      }
    }

    return result;
  }, [days]);

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventSelect(event);
  };

  const [isMounted, setIsMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const { contentRef, getVisibleEventCount } = useEventVisibility({
    eventHeight: EventHeight,
    eventGap: EventGap,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div data-slot="month-view" className="contents">
      <div className="border-border/70 grid grid-cols-7 border-y uppercase">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-muted-foreground/70 py-2 text-center text-xs"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid flex-1 auto-rows-fr">
        {weeks.map((week, weekIndex) => (
          <div
            key={`week-${weekIndex}`}
            className="grid grid-cols-7 [&:last-child>*]:border-b-0"
          >
            {week.map((day, dayIndex) => {
              if (!day) return null;

              const dayEvents = getEventsForDay(events, day);
              const spanningEvents = getSpanningEventsForDay(events, day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const allDayEvents = [...spanningEvents, ...dayEvents];
              const allEvents = getAllEventsForDay(events, day);

              const isReferenceCell = weekIndex === 0 && dayIndex === 0;
              const visibleCount = isMounted
                ? getVisibleEventCount(allDayEvents.length)
                : undefined;
              const hasMore =
                visibleCount !== undefined &&
                allDayEvents.length > visibleCount;
              const remainingCount = hasMore
                ? allDayEvents.length - visibleCount
                : 0;

              return (
                <div
                  key={day.toString()}
                  className="group border-border/70 data-outside-cell:bg-muted/25 data-outside-cell:text-muted-foreground/70 border-r border-b last:border-r-0 p-1"
                  data-today={isToday(day) || undefined}
                  data-outside-cell={!isCurrentMonth || undefined}
                  onClick={() => {
                    const startTime = new Date(day);
                    startTime.setHours(DefaultStartHour, 0, 0);
                    onEventCreate(startTime);
                  }}
                >
                  <div className="group-data-today:bg-primary group-data-today:text-primary-foreground mt-1 inline-flex size-6 items-center justify-center rounded-full text-sm">
                    {format(day, "d", { locale: ptBR })}
                  </div>
                  <div
                    ref={isReferenceCell ? contentRef : null}
                    className="min-h-[calc((var(--event-height)+var(--event-gap))*2)] sm:min-h-[calc((var(--event-height)+var(--event-gap))*3)] lg:min-h-[calc((var(--event-height)+var(--event-gap))*4)]"
                  >
                    {sortEvents(allDayEvents).map((event, index) => {
                      const eventStart = new Date(event.start);
                      const eventEnd = new Date(event.end);
                      const isFirstDay = isSameDay(day, eventStart);
                      const isLastDay = isSameDay(day, eventEnd);

                      const isHidden =
                        isMounted && visibleCount && index >= visibleCount;

                      if (!visibleCount) return null;

                      if (!isFirstDay) {
                        return (
                          <div
                            key={`spanning-${event.id}-${day.toISOString().slice(0, 10)}`}
                            className="aria-hidden:hidden"
                            aria-hidden={isHidden ? "true" : undefined}
                          >
                            <EventItem
                              onClick={(e) => handleEventClick(event, e)}
                              event={event}
                              view="month"
                              isFirstDay={isFirstDay}
                              isLastDay={isLastDay}
                            >
                              <div className="invisible" aria-hidden={true}>
                                {!event.allDay && (
                                  <span>
                                    {format(new Date(event.start), "h:mm", {
                                      locale: ptBR,
                                    })}{" "}
                                  </span>
                                )}
                                {event.title}
                              </div>
                            </EventItem>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={event.id}
                          className="aria-hidden:hidden"
                          aria-hidden={isHidden ? "true" : undefined}
                        >
                          <EventItem
                            event={event}
                            view="month"
                            onClick={(e) => handleEventClick(event, e)}
                            isFirstDay={isFirstDay}
                            isLastDay={isLastDay}
                          />
                        </div>
                      );
                    })}

                    {hasMore && (
                      <>
                        <button
                          className="focus-visible:border-ring focus-visible:ring-ring/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 mt-[var(--event-gap)] flex h-[var(--event-height)] w-full items-center overflow-hidden px-1 text-left text-[10px] backdrop-blur-md transition outline-none select-none focus-visible:ring-[3px] sm:px-2 sm:text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDay(day);
                            setDrawerOpen(true);
                          }}
                        >
                          <span>
                            + {remainingCount}{" "}
                            <span className="max-sm:sr-only">more</span>
                          </span>
                        </button>

                        {selectedDay && isSameDay(selectedDay, day) && (
                          <div onClick={(e) => e.stopPropagation()}>
                            <CotinDrawer
                              isOpen={drawerOpen}
                              onClose={() => setDrawerOpen(false)}
                              title={format(day, "EEE, d 'de' MMMM", { locale: ptBR })}
                              placement="right"
                            >
                              <div className="space-y-4">
                                {sortEvents(allEvents).map((event) => {
                                  const eventStart = new Date(event.start);
                                  const eventEnd = new Date(event.end);
                                  
                                  const startTime = format(eventStart, "HH:mm");
                                  const endTime = format(eventEnd, "HH:mm");

                                  return (
                                    <div
                                      key={event.id}
                                      className="p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow"
                                      style={{
                                        borderLeftColor: event.color || "#3b82f6",
                                        backgroundColor: (event.color || "#3b82f6") + "15",
                                      }}
                                      onClick={(e) =>
                                        handleEventClick(event, e)
                                      }
                                    >
                                      <div className="flex flex-col gap-2">
                                        <h3 className="font-bold text-base text-foreground">
                                          {event.title}
                                        </h3>
                                        {!event.allDay && (
                                          <div className="text-sm text-muted-foreground">
                                            {startTime} - {endTime}
                                          </div>
                                        )}
                                        {event.allDay && (
                                          <div className="text-sm text-muted-foreground">
                                            Dia inteiro
                                          </div>
                                        )}
                                        {event.description && (
                                          <p className="text-sm text-foreground/80 mt-1">
                                            {event.description}
                                          </p>
                                        )}
                                        {event.location && (
                                          <p className="text-xs text-muted-foreground">
                                            📍 {event.location}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </CotinDrawer>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
