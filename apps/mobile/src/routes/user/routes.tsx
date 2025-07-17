import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../../pages/user/Home';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function UserTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{ title: 'Início' }}
            />

        </Tab.Navigator>
    );
}

export default function UserRoutes() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="UserMain"
                component={UserTabNavigator}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
} 