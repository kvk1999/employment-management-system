
import { Pencil, Trash2, Users } from "lucide-react";

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
  loading,
}) {
  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatSalary = (salary) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(salary);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500">
        Loading employees...
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="p-12 text-center">
        <Users className="mx-auto mb-3 text-slate-300" size={40} />
        <h3 className="font-semibold text-slate-700">
          No employees found
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Add an employee or change your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-237.5 text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-5 py-4">Employee</th>
            <th className="px-5 py-4">Department</th>
            <th className="px-5 py-4">Designation</th>
            <th className="px-5 py-4">Joining Date</th>
            <th className="px-5 py-4">Salary</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {employees.map((employee) => (
            <tr
              key={employee._id}
              className="hover:bg-slate-50/70"
            >
              <td className="px-5 py-4">
                <div className="font-semibold text-slate-800">
                  {employee.name}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {employee.email}
                </div>
              </td>

              <td className="px-5 py-4">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {employee.department}
                </span>
              </td>

              <td className="px-5 py-4 text-slate-600">
                {employee.designation}
              </td>

              <td className="px-5 py-4 text-slate-600">
                {formatDate(
                  employee.dateofJoining ??
                    employee.joiningDate ??
                    employee.JoiningDate
                )}
              </td>

              <td className="px-5 py-4 font-medium">
                {formatSalary(employee.salary)}
              </td>

              <td className="px-5 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    employee.status === "Active"
                      ? "bg-green-50 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {employee.status}
                </span>
              </td>

              <td className="px-5 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(employee)}
                    title="Edit employee"
                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    onClick={() => onDelete(employee)}
                    title="Delete employee"
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
