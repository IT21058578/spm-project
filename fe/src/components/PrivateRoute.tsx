import { PropsWithChildren, useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { getItem } from "../Utils/Generals"
import RoutePaths from "../config";
import { UserType } from "../types";
import { useAppSelector } from '../hooks/redux-hooks'

const PrivateRoute = ({type = 0, children} : PropsWithChildren<{type : number}>) => {
    
    const isLogged = getItem(RoutePaths.token);
    const find : UserType = useAppSelector(state => state.user);
    const user = !isLogged ? null : JSON.parse(getItem('user') || '');

    const admin = find.isAuthorized;

    if (!isLogged) {
        return <Navigate to={RoutePaths.login} replace />;
    }

    if (type === 1 && admin===true) {

        return <Navigate to={RoutePaths.home} replace />;
    }

    return <Outlet />;
}

export default PrivateRoute;