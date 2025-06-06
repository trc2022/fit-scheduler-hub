export interface ClassType {
  schedule_type_id: number;
  name: string;
  duration: number;
  created_at?: string;
  operational_days?: string[];
  opening_time?: string;
  closing_time?: string;
}

export interface CreateClassTypeData {
  name: string;
  duration: number;
  operational_days?: string[];
  opening_time?: string;
  closing_time?: string;
}

export interface UpdateClassTypeData {
  name?: string;
  duration?: number;
  operational_days?: string[];
  opening_time?: string;
  closing_time?: string;
}

export interface TimeSlot {
  slot_id?: number;
  schedule_type_id?: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
}