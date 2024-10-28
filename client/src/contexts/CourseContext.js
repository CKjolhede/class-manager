import { createContext, useContext } from "react";

const CourseContext = createContext();

export const CourseProvider = ({ children, courseId }) => {
    return (
        <CourseContext.Provider value={courseId}>
            {children}
        </CourseContext.Provider>
    );
};

export const useCourse = () => {
    const courseId = useContext(CourseContext);
    
    
    
    
    return useContext(CourseContext)
};