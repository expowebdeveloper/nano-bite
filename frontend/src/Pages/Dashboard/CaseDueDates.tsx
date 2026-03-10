import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useCases, { type CalendarCase } from "../../hooks/useCases";

const DAYS_HEADER = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getCalendarGrid(year: number, month: number) {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const firstWeekday = first.getDay();
  const daysInMonth = last.getDate();
  const cells: { day: number | null }[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });
  return cells;
}

function parseDueDateDay(dueDate: string): number | null {
  if (!dueDate || typeof dueDate !== "string") return null;
  const part = dueDate.slice(0, 10).split("-");
  if (part.length < 3) return null;
  const d = parseInt(part[2], 10);
  return Number.isFinite(d) ? d : null;
}

const CaseDueDates = () => {
  const navigate = useNavigate();
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1);

  const { calendarCasesQuery } = useCases({
    calendarYear: viewYear,
    calendarMonth: viewMonth,
  });
  const calendarCases: CalendarCase[] = calendarCasesQuery.data ?? [];
  const isLoading = calendarCasesQuery.isLoading;

  const daysWithDueDates = useMemo(() => {
    const set = new Set<number>();
    calendarCases.forEach((c) => {
      const day = parseDueDateDay(c.dueDate);
      if (day != null) set.add(day);
    });
    return set;
  }, [calendarCases]);

  const casesByDay = useMemo(() => {
    const map = new Map<number, CalendarCase[]>();
    calendarCases.forEach((c) => {
      const day = parseDueDateDay(c.dueDate);
      if (day != null) {
        const list = map.get(day) ?? [];
        list.push(c);
        map.set(day, list);
      }
    });
    return map;
  }, [calendarCases]);

  const grid = useMemo(
    () => getCalendarGrid(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const goPrev = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNext = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const monthLabel = `${MONTH_NAMES[viewMonth - 1]} ${viewYear}`;
  const today = now.getDate();
  const isCurrentMonth = now.getFullYear() === viewYear && now.getMonth() + 1 === viewMonth;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">Case Due Dates</h2>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-700">{monthLabel}</span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={goPrev}
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_HEADER.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.map((cell, index) => (
          <div
            key={index}
            className="aspect-square flex items-center justify-center min-h-[28px]"
          >
            {cell.day != null ? (
              <div className="relative group">
                <button
                  type="button"
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                    daysWithDueDates.has(cell.day)
                      ? "bg-[#2B89D2] text-white shadow-md shadow-blue-200 hover:bg-[#2369a8]"
                      : isCurrentMonth && cell.day === today
                        ? "ring-2 ring-[#2B89D2] ring-inset text-gray-800 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                  }`}
                  title={
                    casesByDay.get(cell.day)?.length
                      ? `${casesByDay.get(cell.day)!.length} case(s) due`
                      : undefined
                  }
                >
                  {cell.day}
                </button>
                {casesByDay.get(cell.day)?.length ? (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block z-10 w-48 max-h-32 overflow-y-auto rounded-lg bg-gray-900 text-white text-xs p-2 shadow-xl">
                    {casesByDay.get(cell.day)!.map((c) => (
                      <button
                        key={c.caseId}
                        type="button"
                        className="block w-full text-left py-1 px-2 rounded hover:bg-gray-700 truncate"
                        onClick={() => navigate(`/cases/${c.caseId}`)}
                      >
                        {c.patientName || c.caseId} · {c.status}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {isLoading && (
        <p className="text-xs text-gray-500 mt-2 text-center">Loading…</p>
      )}
      {!isLoading && daysWithDueDates.size > 0 && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          {daysWithDueDates.size} day(s) with due cases
        </p>
      )}
    </div>
  );
};

export default CaseDueDates;
