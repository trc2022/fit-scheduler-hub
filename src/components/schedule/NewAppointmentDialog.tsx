import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useClassTypes } from "@/hooks/schedule/useClassTypes";
import { useState } from "react";

interface NewAppointmentDialogProps {
  timeSlot: string;
  day: string;
  onAdd: (timeSlot: string, day: string) => void;
}

export const NewAppointmentDialog = ({
  timeSlot,
  day,
  onAdd,
}: NewAppointmentDialogProps) => {
  const { classTypes, isLoading } = useClassTypes();
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  const handleSubmit = () => {
    if (!selectedStaff || !selectedType) {
      // You might want to show an error message here
      return;
    }
    onAdd(timeSlot, day);
  };

  return (
    <DialogContent className="bg-[#171717] border-0">
      <DialogHeader>
        <DialogTitle className="text-fitness-text">Add New Schedule</DialogTitle>
        <DialogDescription className="text-fitness-text/70">
          Create a new schedule for {day} at {timeSlot}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 pt-4">
        <div>
          <label className="text-sm font-medium text-fitness-text">Staff Name</label>
          <Select onValueChange={setSelectedStaff} value={selectedStaff}>
            <SelectTrigger className="bg-[#333333] border-[#d1d1d1] text-fitness-text">
              <SelectValue placeholder="Select staff" />
            </SelectTrigger>
            <SelectContent className="bg-[#333333] border-[#d1d1d1]">
              <SelectItem value="Heath Graham" className="text-fitness-text hover:text-[#333333] hover:bg-[#15e7fb]">Heath Graham</SelectItem>
              <SelectItem value="John Doe" className="text-fitness-text hover:text-[#333333] hover:bg-[#15e7fb]">John Doe</SelectItem>
              <SelectItem value="Jane Smith" className="text-fitness-text hover:text-[#333333] hover:bg-[#15e7fb]">Jane Smith</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-fitness-text">Schedule Type</label>
          <Select onValueChange={setSelectedType} value={selectedType}>
            <SelectTrigger className="bg-[#333333] border-[#d1d1d1] text-fitness-text">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-[#333333] border-[#d1d1d1]">
              {isLoading ? (
                <SelectItem value="loading" className="text-fitness-text">Loading...</SelectItem>
              ) : (
                classTypes?.map((type) => (
                  <SelectItem 
                    key={type.class_type_id} 
                    value={type.name}
                    className="text-fitness-text hover:text-[#333333] hover:bg-[#15e7fb]"
                  >
                    {type.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={handleSubmit}
          className="bg-[#15e7fb] text-[#1A1F2C] hover:bg-[#15e7fb]/80"
          disabled={!selectedStaff || !selectedType}
        >
          Add to Schedule
        </Button>
      </div>
    </DialogContent>
  );
};