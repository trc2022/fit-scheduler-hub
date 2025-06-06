export interface TimeSlot {
  "5": number;
  availabilityid?: number;
  dayofweek: string;
  starttime: string;
  endtime: string;
  ispreferred: boolean;
}

export interface TimeSlotInput {
  dayofweek: string;
  starttime: string;
  endtime: string;
  ispreferred: boolean;
}