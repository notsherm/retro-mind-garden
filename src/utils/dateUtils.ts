import { format, startOfDay } from 'date-fns';

export const formatEntryDate = (date: Date): string => {
  return format(startOfDay(date), 'yyyy-MM-dd');
};

export const formatDisplayDate = (date: Date): string => {
  return format(date, 'MM/dd/yyyy');
};

export const getEntryTimestamp = (date: Date = new Date()): number => {
  return startOfDay(date).getTime();
};