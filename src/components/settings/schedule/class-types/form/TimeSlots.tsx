import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Plus, X } from "lucide-react";
import { TimeSlot } from "@/types/schedule/class-types";

interface TimeSlotsProps {
  timeSlots: TimeSlot[];
  operationalDays: string[];
  onAddSlot: (day: string) => void;
  onRemoveSlot: (index: number) => void;
  onUpdateSlot: (index: number, field: keyof TimeSlot, value: string) => void;
}

const TimeSlots = ({ 
  timeSlots, 
  operationalDays,
  onAddSlot, 
  onRemoveSlot, 
  onUpdateSlot 
}: TimeSlotsProps) => {
  const dayOrder = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
  
  // Sort operational days according to the defined order
  const sortedOperationalDays = [...operationalDays].sort(
    (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)
  );

  // Group time slots by day
  const groupedSlots = sortedOperationalDays.reduce((acc, day) => {
    acc[day] = timeSlots.filter(slot => slot.day_of_week === day);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const handleCopyToAll = (sourceDay: string) => {
    const sourceDaySlots = groupedSlots[sourceDay];
    if (!sourceDaySlots?.length) return;

    // Only copy to days that are checked in operationalDays
    sortedOperationalDays.forEach(targetDay => {
      // Skip if it's the source day or if the day isn't in operationalDays
      if (targetDay === sourceDay || !operationalDays.includes(targetDay)) return;

      // Copy each slot from the source day to the target day
      sourceDaySlots.forEach(sourceSlot => {
        onAddSlot(targetDay);
        const newSlotIndex = timeSlots.length;
        onUpdateSlot(newSlotIndex, 'day_of_week', targetDay);
        onUpdateSlot(newSlotIndex, 'start_time', sourceSlot.start_time);
        onUpdateSlot(newSlotIndex, 'end_time', sourceSlot.end_time);
      });
    });
  };

  return (
    <div>
      <Label className="text-fitness-text mb-2 block">Time Slots</Label>
      <div className="space-y-6">
        {sortedOperationalDays.map((day, dayIndex) => (
          <div key={day} className="bg-fitness-inner p-4 rounded-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h4 className="text-fitness-text font-medium">{day}</h4>
                {dayIndex === 0 && groupedSlots[day]?.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleCopyToAll(day)}
                    className="text-[#868686] hover:text-[#868686]/80 hover:bg-transparent"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy to All
                  </Button>
                )}
              </div>
              <Button
                type="button"
                onClick={() => onAddSlot(day)}
                className="bg-[#15e7fb] hover:bg-[#15e7fb]/80"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Time Slot
              </Button>
            </div>
            
            <div className="space-y-4">
              {groupedSlots[day]?.map((slot, index) => {
                const globalIndex = timeSlots.findIndex(
                  s => s === slot
                );
                return (
                  <div key={`${day}-${index}`} className="flex items-center gap-4 bg-fitness-card p-4 rounded-md">
                    <Input
                      type="time"
                      value={slot.start_time}
                      onChange={(e) => onUpdateSlot(globalIndex, 'start_time', e.target.value)}
                      className="bg-fitness-muted text-fitness-text"
                    />
                    
                    <Input
                      type="time"
                      value={slot.end_time}
                      onChange={(e) => onUpdateSlot(globalIndex, 'end_time', e.target.value)}
                      className="bg-fitness-muted text-fitness-text"
                    />
                    
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onRemoveSlot(globalIndex)}
                      className="text-fitness-danger hover:text-fitness-danger/80"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSlots;