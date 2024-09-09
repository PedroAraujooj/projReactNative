import {Redirect, Tabs} from 'expo-router';
import React, {useContext} from 'react';

import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {Colors} from '@/constants/Colors';
import {useColorScheme} from '@/hooks/useColorScheme';
import {useSession} from "@/app/ctx";
import {Text, useTheme} from "react-native-paper";
import {darkTheme, lightTheme} from "@/constants/Theme";
import {ThemeContext} from "@/app/_layout";

export default function TabLayout() {
    const useThemeVar = useTheme();
    const {setTema, tema, setLogedUser, logedUser} = useContext(ThemeContext);
    const { session, isLoading , isLoadingTheme, theme, user } = useSession();

    if (isLoading ||isLoadingTheme) {
        return <Text>Loading...</Text>;
    }
    if (!logedUser.id || !session) {
        return <Redirect href="/login" />;
    }
    console.log(theme);

    if(theme === "dark"){
        setTema(darkTheme);
    }
    if(theme === "light"){
        setTema(lightTheme);
    }


    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: useThemeVar.colors.primary,
                tabBarStyle: {
                    backgroundColor: useThemeVar.colors.background,
                },
                headerShown: false,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({color, focused}) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'analytics' : 'analytics-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
