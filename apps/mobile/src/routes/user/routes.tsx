import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../../pages/user/Home';
import { MaterialIcons } from '@expo/vector-icons';
import MonitorConexao from '../../components/MonitorConexao';
import Perfil from '../../pages/user/Perfil';
import UserTourPackages from '../../pages/user/TourPackages';
import UserReservations from '../../pages/user/Reservations';
import MyTours from '../../pages/user/MyTours';
import UserWallet from '../../pages/user/Wallet';


const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function UserTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false
            })}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    title: 'Início',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="UserTourPackages"
                component={UserTourPackages}
                options={{
                    title: 'Pacotes',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="money" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="UserReservations"
                component={UserReservations}
                options={{
                    title: 'Reservas',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="event" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="MyTours"
                component={MyTours}
                options={{
                    title: 'Passeios',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="explore" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Wallter"
                component={UserWallet}
                options={{
                    title: 'Carteira',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="wallet" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Perfil}
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

function UserDrawerNavigator() {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerRight: () => <MonitorConexao />,
                headerStyle: {
                    height: 68,
                    backgroundColor: '#007AFF',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                drawerActiveTintColor: '#007AFF',
                drawerInactiveTintColor: '#8E8E93',
                drawerStyle: {
                    backgroundColor: '#fff',
                    width: 280,
                },
            }}
        >
            <Drawer.Screen
                name="DriverTabs"
                component={UserTabNavigator}
                options={{
                    title: 'Início',
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="Profile"
                component={Perfil}
                options={{
                    title: 'Perfil',
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="person" size={size} color={color} />
                    ),
                }}
            />


            <Drawer.Screen
                name="UserTourPackages"
                component={UserTourPackages}
                options={{
                    title: 'Pacotes de Passeio',
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="money" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="UserReservations"
                component={UserReservations}
                options={{
                    title: 'Minhas Reservas',
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="event" size={size} color={color} />
                    ),
                }}
            />


            <Drawer.Screen
                name="MyTours"
                component={MyTours}
                options={{
                    title: 'Meus Passeios',
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="explore" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Wallter"
                component={UserWallet}
                options={{
                    title: 'Carteira',
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="wallet" size={size} color={color} />
                    ),
                }}
            />

        </Drawer.Navigator>
    );
}

export default function UserRoutes() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="UserDrawerNavigator"
                component={UserDrawerNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="TourPackages" component={UserTourPackages} options={{ title: 'Pacotes de Turismo' }} />
            <Stack.Screen name="UserReservations" component={UserReservations} options={{ title: 'Minhas Reservas' }} />
            <Stack.Screen name="MyTours" component={MyTours} options={{ title: 'Meus Passeios' }} />
        </Stack.Navigator>
    );
} 