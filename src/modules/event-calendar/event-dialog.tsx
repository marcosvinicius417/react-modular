import { useEffect, useMemo, useState } from "react";
import { format, isBefore } from "date-fns";
import { CotinButton, CotinCheckbox, CotinInputAdvanced, CotinRadio, CotinText, CotinTextArea, CotinTitle } from '@cotin/biblioteca-componentes-react';
import type { CalendarEvent, EventColor } from "../event-calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "./lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  StartHour,
  EndHour,
  DefaultStartHour,
  DefaultEndHour,
} from "../event-calendar/constants";
import CallEndIcon from "@mui/icons-material/CallEnd";
import z from "zod";
import { useForm, Controller } from "react-hook-form";
import InputController from "../../core/shared/components/InputController";

interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

// Função auxiliar movida para fora do componente
const formatTimeForInput = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = Math.floor(date.getMinutes() / 15) * 15;
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
};

// Schema Zod baseado na interface CalendarEvent
const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  allDay: z.boolean(),
  location: z.string().optional(),
  color: z.enum(["blue", "orange", "violet", "rose", "emerald"]),
}).refine((data) => {
  // Se não for allDay, valida horários
  if (!data.allDay) {
    if (!data.startTime || !data.endTime) {
      return false;
    }
  }
  return true;
}, {
  message: "Horários são obrigatórios quando não é dia inteiro",
  path: ["startTime"],
}).refine((data) => {
  // Valida que endDate não é antes de startDate
  return !isBefore(data.endDate, data.startDate);
}, {
  message: "Data de término não pode ser antes da data de início",
  path: ["endDate"],
});

type FormData = z.infer<typeof formSchema>;

export function EventDialog({
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: EventDialogProps) {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      startTime: `${DefaultStartHour}:00`,
      endTime: `${DefaultEndHour}:00`,
      allDay: false,
      location: "",
      color: "blue",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const allDay = watch("allDay");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  // Atualiza o formulário quando o evento muda
  useEffect(() => {
    if (event) {
      const start = new Date(event.start);
      const end = new Date(event.end);

      reset({
        title: event.title || "",
        description: event.description || "",
        startDate: start,
        endDate: end,
        startTime: formatTimeForInput(start),
        endTime: formatTimeForInput(end),
        allDay: event.allDay ?? false,
        location: event.location || "",
        color: (event.color as EventColor) || "blue",
      });
    } else {
      reset({
        title: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(),
        startTime: `${DefaultStartHour}:00`,
        endTime: `${DefaultEndHour}:00`,
        allDay: false,
        location: "",
        color: "blue",
      });
    }
  }, [event, reset]);

  const timeOptions = useMemo(() => {
    const options = [];
    for (let hour = StartHour; hour <= EndHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        const value = `${formattedHour}:${formattedMinute}`;
        const date = new Date(2000, 0, 1, hour, minute);
        const label = format(date, "h:mm a");
        options.push({ value, label });
      }
    }
    return options;
  }, []);

  const handleSave = (data: FormData) => {
    console.log("📝 handleSave chamado com:", data);
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (!data.allDay && data.startTime && data.endTime) {
      const [startHours = 0, startMinutes = 0] = data.startTime
        .split(":")
        .map(Number);
      const [endHours = 0, endMinutes = 0] = data.endTime.split(":").map(Number);

      start.setHours(startHours, startMinutes, 0);
      end.setHours(endHours, endMinutes, 0);
    } else {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    }

    const calendarEvent: CalendarEvent = {
      id: event?.id || "",
      title: data.title.trim() || "(no title)",
      description: data.description,
      start,
      end,
      allDay: data.allDay,
      location: data.location,
      color: data.color,
    };
    onSave(calendarEvent);
  };

  const handleDelete = () => {
    if (event?.id) {
      onDelete(event.id);
    }
  };

  const colorOptions: Array<{
    value: EventColor;
    label: string; // Adicionar esta propriedade
    color: string;
    bgClass: string;
    borderClass: string;
  }> = [
      {
        value: "blue",
        label: "", // Adicionar
        color: "blue",
        bgClass: "bg-blue-400 data-[state=checked]:bg-blue-400",
        borderClass: "border-blue-400 data-[state=checked]:border-blue-400",
      },
      {
        value: "violet",
        label: "", // Adicionar
        color: "violet",
        bgClass: "bg-violet-400 data-[state=checked]:bg-violet-400",
        borderClass: "border-violet-400 data-[state=checked]:border-violet-400",
      },
      {
        value: "rose",
        label: "", // Adicionar
        color: "#f43f5e",
        bgClass: "bg-rose-400 data-[state=checked]:bg-rose-400",
        borderClass: "border-rose-400 data-[state=checked]:border-rose-400",
      },
      {
        value: "emerald",
        label: "", // Adicionar
        color: "#10b981",
        bgClass: "bg-emerald-400 data-[state=checked]:bg-emerald-400",
        borderClass: "border-emerald-400 data-[state=checked]:border-emerald-400",
      },
      {
        value: "orange",
        label: "", // Adicionar
        color: "orange",
        bgClass: "bg-orange-400 data-[state=checked]:bg-orange-400",
        borderClass: "border-orange-400 data-[state=checked]:border-orange-400",
      },
    ];

  return (
    <Dialog open={isOpen} onOpenChange={(open: any) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(
            (data) => {
              console.log("✅ Formulário válido, dados:", data);
              handleSave(data);
            },
            (errors) => {
              console.log("❌ Erros de validação:", errors);
              console.log("Erros detalhados:", JSON.stringify(errors, null, 2));
            }
          )}
        >
          <DialogHeader>
            <CotinTitle
              id="event-title"
              level='h3'
              children={event?.id ? "Editar Evento" : "Criar Evento"}
            />
            <CotinText
              id="event-description"
              children={event?.id ?
                "Editar o detalhes deste evento" :
                "Adicionar um novo evento ao seu calendário"}
            />
          </DialogHeader>

          {errors.root && (
            <div className="bg-destructive/15 text-destructive rounded-md px-3 py-2 text-sm">
              {errors.root.message}
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="*:not-first:mt-1.5">
              <InputController name="title" control={control}>
                <CotinInputAdvanced
                  id="title"
                  label="Título"
                  required
                  errorMessage={errors.title?.message}
                />
              </InputController>
            </div>

            <div className="*:not-first:mt-1.5">
              <InputController name="description" control={control}>
                <CotinTextArea
                  label="Descrição"
                  id="description"
                  rows={3}
                />
              </InputController>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 *:not-first:mt-1.5">
                <Label htmlFor="start-date">Start Date</Label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="start-date"
                      variant={"outline"}
                      className={cn(
                        "group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "truncate",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </span>
                      <CallEndIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      defaultMonth={startDate}
                      onSelect={(date: any) => {
                        if (date) {
                          setValue("startDate", date);
                          if (isBefore(endDate, date)) {
                            setValue("endDate", date);
                          }
                          setStartDateOpen(false);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.startDate && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              {!allDay && (
                <div className="min-w-28 *:not-first:mt-1.5">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Controller
                    name="startTime"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="start-time">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.startTime && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.startTime.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex-1 *:not-first:mt-1.5">
                <Label htmlFor="end-date">End Date</Label>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="end-date"
                      variant={"outline"}
                      className={cn(
                        "group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
                        !endDate && "text-muted-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "truncate",
                          !endDate && "text-muted-foreground",
                        )}
                      >
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </span>
                      <CallEndIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      defaultMonth={endDate}
                      disabled={{ before: startDate }}
                      onSelect={(date: any) => {
                        if (date) {
                          setValue("endDate", date);
                          setEndDateOpen(false);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.endDate && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>

              {!allDay && (
                <div className="min-w-28 *:not-first:mt-1.5">
                  <Label htmlFor="end-time">End Time</Label>
                  <Controller
                    name="endTime"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="end-time">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.endTime && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.endTime.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Controller
                name="allDay"
                control={control}
                render={({ field }) => (
                  <CotinCheckbox
                    id="allDay"
                    options={[{ label: "Todos os Dias", value: true }]}
                    value={field.value ? [true] : []}
                    onChange={(values) => field.onChange(values.includes(true))}
                  />
                )}
              />
            </div>

            <div className="*:not-first:mt-1.5">
              <InputController name="location" control={control}>
                <CotinInputAdvanced
                  id="location"
                  label="Local/Link"
                  placeholder="Local/Link"
                  errorMessage={errors.location?.message}
                />
              </InputController>
            </div>

            <fieldset className="space-y-4">
              <legend className="text-foreground text-sm leading-none font-medium">
                Etiquette
              </legend>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <CotinRadio
                    id="color"
                    options={colorOptions}
                    value={field.value}
                    onChange={(val) => {
                      field.onChange(val as EventColor);
                    }}
                    variant="color"
                    direction="horizontal"
                    errorMessage={errors.color?.message}
                  />
                )}
              />
            </fieldset>
          </div>

          <DialogFooter className="flex-row sm:justify-between">
            {event?.id && (
              <CotinButton
                id="delete-event"
                variant="icon"
                size="default"
                onClick={handleDelete}>
                <DeleteIcon sx={{ color: "red" }} />
              </CotinButton>

              // <Button
              //   variant="outline"
              //   className="text-destructive hover:text-destructive"
              //   size="icon"
              //   onClick={handleDelete}
              //   aria-label="Delete event"
              // >
              //   <CallEndIcon />
              // </Button>
            )}
            <div className="flex flex-1 justify-end gap-2">
              <CotinButton variant="default" id="cancel-event" onClick={onClose}>
                Cancelar
              </CotinButton>
              <CotinButton variant="primary" type="submit" id="save-event">
                Salvar
              </CotinButton>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}