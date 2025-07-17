import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "../../pages/SignIn";
import SignUp from "../../pages/SignUp";

const AuthStack = createNativeStackNavigator();

export default function AuthRoutes() {
    return (
        <AuthStack.Navigator>

            <AuthStack.Screen
                name="SignIn"
                component={SignIn}
                options={{
                    headerShown: false
                }}
            />

            <AuthStack.Screen
                name="SignUp"
                component={SignUp}
                options={{
                    // headerStyle: {
                    //     backgroundColor: '#3B3DBF',
                    // },
                    // headerTintColor: '#FFF',
                    // headerTitle: 'Voltar',
                    // headerShadowVisible: false
                    headerShown: false
                }}
            />

        </AuthStack.Navigator>
    );
}