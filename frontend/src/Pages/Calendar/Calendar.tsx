import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CalendarDays, FileText } from "lucide-react";
import useCases, { type CalendarCase } from "../../hooks/useCases";

const DAYS_HEADER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

const Calendar = () => {
  const navigate = useNavigate();
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

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
    setSelectedDay(null);
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNext = () => {
    setSelectedDay(null);
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
  const selectedCases = selectedDay != null ? casesByDay.get(selectedDay) ?? [] : [];

  return (
    <div className="min-h-screen bg-[#fbfeff] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-100 bg-white px-6 py-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-[#2B89D2] p-2.5">
            <CalendarDays className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        </div>
        <p className="text-sm text-gray-500">View and navigate case due dates by month</p>
      </div>

      {/* Main: calendar + side panel */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 min-h-0">
        {/* Calendar card - takes remaining space */}
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">{monthLabel}</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewYear(now.getFullYear());
                  setViewMonth(now.getMonth() + 1);
                  setSelectedDay(null);
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Today
              </button>
              <button
                type="button"
                onClick={goNext}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {DAYS_HEADER.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grid: use min height so cells are large on big screens */}
            <div className="grid grid-cols-7 gap-2 auto-rows-fr" style={{ minHeight: "calc(100vh - 320px)" }}>
              {grid.map((cell, index) => (
                <div
                  key={index}
                  className="min-h-[80px] lg:min-h-[100px] flex flex-col border border-gray-100 rounded-xl overflow-hidden bg-gray-50/50"
                >
                  {cell.day != null ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedDay(cell.day!)}
                        className={`flex-shrink-0 w-9 h-9 mt-1.5 ml-1.5 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                          daysWithDueDates.has(cell.day)
                            ? "bg-[#2B89D2] text-white shadow-md hover:bg-[#2369a8]"
                            : isCurrentMonth && cell.day === today
                              ? "ring-2 ring-[#2B89D2] ring-inset text-gray-800 bg-white"
                              : "text-gray-700 hover:bg-white"
                        } ${selectedDay === cell.day ? "ring-2 ring-offset-2 ring-[#2B89D2]" : ""}`}
                      >
                        {cell.day}
                      </button>
                      {daysWithDueDates.has(cell.day) && (
                        <div className="flex-1 px-2 pb-2 overflow-hidden">
                          <p className="text-[10px] font-medium text-[#2B89D2]">
                            {casesByDay.get(cell.day)!.length} case{casesByDay.get(cell.day)!.length !== 1 ? "s" : ""} due
                          </p>
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              ))}
            </div>

            {isLoading && (
              <p className="text-sm text-gray-500 mt-4 text-center">Loading…</p>
            )}
          </div>
        </div>

        {/* Right panel: cases for selected day */}
        <div className="w-full lg:w-96 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-800">
              {selectedDay != null
                ? `${MONTH_NAMES[viewMonth - 1]} ${selectedDay}, ${viewYear}`
                : "Select a day"}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {selectedDay != null
                ? `${selectedCases.length} case(s) due`
                : "Click a date to see cases due"}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {selectedDay == null ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <FileText className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-sm">Click a highlighted date to view cases</p>
              </div>
            ) : selectedCases.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No cases due this day</p>
            ) : (
              <ul className="space-y-2">
                {selectedCases.map((c) => (
                  <li key={c.caseId}>
                    <button
                      type="button"
                      onClick={() => navigate(`/cases/${c.caseId}`)}
                      className="w-full text-left rounded-xl border border-gray-100 p-4 hover:border-[#2B89D2] hover:bg-[#f0f7ff] transition-colors"
                    >
                      <p className="font-medium text-gray-900 truncate">{c.patientName || "—"}</p>
                      <p className="text-xs text-gray-500 mt-0.5">ID: {c.caseId}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                          {c.status === "QC" ? "QC Review" : c.status}
                        </span>
                        {c.caseType && (
                          <span className="text-xs text-gray-500 truncate">{c.caseType}</span>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
