import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useParams, NavLink, useNavigate} from "react-router-dom";
import Assignments from "./Assignments";
export default function Course() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const { userType } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const url = `/courses/${courseId}`;
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json()
                    setCourse({
                        description: data[0].description,
                        id: data[0].id,
                        name: data[0].name,
                        teacher_id: data[0].teacher_id,
                        teacher_name: data[1]
                    });
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
            <> <div>
         {navigate(`/course/${courseId}/assignments`)}
                    <NavLink to={`/course/${courseId}/assignments`  }>
                        Assignments
                        </NavLink>

            {userType === "teacher" ? (
                        <NavLink to={`/course/${courseId}/students`}>
                            Students{" "}
                        </NavLink> ) : null}

                
            {userType === "teacher" ? (
                        <NavLink
                            to={`/course/${courseId}/addassignment`}>
                            New Assignment course
                        </NavLink>) : null}
                
            </div>
    
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
