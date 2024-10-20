import React, { useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import * as yup from "yup";


export default function CreateAssignment({ assignStudentAssignment }) {
    const [errors, setErrors] = useState([]);
    const { courseId } = useParams();
    const navigate = useNavigate();
    
    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
            points_possible: "",
            course_id: courseId
        },
        validationSchema: yup.object({
            name: yup.string().required("Name is required"),
            description: yup.string().required("Description is required"),
            points_possible: yup.number().required("Points possible is required")
        }
        ),
        onSubmit: async (values) => {
            try {
                const response = await fetch("/assignments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    const data = await response.json();
                    const newAssignmentId = data.id;
                    
                    const studentsResponse = await fetch(`/course/${courseId}/students`);
                    if (studentsResponse.ok) {
                        const studentsdata = await studentsResponse.json();
                        console.log(studentsdata)
                        studentsdata.forEach(async (student) => {
                            await fetch(`/studentassignments`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    student_id: student.id,
                                    assignment_id: newAssignmentId
                                })
                            })
                            //if (response.ok) {
                            //    const data = await response.json();
                            //    console.log(data);
                            //}
                        }
                        )
                    navigate(`/course/${courseId}/assignment/${newAssignmentId}`);
                    } }      
                }
                catch (error) {
                console.error(error);
            }
        }
    });    
    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <h2 className="new-assignment-title">Create New Assignment</h2>
                <div className="new-assignment-form">
                    <input className="input-field"
                        id="name"
                        name="name"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                        placeholder="Name"
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <div className="error">{formik.errors.name}</div>
                    ) : null}
                    <input className="input-field"
                        id="description"
                        name="description"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                        placeholder="Description"
                    />
                    {formik.touched.description && formik.errors.description ? (
                        <div className="error">{formik.errors.description}</div>
                    ) : null}
                    <input className="input-field"
                        id="points_possible"
                        name="points_possible"
                        type="number"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.points_possible}
                        placeholder="Points Possible"
                    />
                    {formik.touched.points_possible && formik.errors.points_possible ? (
                        <div className="error">{formik.errors.points_possible}</div>
                    ) : null}
                    <input
                        id="course_id"
                        name="course_id"
                        type="hidden"
                        value={formik.values.course_id}
                    />
                    <button className="submit-button" type="submit">Submit</button>
                </div>
                <div id="errors">
                    {errors.map((error,index) => (
                        <p key={index}>{error.message}</p>
                    ))}
                </div>
                
            </form> 
                    
        </div>
    );
}