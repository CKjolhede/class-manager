import React, {useState, useEffect} from 'react';
import { Routes, Route, useNavigate} from "react-router-dom";
import Courses from "./Courses.js";
import Course from "./Course.js";
import Student from "./Student.js";
import StudentPage from "./StudentPage.js";
import CreateAssignment from "./CreateAssignment.js";
import CreateStudent from "./CreateStudent.js";
import Students from "./Students.js";
import Assignments from "./Assignments.js";
import Assignment from "./Assignment.js";
import EditAssignment from "./EditAssignment.js";
import TeacherStudents from "./TeacherStudents.js";
import AddStudentToCourse from "./AddStudentToCourse.js";

export default function Home() {
    const [studentAssignments, setStudentAssignments] = useState([]);
    const [courseAssignments, setCourseAssignments] = useState([]);
    const navigate = useNavigate();
    const [isNavigating, setIsNavigating] = useState(false);
    const [assignment, setAssignment] = useState(null);
    
      const handleAssignmentUpdate = async (updatedAssignment) => {
          setAssignment(updatedAssignment);
      };
    
    const handleSetCourseAssignments = (assignments) => {
        setCourseAssignments(assignments)
    };
    const handleSetStudentAssignments = (sa) =>
    {  
            setStudentAssignments(sa)
    };
    useEffect(() => {
        if (!isNavigating) {
            setIsNavigating(true);
            navigate('/courses');
            setIsNavigating(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNavigating]);
    return (
        <>

            <Routes>
                <Route path="/courses/*" element={<Courses
                />} />
                <Route path="course/:courseId/" element={<Course  />} />
                <Route path="course/:courseId/assignments" element={<Assignments   />} />
                <Route path="/course/:courseId/addassignment" element={<CreateAssignment />} />
                <Route path="/addstudenttocourse" element={<AddStudentToCourse  courseAssignments={courseAssignments} />} />
                <Route path="/teacherstudents" element={<TeacherStudents />} />
                <Route path="studentpage/:studentId" element={<StudentPage handleSetCourseAssignments={handleSetCourseAssignments}/>} />
                <Route path="/assignment/:assignmentId/" element={<Assignment handleAssignmentUpdate ={handleAssignmentUpdate} assignment={assignment} />} />
                <Route path="course/:courseId/students/" element={
                    <>
                        <Students
                        
                            courseAssignments={courseAssignments}
                            studentAssignments={studentAssignments}
                            handleSetCourseAssignments={handleSetCourseAssignments}
                            handleSetStudentAssignments={handleSetStudentAssignments} />
                    </>} />
                <Route path="/createstudent" element={<CreateStudent  />}/>
                <Route path="/course/:courseId/students/student/:studentId" element={
                    <Student
                            courseAssignments={courseAssignments}
                            studentAssignments={studentAssignments}
                        />
                    }
                />
                <Route path="/editassignment/:assignmentId" element={<EditAssignment handleAssignmentUpdate = {handleAssignmentUpdate} assignment = { assignment }  />} />
            </Routes>
        </>
    );
}