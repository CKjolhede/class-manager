//import React, { useState, useEffect } from 'react';
//import { useNavigate, useParams } from 'react-router-dom';


//export default function AddStudentToCourse() {
//    const [allstudents, setAllStudents] = useState([]);
//    const [enrolledCourses, setEnrolledCourses] = useState([1]);
//    const [allCourses, setAllCourses] = useState([]);
//    //const [courseAssignments, setCourseAssignments] = useState([]);
//    const { studentId } = useParams();
//    const navigate = useNavigate();

//    console.log("allCourses", allCourses);

//    useEffect(() => {
//        const fetchCourses = async () => {
//            const response = await fetch("/courses");
//            const data = await response.json();
//            setAllCourses(data);
//        };
        
//        const fetchStudents = async () => {
//            const response = await fetch(`/students/${studentId}`);
//            const data = await response.json();
//            setAllStudents(data);
//        };

//        fetchStudents();
//        fetchCourses();
//    }, [studentId]);
    
//        const handleCourseChange = (event) => {
//        const selectedCourseId = parseInt(event.target.value);
//        const updatedEnrolledCourses = enrolledCourses.includes(selectedCourseId) ? enrolledCourses.filter((id) => id !== selectedCourseId) : [...enrolledCourses, selectedCourseId];

//        setEnrolledCourses({...enrolledCourses,updatedEnrolledCourses });
//        };
    
//    const handleSubmit = async (event) => {
//        event.preventDefault();

//        try {
//            for (const courseId of enrolledCourses) {
//                console.log("courseId creating", courseId);
//                const response = await fetch(`/course/${courseId}/student/${studentId}`, {
//                    method: "POST",
//                    headers: {
//                        "Content-Type": "application/json",
//                    },
//                    body: JSON.stringify({
//                        student_id: studentId,
//                        course_id: courseId
//                    }),
//                });

//                if (response.ok) {
//                    const newEnrollment = await response.json();
//                    console.log("newEnrollment", newEnrollment);
//                    navigate(`/course/${courseId}`);
//                } else {
//                    console.error("Failed to add student to course");
//                }
//            }

//        } catch (error) {
//            console.error("Error:", error);
//        }
//    };
//    //const fetchStudentAssignments = async (courseId) => {
//    //                    const response = await fetch("/course/:courseId/studentassignments");
//    //                    if (response.ok) {
//    //                        const courseAssignments = await response.json();
//    //                        setCourseAssignments(courseAssignments);
//    //                    }
//    //                    ;
//    //                }
//    //            };
    

//    //const fetchCourseAssignments = async (courseId) => {
//    //    try {
//    //        const response = await fetch(`/course/${courseId}/assignments`);
//    //        if (response.ok) {
//    //            const assignments = await response.json();
//    //            setCourseAssignments(assignments);
//    //        }
//    //    } catch (error) {
//    //        console.error("Error:", error);
//    //    }
//    //};


//    return (
//        <form onSubmit={handleSubmit}>
//            <label>
//            SelectStudent:
//                <select value={studentId} type="number" name="student_id" value={studentId} readOnly/>
//            </label>
//            <label>
//            Enroll in Courses:
//            <select value={enrolledCourse} onChange={handleCourseChange}>
//                {allCourses.map((course) => (
//                    <option key={course.id} value={course.id}>
//                    {course.description}
//                    </option>
//                ))}
//            </select>
//        </label>
//            <button type="submit">Add Student</button>
//        </form>
//    );
//}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EnrollStudent() {
    const [allStudents, setAllStudents] = useState([]);
    const [enrolledCourse, setEnrolledCourse] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState(null);
    const [allCourses, setAllCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            const response = await fetch("/courses");
            const data = await response.json();
            setAllCourses(data);
        };

        const fetchStudents = async () => {
            const response = await fetch("/students");
            const data = await response.json();
            setAllStudents(data);
        };

        fetchStudents();
        fetchCourses();
    }, []);

    const handleStudentChange = (event) => {
        const selectedStudents = Array.from(event.target.selectedOptions, (option) => option.value);
        setSelectedStudents(selectedStudents);
    };

    const handleCourseChange = (event) => {
        const selectedCourseId = parseInt(event.target.value);
        setEnrolledCourse(selectedCourseId);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
                const response = await fetch(
                    `/course/${enrolledCourse}/students`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            student_ids: selectedStudents,
                        }),
                    }
                );
                if (response.ok) {
                    const newEnrollment = await response.json();
                    console.log("newEnrollment", newEnrollment);

                    // Fetch assignments for the enrolled course
                    const assignmentsResponse = await fetch(
                        `/course/${enrolledCourse}/assignments`
                    );
                    const assignmentsData = await assignmentsResponse.json();
                    console.log("assignmentsData", assignmentsData)
                    console.log("selectedStudents", selectedStudents);
                    // Create student assignments for each assignment
                    for (const student of selectedStudents)
                        for (const assignment of assignmentsData) {
                            const assignmentResponse = await fetch(
                            `/assignment/${assignment.assignment_id}/student/${student}`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    student_id: student,
                                    assignment_id: assignment.assignment_id,
                                }),
                            }
                        );

                        if (!assignmentResponse.ok) {
                            console.error(
                                "Failed to create student assignment for assignment",
                                assignment.id
                            );
                        }
                    }

                    navigate(`/course/${enrolledCourse}`);
                
            } else {
                console.error("Please select a student and a course");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    //            if (response.ok) {
    //                const newEnrollment = await response.json();
    //                console.log("newEnrollment", newEnrollment);
    //                navigate(`/course/${enrolledCourse}`);
    //            } else {
    //                console.error("Failed to add student to course");
    //            }
    //        } else {
    //            console.error("Please select a student and a course");
    //        }
    //    } catch (error) {
    //        console.error("Error:", error);
    //    }
    //};

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Select Student:
                <select multiple name="students"value={selectedStudents} onChange={handleStudentChange}>
                    <option value="">Select a student</option>
                    {allStudents.map((student) => (
                        <option key={student.id} value={student.id}>
                            {student.first_name} {student.last_name}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Enroll in Course:
                <select value={enrolledCourse} onChange={handleCourseChange}>
                    <option value="">Select a course</option>
                    {allCourses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.description}
                        </option>
                    ))}
                </select>
            </label>
            <button
                type="submit"
                disabled={!enrolledCourse || !selectedStudents}
            >
                Add Student
            </button>
        </form>
    );
}