import React from 'react';
import { View, Text, StyleSheet, Platform, Animated, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { PaperProvider, Portal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RequirementsStackParamList, ListingsStackParamList, MainTabsParamList } from './types';
import { EnhancedModal, EnhancedFAB } from './SharedNavComponents';

// --- Screen Imports ---
import DashboardScreen from '../features/dashboard/DashboardScreen';
import MyRequirementsScreen from '../features/requirements/MyRequirementsScreen';
import RequirementMatchesScreen from '../features/requirements/RequirementMatchesScreen';
import BrokerSiteScreen from '../screens/broker-site/BrokerSiteScreen';

// --- Color Palette ---
const colors = {
    primary: '#6366F1',
    textSecondary: '#64748B',
    textLight: '#94A3B8',
    surface: '#FFFFFF',
    background: '#FAFBFF',
    border: '#E2E8F0',
    shadow: '#0F172A',
};
const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

// --- Inner Stack Navigators ---
const RequirementsStackNav = createStackNavigator<RequirementsStackParamList>();
const ListingsStackNav = createStackNavigator<ListingsStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

const RequirementsStack = () => (
    <RequirementsStackNav.Navigator screenOptions={{ headerShown: false }}>
        <RequirementsStackNav.Screen name="MyRequirements" component={MyRequirementsScreen} />
        <RequirementsStackNav.Screen name="RequirementMatches" component={RequirementMatchesScreen} />
    </RequirementsStackNav.Navigator>
);

const ListingsStack = () => {
    const MyListingsScreen = () => (
        <SafeAreaView style={styles.placeholderContainer}>
            <Text style={styles.placeholderTitle}>My Listings</Text>
            <Text style={styles.placeholderSubtitle}>Coming Soon</Text>
        </SafeAreaView>
    );
    return (
        <ListingsStackNav.Navigator screenOptions={{ headerShown: false }}>
            <ListingsStackNav.Screen name="MyListings" component={MyListingsScreen} />
        </ListingsStackNav.Navigator>
    );
};

const ProfileScreen = () => (
    <SafeAreaView style={styles.placeholderContainer}>
        <Text style={styles.placeholderTitle}>Profile</Text>
        <Text style={styles.placeholderSubtitle}>Coming Soon</Text>
    </SafeAreaView>
);

// --- Custom Tab Bar ---
const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
    const icons: Record<string, string> = {
        Home: 'view-dashboard-outline',
        RequirementsTab: 'clipboard-list-outline',
        BrokerSiteScreen: 'web',
        ListingsTab: 'home-group-outline',
        Profile: 'account-circle-outline'
    };
    const labels: Record<string, string> = {
        Home: 'Dashboard',
        RequirementsTab: 'Requirements',
        BrokerSiteScreen: 'My Site',
        ListingsTab: 'Listings',
        Profile: 'Profile'
    };
    return (
        <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
                if (route.name === 'AddAction') return <View key={route.key} style={{ flex: 1 }} />;
                const isFocused = state.index === index;
                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={() => navigation.navigate(route.name)}
                        style={styles.tabItem}
                    >
                        <Icon name={icons[route.name]} size={24} color={isFocused ? colors.primary : colors.textSecondary} />
                        <Text style={{ color: isFocused ? colors.primary : colors.textSecondary, fontSize: 10, marginTop: 4 }}>
                            {labels[route.name] || route.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

// --- Main Bottom Tab Navigator ---
const AppBottomNavigator = () => {
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = React.useState(false);

    return (
        <PaperProvider>
            <Portal>
                <EnhancedModal
                    visible={isModalVisible}
                    onDismiss={() => setModalVisible(false)}
                    navigation={navigation as any}
                />
            </Portal>
            <View style={{ flex: 1, position: 'relative' }}>
                <Tab.Navigator
                    screenOptions={{ headerShown: false }}
                    tabBar={(props) => (
                        <View style={styles.tabBarWrapper}>
                             <EnhancedFAB onPress={() => setModalVisible(true)} />
                            <CustomTabBar {...props} />
                        </View>
                    )}
                >
                    <Tab.Screen name="Home" component={DashboardScreen} />
                    <Tab.Screen name="RequirementsTab" component={RequirementsStack} />
                    <Tab.Screen name="AddAction" component={() => null} listeners={{ tabPress: e => e.preventDefault() }} />
                    <Tab.Screen name="ListingsTab" component={ListingsStack} />
                    <Tab.Screen name="Profile" component={ProfileScreen} />
                </Tab.Navigator>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    tabBarWrapper: { position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'flex-end' },
    tabBar: { flexDirection: 'row', height: Platform.OS === 'ios' ? 85 : 65, paddingBottom: Platform.OS === 'ios' ? 20 : 5, backgroundColor: colors.surface, borderTopWidth: 1, borderColor: colors.border },
    tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    placeholderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
    placeholderTitle: { fontSize: 22, fontWeight: 'bold' },
    placeholderSubtitle: { fontSize: 16, color: colors.textSecondary, marginTop: 8 },
});

export default AppBottomNavigator;