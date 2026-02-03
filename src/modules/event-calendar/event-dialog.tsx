import { useEffect } from "react";
import { isBefore } from "date-fns";
import { CotinButton, CotinCheckbox, CotinDatePicker, CotinInputAdvanced, CotinModal, CotinText, CotinTextArea, CotinTimePicker, modelToDateStruct } from '@cotin/biblioteca-componentes-react';
import type { CalendarEvent } from "../event-calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import DeleteIcon from '@mui/icons-material/Delete';
import {
  DefaultStartHour,
  DefaultEndHour,
} from "../event-calendar/constants";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import InputController from "../../core/shared/components/InputController";

interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

const formatDateForInput = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateFromInput = (dateString: string) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatTimeForInput = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = Math.floor(date.getMinutes() / 15) * 15;
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
};

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().min(1, "Data de término é obrigatória"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  allDay: z.boolean(),
  location: z.string().optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor inválida")
}).refine((data) => {
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
  const startDate = parseDateFromInput(data.startDate);
  const endDate = parseDateFromInput(data.endDate);
  return !isBefore(endDate, startDate);
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
  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: formatDateForInput(new Date()),
      endDate: formatDateForInput(new Date()),
      startTime: `${DefaultStartHour}:00`,
      endTime: `${DefaultEndHour}:00`,
      allDay: false,
      location: "",
      color: "#3b82f6",
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
  const startDateString = watch("startDate");

  useEffect(() => {
    if (event) {
      const start = new Date(event.start);
      const end = new Date(event.end);

      reset({
        title: event.title || "",
        description: event.description || "",
        startDate: formatDateForInput(start),
        endDate: formatDateForInput(end),
        startTime: formatTimeForInput(start),
        endTime: formatTimeForInput(end),
        allDay: event.allDay ?? false,
        location: event.location || "",
        color: event.color || "#3b82f6",
      });
    } else {
      reset({
        title: "",
        description: "",
        startDate: formatDateForInput(new Date()),
        endDate: formatDateForInput(new Date()),
        startTime: `${DefaultStartHour}:00`,
        endTime: `${DefaultEndHour}:00`,
        allDay: false,
        location: "",
        color: "#3b82f6",
      });
    }
  }, [event, reset]);

  const handleSave = (data: FormData) => {

    const start = parseDateFromInput(data.startDate);
    const end = parseDateFromInput(data.endDate);

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
      color: data.color || "#3b82f6",
    };
    onSave(calendarEvent);
  };

  const handleDelete = () => {
    if (event?.id) {
      onDelete(event.id);
    }
  };

  return (
    <CotinModal
      id="event-dialog"
      title={event?.id ? "Editar Evento" : "Criar Evento"}
      open={isOpen}
      onClose={onClose}
      variant="default"
      size="default"
      showCancelButton={false}
      showAcceptButton={false}
      cancelButton={
        <CotinButton variant="default" id="cancel-event" onClick={onClose}>
          Cancelar
        </CotinButton>
      }
      acceptButton={
        <CotinButton
          variant="primary"
          id="save-event"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(
              (data) => {
                handleSave(data);
              },
            )();
          }}
        >
          Salvar
        </CotinButton>
      }
      content={
        <form
          className="flex flex-col gap-4 min-w-0 max-w-full overflow-x-hidden overflow-y-auto px-2"
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
          <CotinText
            id="event-description"
            children={event?.id ?
              "Editar o detalhes deste evento" :
              "Adicionar um novo evento ao seu calendário"}
          />

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

            <div className="grid grid-cols-3 gap-2">
              <div className={allDay ? "col-span-3" : "col-span-2"}>
                <InputController name="startDate" control={control}>
                  <CotinDatePicker
                    id="start-date"
                    label="Data de Início"
                    errorMessage={errors.startDate?.message}
                    minDate={null}
                    maxDate={null}
                    onDateSelect={(dateStruct) => {
                      const newStartDate = new Date(dateStruct.year, dateStruct.month - 1, dateStruct.day);
                      const currentEndDateString = watch("endDate");
                      if (currentEndDateString) {
                        const endDateObj = parseDateFromInput(currentEndDateString);
                        if (isBefore(endDateObj, newStartDate)) {
                          setValue("endDate", formatDateForInput(newStartDate));
                        }
                      }
                    }}
                  />
                </InputController>
              </div>
              {!allDay && (
                <div className="col-span-1">
                  <InputController name="startTime" control={control}>
                    <CotinTimePicker
                      id="start-time"
                      label="Hora de Início"
                      errorMessage={errors.startTime?.message}
                    />
                  </InputController>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">

              <div className={allDay ? "col-span-3" : "col-span-2"}>
                <InputController name="endDate" control={control}>
                  <CotinDatePicker
                    id="end-date"
                    label="Data de Término"
                    errorMessage={errors.endDate?.message}
                    minDate={startDateString ? modelToDateStruct(startDateString) : null}
                    maxDate={null}
                  />
                </InputController>
              </div>

              {!allDay && (
                <div className="col-span-1">
                  <InputController name="endTime" control={control}>
                    <CotinTimePicker
                      id="end-time"
                      label="Hora de Término"
                      errorMessage={errors.endTime?.message}
                    />
                  </InputController>
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
                Etiqueta
              </legend>
              <div>
                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => {
                    return (
                      <>
                        <input
                          type="color"
                          id="event-color"
                          value={field.value || "#3b82f6"}
                          onChange={(e) => {
                            const newColor = e.target.value;
                            field.onChange(newColor);
                          }}
                          className="p-1 h-10 w-14 block bg-background border border-input cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
                          title="Escolha a cor do evento"
                        />
                      </>
                    );
                  }}
                />
                {errors.color && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.color.message}
                  </p>
                )}
              </div>
            </fieldset>
          </div>

          {event?.id && (
            <div className="mt-4">
              <CotinButton
                id="delete-event"
                variant="icon"
                size="default"
                onClick={handleDelete}
              >
                <DeleteIcon sx={{ color: "red" }} />
              </CotinButton>
            </div>
          )}
        </form>
      }
    />
  );
}