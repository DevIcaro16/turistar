import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "../../pages/SignIn";
import SignUp from "../../pages/SignUp";
import ForgotPassword from "../../pages/ForgotPassword";
import ResetPassword from "../../pages/ResetPassword";
import NewPassword from "../../pages/NewPassword";

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
            <AuthStack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{
                    headerShown: false
                }}
            />

            <AuthStack.Screen
                name="ResetPassword"
                component={ResetPassword}
                options={{
                    headerShown: false
                }}
            />

            <AuthStack.Screen
                name="NewPassword"
                component={NewPassword}
                options={{
                    headerShown: false
                }}
            />

        </AuthStack.Navigator>
    );
}