const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Employee name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        department: {
            type: String,
            required: true,
            enum: [
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
            ],
        },
        designation: {
            type: String,
            required: true,
            trim: true,
        },
        dateofJoining: {
            type: Date,
            required: true,
        },
        salary: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model("Employee", employeeSchema);