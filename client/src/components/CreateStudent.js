import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateStudent() {
    const [error, setError] = useState(null);
    const [student, setStudent] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password_hash: 'password',
        //enrolledCourses: [],
    });
    console.log('student', student);

    const navigate = useNavigate();


    //const createStudentAssignments = async (newStudent) => {
    //    console.log("newStudent", newStudent)
    //    console.log("student.enrolledCourses", student.enrolledCourses)
    //    console.log("student", student)
    //    for (const courseId of student.enrolledCourses) {
    //        const courseAssignments = allCourses.find(
    //            (course) => course.id === courseId
    //        ).assignments;
    //        console.log("courseAssignments", courseAssignments);
    //        const newStudentAssignments = courseAssignments.map(
    //            (assignment) => ({
    //                student_id: newStudent.id,
    //                assignment_id: assignment.id,
    //                points_earned: 0,
    //            })
    //        );

    //        for (const assignment of newStudentAssignments) {
    //            await fetch("/student_assignments", {
    //                method: "POST",
    //                headers: {
    //                    "Content-Type": "application/json",
    //                },
    //                body: JSON.stringify(assignment),
    //            });
    //        }
    //    }
    //};
    

    const handleInputChange = (event) => {
        setStudent({ ...student, [event.target.name]: event.target.value });
    };

    //const handleCourseChange = (event) => {
    //    const selectedCourseId = parseInt(event.target.value);
    //    console.log("selectedCourseId", selectedCourseId);
    //    const updatedEnrolledCourses = student.enrolledCourses.includes(selectedCourseId)
    //    ? student.enrolledCourses.filter((id) => id !== selectedCourseId)
    //    : [...student.enrolledCourses, selectedCourseId] : [selectedCourseId];

    //    setStudent({ ...student, enrolledCourses: updatedEnrolledCourses });
    //};

  
    
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('student', student);
        try {
        const response = await fetch('/students', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: student.email,
                first_name: student.first_name,
                last_name: student.last_name,
                password_hash: student.password_hash
            })
            });
            if (response.ok) {
                const newStudent = await response.json();
                setStudent(newStudent)
            //await createStudentAssignments(newStudent);
                navigate(`/addstudenttocourse/${newStudent.id}`);
            } else {
                const errorMessage = await response.text();
                console.error('Failed to create student', errorMessage);
                if (response.status === 409) {
                    setError('The email address is already in use');
                } else {
                    setError('An error occurred while creating the student');
                }
                setError('An error occurred while creating the student');
        }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while creating the student')
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div class="error">{error}</div>}
        <label>
            First Name:
            <input type="text" name="first_name" value={student.first_name} onChange={handleInputChange} />
        </label>
        <label>
            Last Name:
            <input type="text" name="last_name" value={student.last_name} onChange={handleInputChange} />
        </label>
        <label>
            Email:
            <input type="email" name="email" value={student.email} onChange={handleInputChange} />
            </label>
            <label>
                Password:
                <input type="password" name="password_hash" value={student.password_hash} onChange={handleInputChange} />
            </label>
       
        <button type="submit">Create Student</button>
        </form>
    );
}