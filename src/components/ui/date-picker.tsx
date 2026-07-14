'use client';

import { useState } from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatShortDate } from '@/lib/utils';
import calendarIcon from '@/assets/icons/calendar.svg';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function toISODate(year: number, month: number, day: number) {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

function parseISODate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return { year, month: month - 1, day };
}

interface DatePickerProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  className?: string;
}

export default function DatePicker({ id, value, onChange, min, className }: DatePickerProps) {
  const selected = parseISODate(value);
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(selected.year);
  const [viewMonth, setViewMonth] = useState(selected.month);

  const minValue = min ?? null;

  const firstOfMonth = new Date(Date.UTC(viewYear, viewMonth, 1));
  const daysInMonth = new Date(Date.UTC(viewYear, viewMonth + 1, 0)).getUTCDate();
  const startWeekday = firstOfMonth.getUTCDay();

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setViewYear(selected.year);
      setViewMonth(selected.month);
    }
  };

  const handleSelectDay = (day: number) => {
    const iso = toISODate(viewYear, viewMonth, day);
    if (minValue && iso < minValue) return;
    onChange(iso);
    setOpen(false);
  };

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            'flex items-center justify-between gap-md h-12 px-xl py-md rounded-xl border border-neutral-300 bg-neutral-100 w-full cursor-pointer',
            className,
          )}
        >
          <span className="text-md font-semibold text-neutral-950 tracking-t-2">
            {formatShortDate(value)}
          </span>
          <img src={calendarIcon} alt="" className="size-5 shrink-0" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={8}
          className="z-50 bg-white rounded-2xl shadow-card border border-neutral-200 p-lg w-70"
        >
          <div className="flex items-center justify-between w-full mb-md">
            <button
              type="button"
              onClick={goToPrevMonth}
              aria-label="Previous month"
              className="cursor-pointer size-8 flex items-center justify-center rounded-md hover:bg-neutral-100"
            >
              <ChevronLeft className="size-5 text-neutral-700" />
            </button>
            <span className="text-sm font-bold text-neutral-950 tracking-t-2">
              {new Date(Date.UTC(viewYear, viewMonth, 1)).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC',
              })}
            </span>
            <button
              type="button"
              onClick={goToNextMonth}
              aria-label="Next month"
              className="cursor-pointer size-8 flex items-center justify-center rounded-md hover:bg-neutral-100"
            >
              <ChevronRight className="size-5 text-neutral-700" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-xxs w-full">
            {WEEKDAYS.map((wd) => (
              <div key={wd} className="size-8 flex items-center justify-center text-xs font-semibold text-neutral-500">
                {wd}
              </div>
            ))}
            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} className="size-8" />;
              const iso = toISODate(viewYear, viewMonth, day);
              const isSelected = iso === value;
              const isDisabled = !!minValue && iso < minValue;
              return (
                <button
                  key={day}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSelectDay(day)}
                  className={cn(
                    'size-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer',
                    isSelected
                      ? 'bg-primary-300 text-white font-bold'
                      : isDisabled
                        ? 'text-neutral-300 cursor-not-allowed'
                        : 'text-neutral-950 hover:bg-neutral-100',
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
