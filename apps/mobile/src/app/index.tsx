import { useContext } from "react";
import { Text, View } from "react-native";
import AuthRoutes from "../routes/auth/route";
import DriverRoutes from "../routes/driver/routes";
import ModalComponent from "../components/ModalComponent";
import { AuthContext } from "../contexts/auth";
import UserRoutes from "../routes/user/routes";

export default function Index() {
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

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Carregando...</Text>
        </View>
    );
} 