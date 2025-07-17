import { useContext, useState } from "react";
import { Text, View } from "react-native";
import AuthRoutes from "../routes/auth/route";
import DriverRoutes from "./driver/routes"; // Você precisará criar este arquivo
import ModalComponent from "../components/ModalComponent";
import { AuthContext } from "../contexts/auth";
import UserRoutes from "./user/routes";

export default function Routes() {
    const { signed, loading, userRole } = useContext<any>(AuthContext);

    if (loading) {
        return (
            <ModalComponent
                message="Obtendo Informações..."
            />
        );
    }

    if (!signed) {
        return <AuthRoutes />;
    }

    if (userRole === 'driver') {
        return <DriverRoutes />;
    }

    if (userRole === 'user') {
        return <UserRoutes />;
    }
}