
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-3 border-t px-5 py-4">
      <p className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border p-2 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
        >
          <ChevronLeft size={18} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((number) =>
            Math.abs(number - page) <= 1 ||
            number === 1 ||
            number === totalPages
          )
          .map((number, index, visible) => (
            <span key={number} className="flex items-center gap-2">
              {index > 0 && visible[index - 1] !== number - 1 && (
                <span className="text-slate-400">...</span>
              )}

              <button
                onClick={() => onPageChange(number)}
                className={`h-9 min-w-9 rounded-lg px-3 text-sm ${
                  page === number
                    ? "bg-blue-600 text-white"
                    : "border hover:bg-slate-50"
                }`}
              >
                {number}
              </button>
            </span>
          ))}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border p-2 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
