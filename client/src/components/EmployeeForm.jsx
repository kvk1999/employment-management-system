import { useState } from "react";
import { X } from "lucide-react";

const initialForm = {
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    joiningDate: "",
    salary: "",
    status: "Active",
};

const departments = [
    "IT",
    "HR",
    "Finance",
    "Marketing",
    "Sales",
    "Operations",
    "Customer Support",
    "Research and Development",
    "Administration",
    "Procurement",
    "Logistics",
    "Quality Assurance",
];

const getFormState = (employee) => {
    if (!employee) return initialForm;

    const joiningDate =
      employee.dateofJoining || employee.joiningDate || employee.JoiningDate;

    return {
      ...initialForm,
      ...employee,
      joiningDate: joiningDate
        ? new Date(joiningDate).toISOString().slice(0, 10)
        : "",
      status: employee.status || "Active",
      salary: employee.salary ?? "",
    };
};

export default function EmployeeForm({
    employee,
    onClose,
    onSubmit,
}) {
    const [form, setForm] = useState(() => getFormState(employee));
    const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await onSubmit({
        ...form,
        salary: Number(form.salary),
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save employee"
      );
    }
  };

  const fieldClass =
    "w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {employee ? "Edit Employee" : "Add New Employee"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter employee information below.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Full Name *
              </label>
              <input
                className={fieldClass}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                maxLength={100}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Email Address *
              </label>
              <input
                className={fieldClass}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Phone Number *
              </label>
              <input
                className={fieldClass}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
                required
                maxLength={20}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Department *
              </label>
              <select
                className={fieldClass}
                name="department"
                value={form.department}
                onChange={handleChange}
              >
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Designation *
              </label>
              <input
                className={fieldClass}
                name="designation"
                value={form.designation}
                onChange={handleChange}
                placeholder="Software Developer"
                required
                maxLength={100}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Joining Date *
              </label>
              <input
                className={fieldClass}
                type="date"
                name="joiningDate"
                value={form.joiningDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Salary *
              </label>
              <input
                className={fieldClass}
                type="number"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="Enter salary"
                min="0"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Employment Status
              </label>
              <select
                className={fieldClass}
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              {employee ? "Update Employee" : "Save Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}