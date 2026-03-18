import TabBar from '@/components/Tabbar';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from 'react';
import ProviderEvents from "./providerEvents";
import Home from './home';
import Profile from './profile';
import MyEvents from './providerEvents';
// @ts-ignore - tabs screens added during refactor
import Notifications from "./notifications";
// @ts-ignore - tabs screens added during refactor
import Chat from "./chat";

const Tabs = createBottomTabNavigator();

interface MainTabsProps {
    // Empty interface for future props
}

const MainTabs = (props: MainTabsProps) => {
    return (
        <Tabs.Navigator tabBar={(props) => <TabBar {...props} role="provider" />} screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="home" component={Home} />
            <Tabs.Screen name="myEvents" component={MyEvents} />
            <Tabs.Screen name="chat" component={Chat} />
            <Tabs.Screen name="notifications" component={Notifications} />
            <Tabs.Screen name="profile" component={Profile} />
        </Tabs.Navigator>);
};

export default MainTabs;

