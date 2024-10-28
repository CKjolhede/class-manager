import { useFormik } from "formik";
import * as yup from "yup";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";


export default function EditAssignment({handleAssignmentUpdate, assignment}) {
    const [errors, setErrors] = useState([]);
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    //const [assignment, setAssignment] = useState({});
    
    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await fetch(`/assignment/${assignmentId}`);
                if (response.ok) {
                    const data = await response.json();
                    handleAssignmentUpdate(data)
                        ;
                } else {
                    const errorResponse = await response.json();
                    setErrors(errorResponse.errors);
                }
            } catch (error) {
                setErrors([{ message: error.message, code: error.code }]);
            }
        }
        fetchAssignment();
}, [assignmentId]);
        
    
    console.log("editassignment", assignment)
    const formik = useFormik({
        initialValues: {
            name: assignment.name,
            description: assignment.description,
            points_possible: assignment.points_possible
        },
        validationSchema: yup.object().shape({
            name: yup.string().required("Name is required"),
            description: yup.string().required("Description is required"),
            points_possible: yup.number().required("Points possible is required")
        }),
        onSubmit: async (values) => {
            try {
                setErrors([]);
                const response = await fetch(`/assignment/${assignment.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });
                if (response.ok) {
                    const updatedAssignment = await response.json();
                    handleAssignmentUpdate(updatedAssignment);
                    navigate(`../assignment/${updatedAssignment.id}`);
                    
                } else {
                    const errorResponse = await response.json();
                    setErrors(errorResponse.errors);
                    /* setErrors(errorResponse); */
                }
            } catch (error) {
                setErrors([{ message: error.message, code: error.code }]);
            }
            
        }
    });
    return (
        <>
        <div class="container-fluid p-0 ms-5">
            <h1>Edit Assignment</h1>
            <form onSubmit={formik.handleSubmit}>
                <label htmlFor="name" class="form-label ps-3 pe-2 me-5">Name  </label>
                <input
                    class="form-control-md pe-5 border-dark"
                    id="name"
                    name="name"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    />
                {formik.touched.name && formik.errors.name ? (
                    <div>{formik.errors.name}</div>
                ) : null}<br />
                    <label htmlFor="description" class="form-label ps-3 me-3 align-top">Description  </label>
                <textarea
                        class="form-control-md pe-5 border-dark"
                    rows="2"
                    id="description"
                    name="description"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    />
                {formik.touched.description && formik.errors.description ? (
                    <div>{formik.errors.description}</div>
                ) : null}<br />
                <label class="form-label pe-2" htmlFor="points_possible">Points Possible  </label>
                    <input
                    class="form-control-xs me-5 border-dark"
                    id="points_possible"
                    name="points_possible"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.points_possible}
                    />
                {formik.touched.points_possible && formik.errors.points_possible ? (
                    <div>{formik.errors.points_possible}</div>
                ) : null}
                <button type="submit">Submit</button>
            </form>
        </div>
        {errors.length > 0 && (
                <div>
                    <h3>Errors</h3>
                    <ul>
                        {errors.map((error) => (
                            <li key={error.code}>{error.message}</li>
                        ))}
                    </ul>
                </div>  
                )}
        </>
)};
    
