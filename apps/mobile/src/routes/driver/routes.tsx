import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import Home from '../../pages/driver/Home';
import MonitorConexao from '../../components/MonitorConexao';
import Perfil from '../../pages/driver/Perfil';
import CarManagement from '../../pages/driver/Car';
import TouristPointManagement from '../../pages/driver/TouristPoint';
import TourPackageManagement from '../../pages/driver/TourPackage';
import ToursManagement from '../../pages/driver/Tours';
import DriverWallet from '../../pages/driver/Wallet';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function DriverTabNavigator() {
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
                name="Profile"
                component={Perfil}
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="person" size={size} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="CarManagement"
                component={CarManagement}
                options={{
                    title: 'Meus Veículos',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="directions-car" size={size} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="TouristPointManagement"
                component={TouristPointManagement}
                options={{
                    title: 'Pontos Turisticos',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="tour" size={size} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="TourPackageManagement"
                component={TourPackageManagement}
                options={{
                    title: 'Pacotes de Passeio',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="money" size={size} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="ToursManagement"
                component={ToursManagement}
                options={{
                    title: 'Passeios',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="directions-bus" size={size} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="DriverWallet"
                component={DriverWallet}
                options={{
                    title: 'Carteira',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="wallet" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

function DriverDrawerNavigator() {
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
                component={DriverTabNavigator}
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
                name="CarManagement"
                component={CarManagement}
                options={{
                    title: 'Meus Veículos',
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="directions-car" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="TouristPointManagement"
                component={TouristPointManagement}
                options={{
                    title: 'Pontos Turisticos',
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="tour" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="TourPackageManagement"
                component={TourPackageManagement}
                options={{
                    title: 'Pacotes de Passeio',
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="money" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="ToursManagement"
                component={ToursManagement}
                options={{
                    title: 'Passeios',
                    drawerIcon: ({ color, size }) => (
                        <MaterialIcons name="directions-bus" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="DriverWallet"
                component={DriverWallet}
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

export default function DriverRoutes() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="DriverMain"
                component={DriverDrawerNavigator}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
} 