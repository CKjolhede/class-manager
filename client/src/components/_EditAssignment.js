/* simpler form for editing an assignment */

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditAssignment({ assignment, handleAssignmentUpdate }) {
    const [formData, setFormData] = useState({
        name: assignment.name,
        description: assignment.description,
        points_possible: assignment.points_possible,
    });
    const [errors, setErrors] = useState({});
    const { courseId } = useParams();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) {
        newErrors.name = "Name is required";
        }
        if (!formData.description) {
        newErrors.description = "Description is required";
        }
        if (!formData.points_possible) {
        newErrors.points_possible = "Points possible is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
        try {
            const response = await fetch(`/assignment/${assignment.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            });
            if (response.ok) {
            const updatedAssignment = await response.json();
            handleAssignmentUpdate(updatedAssignment);
            navigate(`/course/${courseId}/assignment/${updatedAssignment.id}`);
            } else {
            const errorResponse = await response.json();
            setErrors(errorResponse.errors);
            }
        } catch (error) {
            setErrors({ general: error.message });
        }
        }
    };

    return (
        <div className="edit-assignment">
        <h1>Edit Assignment</h1>
        <form onSubmit={handleSubmit}>
            {['name', 'description'].map((field) => (
            <div key={field}>
                <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                id={field}
                name={field}
                type="text"
                value={formData[field]}
                onChange={handleChange}
                />
                {errors[field] && <div>{errors[field]}</div>}
            </div>
            ))}
            <div>
            <label htmlFor="points_possible">Points Possible</label>
            <input
                id="points_possible"
                name="points_possible"
                type="number"
                value={formData.points_possible}
                onChange={handleChange}
            />
            {errors.points_possible && <div>{errors.points_possible}</div>}
            </div>
            <button type="submit">Submit</button>
        </form>
        {errors.general && <div>{errors.general}</div>}
        </div>
    );
}