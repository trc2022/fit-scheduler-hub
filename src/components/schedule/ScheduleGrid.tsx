import { TimeSlotRow } from "./TimeSlotRow";
import { DayHeader } from "./DayHeader";
import { useAppointments } from "@/hooks/useAppointments";
import { days } from "./constants";
import { useTimeSlots } from "@/hooks/schedule/useTimeSlots";

const ScheduleGrid = () => {
  const {
    appointments,
    copiedAppointment,
    handleDrop,
    handleDelete,
    handleAdd,
    handleDragStart,
    handleCopy,
    handleUpdate,
  } = useAppointments();

  const { timeSlots } = useTimeSlots();

  return (
    <div className="bg-fitness-grid rounded-lg p-4">
      <div className="grid grid-cols-8 gap-4 mb-4">
        <div className="text-fitness-text font-medium p-2 min-w-[150px]">Time Slots</div>
        {days.map((day, index) => (
          <DayHeader key={day} day={day} index={index} />
        ))}
      </div>

      <div className="space-y-2">
        {timeSlots.map((timeSlot) => (
          <TimeSlotRow
            key={timeSlot}
            timeSlot={timeSlot}
            days={days}
            appointments={appointments}
            onDrop={handleDrop}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onDragStart={handleDragStart}
            onCopy={handleCopy}
            onUpdate={handleUpdate}
            copiedAppointment={copiedAppointment}
          />
        ))}
      </div>
    </div>
  );
};

export default ScheduleGrid;