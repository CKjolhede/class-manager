import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useParams, useNavigate} from "react-router-dom";

export default function Course() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const { userType } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const url = `/course/${courseId}`;
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json()
                    setCourse(data);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchCourse();
    }, [courseId]);
    
    if (!course) {
        return <div>Loading...</div>;
    }
    

    return (
        <> 
            {userType === "student" && navigate(`/course/${courseId}/assignments`)}
            <div class="container-fluid bg-dark">
                <div class="btn-group col-4 d-grid-gap-2 d-md-flex">
                    {userType === "teacher" &&
                    (<button
                        class="btn btn-dark"
                        type="button"
                        onClick={() =>
                            navigate(`/course/${courseId}/assignments`)
                        }
                    >
                        Assignments
                    </button>)
            }

                    {userType === "teacher" && (
                        <button
                            class="btn btn-dark"
                            type="button"
                            onClick={() =>
                                navigate(`/course/${courseId}/students`)
                            }
                        >
                            Students
                        </button>
                    )}
                    {userType === "teacher" && (
                        <button
                            class="btn btn-dark"
                            type="button"
                            onClick={() =>
                                navigate(`/course/${courseId}/addassignment`)
                            }
                        >
                            New Assignment
                        </button>
                    )}
                </div>
            </div>
            <h2 class="row text-blue p-2 ms-5">
                {course.description} - {course.teacher_name}
            </h2>
            {/*{navigate(`/course/${courseId}/assignments`)}*/}÷
            {/*<div class="container-fluid ">
                <h1 class="row text-blue p-2 m-s-1">{course.description}</h1>
                {userType === "student" && (<h2>Teacher: {course.teacher_name}</h2>)}
            </div>*/}
            {/*<Routes>
                <Route path="/assignments/* " element={<Assignments />} />
                <Route path="/addassignment" element={<CreateAssignment />} />
                <Route path="/assignment/:assignmentId/" element={<Assignment />}/>
            </Routes>*/}
        </>
    );
}
