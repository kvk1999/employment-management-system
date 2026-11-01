const Employee = require("../models/Employee");

const normalizeEmployeePayload = (body) => {
    const payload = { ...body };
    const joiningDate =
        payload.dateofJoining ?? payload.joiningDate ?? payload.JoiningDate;

    if (joiningDate !== undefined) payload.dateofJoining = joiningDate;
    delete payload.joiningDate;
    delete payload.JoiningDate;
    return payload;
};

const serializeEmployee = (employee) => {
    const employeeData = employee.toObject();

    return {
        ...employeeData,
        joiningDate:
            employeeData.dateofJoining ??
            employeeData.joiningDate ??
            employeeData.JoiningDate ??
            null,
    };
};

// CREATE EMPLOYEE
exports.createEmployee = async (req, res) => {
    try {
        const employee = await Employee.create(
            normalizeEmployeePayload(req.body)
        );
        
        res.status(201).json({
            message: "Employee added successfully",
            employee: serializeEmployee(employee),
        });
        } catch (error) {
            if  (error.code === 11000) {
                return res.status(409).json({
                    message: "Email address already exists",
                });
                }
                if (error.name === "ValidationError") {
                    return res.status(400).json({
                        message: error.message,
                    });
            }
            res.status(500).json({ message: error.message });
    }
};


// GET EMPLOYEES WITH SEARCH, FILTER, SORT AND PAGINATION
exports.getEmployees = async (req, res) => {
    try {
        const { 
            search = "",
            department = "",
            sortBy = "joiningDate",
            order = "desc",
            page = 1,
            limit = 10,
        } = req.query;

        const currentPage = Math.max(1, parseInt(page, 10) || 1);
        const pageLimit = Math.min(
            100, 
            Math.max(1, parseInt(limit, 10) || 10)
        );

        const filter = {};
        if (department) {
            filter.department = department;
        }
        if (search) {
            const searchRegex = new RegExp(search, "i");
            filter.$or = [
                { name: searchRegex },
                { email: searchRegex },
            ];
        }

        const allowedSortFields = ["joiningDate", "name", "email", "department"];
        const requestedSortField = allowedSortFields.includes(sortBy)
            ? sortBy
            : "joiningDate";
        const sortField = requestedSortField === "joiningDate"
            ? "dateofJoining"
            : requestedSortField;
        const sortOrder = order.toLowerCase() === "asc" ? 1 : -1;
        const skip = (currentPage - 1) * pageLimit;

        const [employees, totalEmployees] = await Promise.all([
            Employee.find(filter)
                .sort({ [sortField]: sortOrder })
                .skip(skip)
                .limit(pageLimit),
            Employee.countDocuments(filter),
        ]);

        res.status(200).json({
            employees: employees.map(serializeEmployee),
            pagination: {
                currentPage,
                totalPages: Math.ceil(totalEmployees / pageLimit),
                totalEmployees,
                pageLimit,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SINGLE EMPLOYEE
exports.getEmployeeById = async (req, res) => {
    try {
            const employee = await Employee.findById(req.params.id);

            if (!employee) {
                return res.status(404).json({
                    message: "Employee not found",
                });
            }

            res.status(200).json(serializeEmployee(employee));
        } catch (error) {
            res.status(400).json({ message: "Invalid Employee ID" });
        }
    };

// UPDATE EMPLOYEE
exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            normalizeEmployeePayload(req.body),
            { 
                new: true, 
                runValidators: true,
            }
        );

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found",
            });
        }

        res.status(200).json({
            message: "Employee updated successfully",
            employee: serializeEmployee(employee),
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message,
            });
        }
        res.status(500).json({ message: error.message });
    }
};

// DELETE EMPLOYEE
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found",
            });
        }

        res.status(200).json({
            message: "Employee deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
