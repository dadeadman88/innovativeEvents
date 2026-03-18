import TabBar from '@/components/Tabbar';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from 'react';
import Home from './home';
import MyEvents from './myEvents';
import Notifications from './notifications';
import Profile from './profile';

const Tabs = createBottomTabNavigator();

interface LayoutProps {
    // Empty interface for future props
}

const CreatePlaceholder = () => null;

const Layout = (props: LayoutProps) => {
    return (
        <Tabs.Navigator tabBar={(props) => <TabBar {...props} role="customer" />} screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="home" component={Home} />
            <Tabs.Screen name="myEvents" component={MyEvents} />
            <Tabs.Screen name="create" component={CreatePlaceholder} />
            <Tabs.Screen name="notifications" component={Notifications} />
            <Tabs.Screen name="profile" component={Profile} />
        </Tabs.Navigator>
    );
};

export default Layout;

