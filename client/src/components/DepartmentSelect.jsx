import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import departments from "../constants/departments";

export default function DepartmentSelect({
  value,
  onChange,
  includeAll = false,
  ariaLabel = "Department",
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef(null);
  const optionsId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!filterRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectedLabel = value || (includeAll ? "All Departments" : departments[0]);

  return (
    <div ref={filterRef} className="relative min-w-0">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-required={required}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={optionsId}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          id={optionsId}
          role="listbox"
          aria-label="Departments"
          className="department-filter-options absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
        >
          {includeAll && (
            <button
              type="button"
              role="option"
              aria-selected={value === ""}
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-blue-50 ${
                value === "" ? "bg-blue-50 text-blue-700" : "text-slate-700"
              }`}
            >
              All Departments
            </button>
          )}
          {departments.map((department) => (
            <button
              key={department}
              type="button"
              role="option"
              aria-selected={value === department}
              onClick={() => {
                onChange(department);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-blue-50 ${
                value === department
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700"
              }`}
            >
              {department}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
