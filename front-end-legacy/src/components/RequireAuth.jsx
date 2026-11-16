import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getPrincipalType } from "../api";

function RequireAuth({ children, allowedTypes, requireCompanyAdmin = false }) {
    const location = useLocation();
    const [principalType] = useState(() => getPrincipalType());

    if (!principalType) {
        return <Navigate to="/" replace state={{ loginRequired: true, from: location }} />;
    }

    if (!allowedTypes.includes(principalType)) {
        return <Navigate to={principalType === "root" ? "/Gerenciamento" : "/Produtos"} replace />;
    }

    const canManageCollaborators = principalType === "company" ||
        localStorage.getItem("sgpr_session_is_admin") === "true" ||
        localStorage.getItem("sgpr_session_role") === "administrator";
    if (requireCompanyAdmin && !canManageCollaborators) {
        return <Navigate to="/Produtos" replace />;
    }

    return children;
}

export default RequireAuth;