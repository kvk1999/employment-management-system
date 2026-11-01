
import { useCallback, useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Building2,
  BriefcaseBusiness,
  RefreshCw,
} from "lucide-react";

import API from "./api";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeTable from "./components/EmployeeTable";
import ConfirmDialog from "./components/ConfirmDialog";
import Pagination from "./components/Pagination";

const departments = [
  "IT",
  "HR",
  "Finance",
  "Marketing",
  "Sales",
  "Operations",
];

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [sortBy, setSortBy] = useState("joiningDate");
  const [order, setOrder] = useState("desc");

  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [notice, setNotice] = useState("");

  const fetchEmployees = useCallback(async () => {
    setLoading(true);

    try {
      const response = await API.get("/employees", {
        params: {
          search,
          department,
          sortBy,
          order,
          page,
          limit: 10,
        },
      });

      setEmployees(response.data.employees);
      setTotalEmployees(response.data.pagination.totalEmployees);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      setNotice(
        error.response?.data?.message ||
          "Unable to fetch employees"
      );
    } finally {
      setLoading(false);
    }
  }, [search, department, sortBy, order, page]);

  useEffect(() => {
    let active = true;

    const loadEmployees = async () => {
      setLoading(true);

      try {
        const response = await API.get("/employees", {
          params: {
            search,
            department,
            sortBy,
            order,
            page,
            limit: 10,
          },
        });

        if (!active) return;

        setEmployees(response.data.employees);
        setTotalEmployees(response.data.pagination.totalEmployees);
        setTotalPages(response.data.pagination.totalPages);
      } catch (error) {
        if (!active) return;

        setNotice(
          error.response?.data?.message ||
            "Unable to fetch employees"
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadEmployees();

    return () => {
      active = false;
    };
  }, [search, department, sortBy, order, page]);

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  };

  const openAddForm = () => {
    setSelectedEmployee(null);
    setFormOpen(true);
  };

  const openEditForm = (employee) => {
    setSelectedEmployee(employee);
    setFormOpen(true);
  };

  const saveEmployee = async (formData) => {
    if (selectedEmployee) {
      await API.put(
        `/employees/${selectedEmployee._id}`,
        formData
      );

      showNotice("Employee updated successfully");
    } else {
      await API.post("/employees", formData);

      showNotice("Employee added successfully");
      setPage(1);
    }

    setFormOpen(false);
    setSelectedEmployee(null);

    // Refresh immediately after a successful operation.
    await fetchEmployees();
  };

  const handleDelete = async () => {
    if (!deleteEmployee) return;

    try {
      await API.delete(`/employees/${deleteEmployee._id}`);

      setDeleteEmployee(null);
      showNotice("Employee deleted successfully");

      // If the last row on this page was deleted,
      // move to the previous page when necessary.
      if (employees.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await fetchEmployees();
      }
    } catch (error) {
      showNotice(
        error.response?.data?.message ||
          "Unable to delete employee"
      );
      setDeleteEmployee(null);
    }
  };

  const changeSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const changeDepartment = (value) => {
    setDepartment(value);
    setPage(1);
  };

  const changeSort = (value) => {
    setSortBy(value);
    setPage(1);
  };

  const changeOrder = (value) => {
    setOrder(value);
    setPage(1);
  };

  const statCards = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Departments",
      value: departments.length,
      icon: Building2,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Records Per Page",
      value: 10,
      icon: BriefcaseBusiness,
      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar and main content */}
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-6 md:block">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <Users size={24} />
            </div>

            <div>
              <h1 className="font-bold text-slate-800">
                EmployeeHub
              </h1>
              <p className="text-xs text-slate-400">
                Management System
              </p>
            </div>
          </div>

          <div className="mt-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Main Menu
            </p>

            <div className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 font-medium text-blue-700">
              <Users size={19} />
              Employees
            </div>
          </div>

          <div className="mt-10 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">
              EmployeeHub
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Manage employee information in one place.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          {/* Header */}
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Employee Management
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage your organization's employees.
              </p>
            </div>

            <button
              onClick={openAddForm}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <UserPlus size={18} />
              Add Employee
            </button>
          </header>

          <div className="mx-auto max-w-7xl space-y-6 p-5 sm:p-8">
            {/* Notification */}
            {notice && (
              <div
                role="status"
                className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700"
              >
                {notice}
              </div>
            )}

            {/* Statistics */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {statCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">
                          {card.title}
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-slate-800">
                          {card.value}
                        </h3>
                      </div>

                      <div className={`rounded-xl p-3 ${card.color}`}>
                        <Icon size={23} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Employee directory */}
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      Employee Directory
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      View and manage all employee records.
                    </p>
                  </div>

                  <button
                    onClick={fetchEmployees}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
                  >
                    <RefreshCw
                      size={15}
                      className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                  </button>
                </div>

                {/* Search and filters */}
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div className="relative xl:col-span-1">
                    <Search
                      size={18}
                      className="absolute left-3 top-3 text-slate-400"
                    />

                    <input
                      value={search}
                      onChange={(e) => changeSearch(e.target.value)}
                      placeholder="Search name or email..."
                      className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <select
                    value={department}
                    onChange={(e) =>
                      changeDepartment(e.target.value)
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">All Departments</option>
                    {departments.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => changeSort(e.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="joiningDate">
                      Sort by Joining Date
                    </option>
                  </select>

                  <select
                    value={order}
                    onChange={(e) => changeOrder(e.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>

              <EmployeeTable
                employees={employees}
                onEdit={openEditForm}
                onDelete={setDeleteEmployee}
                loading={loading}
              />

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3">
                <p className="text-xs text-slate-500">
                  Showing {employees.length} of {totalEmployees} employees
                </p>
                <p className="text-xs text-slate-500">
                  10 records per page
                </p>
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </section>
          </div>
        </main>
      </div>

      {/* Add/Edit modal */}
      {formOpen && (
        <EmployeeForm
          employee={selectedEmployee}
          onClose={() => {
            setFormOpen(false);
            setSelectedEmployee(null);
          }}
          onSubmit={saveEmployee}
        />
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        employee={deleteEmployee}
        onCancel={() => setDeleteEmployee(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
