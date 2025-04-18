import { createContext, useContext, useState, ReactNode } from 'react';
import { Appointment } from '@/components/schedule/types';

interface ScheduleContextType {
  selectedScheduleType: string;
  setSelectedScheduleType: (type: string) => void;
  dates: Date[];
  addBulkAppointments: (appointments: Omit<Appointment, 'id'>[]) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [selectedScheduleType, setSelectedScheduleType] = useState('all');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Generate dates for the next 30 days
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const addBulkAppointments = (newAppointments: Omit<Appointment, 'id'>[]) => {
    const appointmentsWithIds = newAppointments.map(apt => ({
      ...apt,
      id: Math.random().toString(36).substr(2, 9)
    }));
    setAppointments(prev => [...prev, ...appointmentsWithIds]);
  };

  return (
    <ScheduleContext.Provider value={{ 
      selectedScheduleType, 
      setSelectedScheduleType, 
      dates,
      addBulkAppointments 
    }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useScheduleContext must be used within a ScheduleProvider');
  }
  return context;
};