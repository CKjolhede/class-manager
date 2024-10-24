import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function AddStudentToCourse({ courseAssignments, courseId }) {
    const [student, setStudent] = useState('');
    const [students, setStudents] = useState([]);

    const navigate = useNavigate();
    //const history = useHistory();

    useEffect(() => {
        const fetchStudents = async () => {
        try {
            const response = await fetch('/students'); // Replace with your API endpoint
            if (response.ok) {
            const data = await response.json();
            setStudents(data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        };

        fetchStudents();
    }, []);

    const handleStudentChange = (event) => {
        setStudent(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
        const response = await fetch(`/courses/${courseId}/students`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ student_id: student }),
        });

        if (response.ok) {
            const newStudent = await response.json();
            const newStudentAssignments = courseAssignments.map((assignment) => ({
            student_id: newStudent.id,
            assignment_id: assignment.id,
            points_earned: 0,
            }));

            const createStudentAssignments = async () => {
            for (const assignment of newStudentAssignments) {
                await fetch('/student_assignments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(assignment),
                });
            }
            };

            await createStudentAssignments();
            navigate(`/course/${courseId}`);
        } else {
            console.error('Failed to add student to course');
        }
        } catch (error) {
        console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <label>
            Select Student:
            <select value={student} onChange={handleStudentChange}>
            <option value="">Select a student</option>
            {students.map((student) => (
                <option key={student.id} value={student.id}>
                {student.first_name} {student.last_name}
                </option>
            ))}
            </select>
        </label>
        <button type="submit">Add Student</button>
        </form>
    );
}