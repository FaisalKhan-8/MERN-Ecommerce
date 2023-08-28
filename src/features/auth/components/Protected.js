import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { selectLoggedInUser } from "../authSlice";

function Protected({children}) {
       const user = useSelector(selectLoggedInUser)
       if (!user){
        return <Navigate to={'/login'} replace={true} />
       }
    return children;
}

export default Protected;