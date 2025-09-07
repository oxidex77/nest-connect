// import React, { useState, useEffect, useCallback } from 'react';
// import { StyleSheet, ScrollView, View, SafeAreaView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
// import { Appbar, Text, useTheme } from 'react-native-paper';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { fetchDashboardStats } from '../../api/mockData';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../redux/store';
// import { RootStackParamList } from '../../navigation/AppNavigator';

// const { width, height } = Dimensions.get('window');

// // Enhanced StatCard with proper spacing and visual hierarchy
// const StatCard = ({ icon, label, value, color, onPress, isLarge = false }: { 
//     icon: string, 
//     label: string, 
//     value: number | string, 
//     color: string, 
//     onPress: () => void,
//     isLarge?: boolean 
// }) => {
//     return (
//         <TouchableOpacity 
//             style={[
//                 styles.statCardContainer, 
//                 isLarge ? styles.largeCardContainer : null
//             ]} 
//             onPress={onPress}
//             activeOpacity={0.85}
//         >
//             <View style={[styles.statCard, isLarge ? styles.largeCard : null]}>
//                 {/* Icon with proper spacing */}
//                 <View style={styles.cardHeader}>
//                     <View 
//                         style={[
//                             styles.iconContainer, 
//                             { backgroundColor: color },
//                             isLarge ? styles.largeIconContainer : null
//                         ]}
//                     >
//                         <Icon name={icon} size={isLarge ? 24 : 20} color="#FFFFFF" />
//                     </View>
//                 </View>
                
//                 {/* Content with better spacing */}
//                 <View style={styles.cardContent}>
//                     <Text style={[styles.statValue, isLarge ? styles.largeStatValue : null]}>
//                         {value}
//                     </Text>
//                     <Text style={[styles.statLabel, isLarge ? styles.largeStatLabel : null]} numberOfLines={2}>
//                         {label}
//                     </Text>
//                 </View>
//             </View>
//         </TouchableOpacity>
//     );
// };

// // Enhanced action button with better visual balance
// const ActionButton = ({ icon, title, subtitle, onPress, isPrimary = false }: {
//     icon: string,
//     title: string,
//     subtitle: string,
//     onPress: () => void,
//     isPrimary?: boolean
// }) => {
//     return (
//         <TouchableOpacity 
//             style={[
//                 styles.actionButton, 
//                 isPrimary ? styles.primaryActionButton : null
//             ]} 
//             onPress={onPress}
//             activeOpacity={0.85}
//         >
//             <View style={[
//                 styles.actionIcon,
//                 isPrimary ? styles.primaryActionIcon : null
//             ]}>
//                 <Icon 
//                     name={icon} 
//                     size={22} 
//                     color={isPrimary ? "#FFFFFF" : "#8B5CF6"} 
//                 />
//             </View>
//             <View style={styles.actionContent}>
//                 <Text style={[
//                     styles.actionTitle,
//                     isPrimary ? styles.primaryActionTitle : null
//                 ]}>
//                     {title}
//                 </Text>
//                 <Text style={[
//                     styles.actionSubtitle,
//                     isPrimary ? styles.primaryActionSubtitle : null
//                 ]}>
//                     {subtitle}
//                 </Text>
//             </View>
//             <Icon 
//                 name="chevron-right" 
//                 size={20} 
//                 color={isPrimary ? "#FFFFFF" : "#9CA3AF"} 
//             />
//         </TouchableOpacity>
//     );
// };

// const DashboardScreen = () => {
//     const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
//     const theme = useTheme();
//     const user = useSelector((state: RootState) => state.user.user);
//     const [stats, setStats] = useState({ incomingSiteVisits: 0, myUpcomingVisits: 0, totalMatchedListings: 0 });
//     const [refreshing, setRefreshing] = useState(false);

//     const loadStats = useCallback(() => {
//         setRefreshing(true);
//         fetchDashboardStats().then(data => {
//             setStats(data);
//             setRefreshing(false);
//         });
//     }, []);

//     useEffect(() => {
//         loadStats();
//     }, [loadStats]);

//     const getGreeting = () => {
//         const hour = new Date().getHours();
//         if (hour < 12) return 'Good morning';
//         if (hour < 17) return 'Good afternoon';
//         return 'Good evening';
//     };

//     return (
//         <SafeAreaView style={styles.container}>
//             {/* Clean header with proper hierarchy */}
//             <View style={styles.header}>
//                 <View style={styles.headerContent}>
//                     <View>
//                         <Text style={styles.greeting}>{getGreeting()}</Text>
//                         <Text style={styles.username}>{user?.name || 'Agent'}</Text>
//                     </View>
//                     <TouchableOpacity style={styles.notificationButton}>
//                         <View style={styles.notificationIconBg}>
//                             <Icon name="bell-outline" size={20} color="#6B7280" />
//                             <View style={styles.notificationDot} />
//                         </View>
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             <ScrollView
//                 style={styles.scrollView}
//                 showsVerticalScrollIndicator={false}
//                 refreshControl={
//                     <RefreshControl 
//                         refreshing={refreshing} 
//                         onRefresh={loadStats} 
//                         colors={['#8B5CF6']} 
//                         tintColor="#8B5CF6"
//                     />
//                 }
//             >
//                 {/* Enhanced summary card with proper alignment */}
//                 <View style={styles.section}>
//                     <View style={styles.summaryCard}>
//                         <View style={styles.summaryContent}>
//                             {/* Fixed header with proper flex alignment */}
//                             <View style={styles.summaryHeader}>
//                                 <Text style={styles.summaryTitle}>Today's Overview</Text>
//                                 <View style={styles.statusIndicator}>
//                                     <View style={styles.statusDot} />
//                                     <Text style={styles.statusText}>All systems active</Text>
//                                 </View>
//                             </View>
//                             <Text style={styles.summaryDescription}>
//                                 Track your property portfolio and client interactions with real-time insights
//                             </Text>
//                         </View>
//                     </View>
//                 </View>

//                 {/* Enhanced stats section with clear hierarchy */}
//                 <View style={styles.section}>
//                     {/* Properly aligned section header */}
//                     <View style={styles.sectionHeader}>
//                         <Text style={styles.sectionTitle}>Key Metrics</Text>
//                         <TouchableOpacity style={styles.viewAllButton}>
//                             <Text style={styles.viewAllText}>View All</Text>
//                             <Icon name="arrow-right" size={14} color="#8B5CF6" />
//                         </TouchableOpacity>
//                     </View>
                    
//                     {/* Improved grid with proper spacing */}
//                     <View style={styles.statsGrid}>
//                         <StatCard 
//                             icon="trending-up" 
//                             label="Site Visits Today" 
//                             value={stats.incomingSiteVisits} 
//                             color="#8B5CF6" 
//                             onPress={() => {}} 
//                             isLarge={true}
//                         />
//                         <StatCard 
//                             icon="calendar-clock" 
//                             label="Scheduled Visits" 
//                             value={stats.myUpcomingVisits} 
//                             color="#F59E0B" 
//                             onPress={() => {}} 
//                             isLarge={true}
//                         />
                        
//                         <StatCard
//                             icon="home-variant"
//                             label="Matched Properties"
//                             value={stats.totalMatchedListings}
//                             color="#10B981"
//                             onPress={() => navigation.navigate('MainTabs', { screen: 'RequirementsTab' })}
//                         />
                        
//                         <StatCard
//                             icon="account-group"
//                             label="Active Leads"
//                             value="32"
//                             color="#EF4444"
//                             onPress={() => {}}
//                         />

//                         <StatCard
//                             icon="compare-horizontal"
//                             label="Comparisons"
//                             value="12"
//                             color="#6366F1"
//                             onPress={() => navigation.navigate('ProjectFinder')}
//                         />
                        
//                         <StatCard
//                             icon="plus-circle"
//                             label="New Listings"
//                             value="5"
//                             color="#8B5CF6"
//                             onPress={() => navigation.navigate('NewProjectForm')}
//                         />
//                     </View>
//                 </View>

//                 {/* Enhanced quick actions with divider */}
//                 <View style={styles.sectionDivider} />
//                 <View style={styles.section}>
//                     <View style={styles.sectionHeader}>
//                         <Text style={styles.sectionTitle}>Quick Actions</Text>
//                         <TouchableOpacity style={styles.moreActionsButton}>
//                             <Icon name="dots-horizontal" size={18} color="#6B7280" />
//                         </TouchableOpacity>
//                     </View>
//                     <View style={styles.actionsContainer}>
//                         <ActionButton
//                             icon="home-plus"
//                             title="Add New Property"
//                             subtitle="List a new property in your portfolio"
//                             onPress={() => navigation.navigate('CategorySelection', { flow: 'listing' })}
//                             isPrimary={true}
//                         />
//                         <ActionButton
//                             icon="clipboard-text"
//                             title="Create Requirement"
//                             subtitle="Add new client requirement profile"
//                             onPress={() => navigation.navigate('CategorySelection', { flow: 'requirement' })}
//                         />
//                         <ActionButton
//                             icon="chart-line"
//                             title="Analytics Dashboard"
//                             subtitle="View detailed performance insights"
//                             onPress={() => {}}
//                         />
//                         <ActionButton
//                             icon="account-multiple"
//                             title="Client Management"
//                             subtitle="Organize and manage client database"
//                             onPress={() => {}}
//                         />
//                     </View>
//                 </View>

//                 <View style={styles.bottomSpacing} />
//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F8FAFC',
//     },
//     header: {
//         paddingTop: 12,
//         paddingBottom: 20,
//         paddingHorizontal: 20,
//         backgroundColor: '#FFFFFF',
//         borderBottomWidth: 1,
//         borderBottomColor: '#F1F5F9',
//     },
//     headerContent: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     greeting: {
//         fontSize: 15,
//         color: '#64748B',
//         fontWeight: '500',
//         fontFamily: 'System',
//     },
//     username: {
//         fontSize: 24,
//         color: '#0F172A',
//         fontWeight: '700',
//         marginTop: 2,
//         fontFamily: 'System',
//     },
//     notificationButton: {
//         padding: 6,
//     },
//     notificationIconBg: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: '#F8FAFC',
//         justifyContent: 'center',
//         alignItems: 'center',
//         position: 'relative',
//         borderWidth: 1,
//         borderColor: '#E2E8F0',
//     },
//     notificationDot: {
//         position: 'absolute',
//         top: 6,
//         right: 6,
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//         backgroundColor: '#EF4444',
//         borderWidth: 2,
//         borderColor: '#FFFFFF',
//     },
//     scrollView: {
//         flex: 1,
//         backgroundColor: '#F8FAFC',
//     },
//     section: {
//         paddingHorizontal: 20,
//         marginBottom: 24,
//     },
//     sectionDivider: {
//         height: 8,
//         backgroundColor: '#F1F5F9',
//         marginHorizontal: 0,
//         marginBottom: 24,
//     },
//     sectionHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 16,
//         paddingHorizontal: 4,
//     },
//     sectionTitle: {
//         fontSize: 20,
//         fontWeight: '700',
//         color: '#0F172A',
//         fontFamily: 'System',
//     },
//     viewAllButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         backgroundColor: '#F4F3FF',
//         borderRadius: 20,
//         borderWidth: 1,
//         borderColor: '#E9E7FF',
//     },
//     viewAllText: {
//         fontSize: 13,
//         color: '#8B5CF6',
//         fontWeight: '600',
//         marginRight: 4,
//     },
//     moreActionsButton: {
//         width: 32,
//         height: 32,
//         borderRadius: 16,
//         backgroundColor: '#F8FAFC',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#E2E8F0',
//     },
//     summaryCard: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: 16,
//         padding: 1,
//         shadowColor: '#8B5CF6',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 12,
//         elevation: 4,
//         borderWidth: 2,
//         borderColor: '#8B5CF6',
//     },
//     summaryContent: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: 14,
//         padding: 20,
//     },
//     summaryHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 12,
//     },
//     summaryTitle: {
//         fontSize: 18,
//         fontWeight: '700',
//         color: '#0F172A',
//         fontFamily: 'System',
//         flex: 1,
//     },
//     statusIndicator: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#F0FDF4',
//         paddingHorizontal: 8,
//         paddingVertical: 4,
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: '#BBF7D0',
//         marginLeft: 12,
//     },
//     statusDot: {
//         width: 6,
//         height: 6,
//         borderRadius: 3,
//         backgroundColor: '#10B981',
//         marginRight: 4,
//     },
//     statusText: {
//         fontSize: 11,
//         color: '#059669',
//         fontWeight: '600',
//     },
//     summaryDescription: {
//         fontSize: 14,
//         color: '#64748B',
//         lineHeight: 20,
//         fontWeight: '400',
//     },
//     statsGrid: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         marginHorizontal: -6,
//     },
//     statCardContainer: {
//         width: '50%',
//         paddingHorizontal: 6,
//         marginBottom: 12,
//     },
//     largeCardContainer: {
//         width: '50%',
//     },
//     statCard: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: 16,
//         paddingHorizontal: 16,
//         paddingVertical: 20,
//         minHeight: 120,
//         shadowColor: '#64748B',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.08,
//         shadowRadius: 8,
//         elevation: 3,
//         borderWidth: 1,
//         borderColor: '#F1F5F9',
//     },
//     largeCard: {
//         minHeight: 130,
//         paddingHorizontal: 18,
//         paddingVertical: 22,
//     },
//     cardHeader: {
//         marginBottom: 16,
//     },
//     iconContainer: {
//         width: 40,
//         height: 40,
//         borderRadius: 12,
//         justifyContent: 'center',
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//         elevation: 2,
//     },
//     largeIconContainer: {
//         width: 44,
//         height: 44,
//         borderRadius: 14,
//     },
//     cardContent: {
//         flex: 1,
//         justifyContent: 'center',
//     },
//     statValue: {
//         fontSize: 24,
//         fontWeight: '800',
//         color: '#0F172A',
//         marginBottom: 4,
//         fontFamily: 'System',
//     },
//     largeStatValue: {
//         fontSize: 28,
//         marginBottom: 6,
//     },
//     statLabel: {
//         fontSize: 13,
//         color: '#64748B',
//         fontWeight: '600',
//         lineHeight: 16,
//         fontFamily: 'System',
//     },
//     largeStatLabel: {
//         fontSize: 14,
//         lineHeight: 18,
//     },
//     actionsContainer: {
//         gap: 10,
//     },
//     actionButton: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: 14,
//         padding: 18,
//         flexDirection: 'row',
//         alignItems: 'center',
//         shadowColor: '#64748B',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.06,
//         shadowRadius: 8,
//         elevation: 2,
//         borderWidth: 1,
//         borderColor: '#F1F5F9',
//     },
//     primaryActionButton: {
//         backgroundColor: '#8B5CF6',
//         shadowColor: '#8B5CF6',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.2,
//         shadowRadius: 12,
//         elevation: 6,
//         borderColor: '#8B5CF6',
//     },
//     actionIcon: {
//         width: 44,
//         height: 44,
//         borderRadius: 12,
//         backgroundColor: '#F4F3FF',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: 14,
//     },
//     primaryActionIcon: {
//         width: 44,
//         height: 44,
//         borderRadius: 12,
//         backgroundColor: 'rgba(255, 255, 255, 0.2)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: 14,
//     },
//     actionContent: {
//         flex: 1,
//     },
//     actionTitle: {
//         fontSize: 16,
//         fontWeight: '700',
//         color: '#0F172A',
//         marginBottom: 2,
//         fontFamily: 'System',
//     },
//     primaryActionTitle: {
//         color: '#FFFFFF',
//         fontSize: 16,
//         fontWeight: '700',
//     },
//     actionSubtitle: {
//         fontSize: 13,
//         color: '#64748B',
//         lineHeight: 16,
//         fontWeight: '500',
//     },
//     primaryActionSubtitle: {
//         color: 'rgba(255, 255, 255, 0.85)',
//         fontSize: 13,
//         fontWeight: '500',
//     },
//     bottomSpacing: {
//         height: 40,
//     },
// });

// export default DashboardScreen;




import React, { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, View, SafeAreaView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { RootStackParamList } from '../../navigation/types'; // <-- CORRECTED IMPORT
import { getDashboardStats } from '../../services/api';

const { width } = Dimensions.get('window');

// --- StatCard Component ---
const StatCard = ({ icon, label, value, color, onPress, isLarge = false }: { 
    icon: string, label: string, value: number | string, color: string, onPress: () => void, isLarge?: boolean 
}) => {
    return (
        <TouchableOpacity style={[styles.statCardContainer, isLarge ? styles.largeCardContainer : null]} onPress={onPress} activeOpacity={0.85}>
            <View style={[styles.statCard, isLarge ? styles.largeCard : null]}>
                <View style={styles.cardHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: color }, isLarge ? styles.largeIconContainer : null]}>
                        <Icon name={icon} size={isLarge ? 24 : 20} color="#FFFFFF" />
                    </View>
                </View>
                <View style={styles.cardContent}>
                    <Text style={[styles.statValue, isLarge ? styles.largeStatValue : null]}>{value}</Text>
                    <Text style={[styles.statLabel, isLarge ? styles.largeStatLabel : null]} numberOfLines={2}>{label}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// --- ActionButton Component ---
const ActionButton = ({ icon, title, subtitle, onPress, isPrimary = false }: {
    icon: string, title: string, subtitle: string, onPress: () => void, isPrimary?: boolean
}) => {
    return (
        <TouchableOpacity style={[styles.actionButton, isPrimary ? styles.primaryActionButton : null]} onPress={onPress} activeOpacity={0.85}>
            <View style={[styles.actionIcon, isPrimary ? styles.primaryActionIcon : null]}>
                <Icon name={icon} size={22} color={isPrimary ? "#FFFFFF" : "#8B5CF6"} />
            </View>
            <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, isPrimary ? styles.primaryActionTitle : null]}>{title}</Text>
                <Text style={[styles.actionSubtitle, isPrimary ? styles.primaryActionSubtitle : null]}>{subtitle}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={isPrimary ? "#FFFFFF" : "#9CA3AF"} />
        </TouchableOpacity>
    );
};

type DashboardStats = {
    totalProperties: number;
    activeRequirements: number;
    siteVisitsToday: number;
    scheduledVisits: number;
};

// --- Dashboard Screen ---
const DashboardScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { user } = useSelector((state: RootState) => state.user);
    const [stats, setStats] = useState<DashboardStats>({ totalProperties: 0, activeRequirements: 0, siteVisitsToday: 0, scheduledVisits: 0 });
    const [refreshing, setRefreshing] = useState(false);

    const loadStats = useCallback(async () => {
        setRefreshing(true);
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to load dashboard stats:", error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(useCallback(() => { loadStats(); }, [loadStats]));

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.greeting}>{getGreeting()}</Text>
                        <Text style={styles.username}>{user?.name || 'Agent'}</Text>
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <View style={styles.notificationIconBg}><Icon name="bell-outline" size={20} color="#6B7280" /><View style={styles.notificationDot} /></View>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadStats} colors={['#8B5CF6']} />}>
                <View style={styles.section}>
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryContent}>
                            <View style={styles.summaryHeader}><Text style={styles.summaryTitle}>Today's Overview</Text><View style={styles.statusIndicator}><View style={styles.statusDot} /><Text style={styles.statusText}>Live Data</Text></View></View>
                            <Text style={styles.summaryDescription}>Track your property portfolio and client interactions with real-time insights.</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.section}>
                    <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Key Metrics</Text></View>
                    <View style={styles.statsGrid}>
                       <StatCard icon="home-group" label="Total Properties" value={stats.totalProperties} color="#8B5CF6" onPress={() => navigation.navigate('MainTabs', { screen: 'ListingsTab', params: { screen: 'MyListings' } })} isLarge={true} />
                        <StatCard icon="clipboard-list" label="Active Requirements" value={stats.activeRequirements} color="#F59E0B" onPress={() => navigation.navigate('MainTabs', { screen: 'RequirementsTab', params: { screen: 'MyRequirements' } })} isLarge={true} />
                        <StatCard icon="trending-up" label="Site Visits Today" value={stats.siteVisitsToday} color="#10B981" onPress={() => {}} />
                        <StatCard icon="calendar-clock" label="Scheduled Visits" value={stats.scheduledVisits} color="#EF4444" onPress={() => {}} />
                    </View>
                </View>
                <View style={styles.sectionDivider} />
                <View style={styles.section}>
                    <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Quick Actions</Text></View>
                    <View style={styles.actionsContainer}>
                        <ActionButton icon="home-plus" title="Add New Property" subtitle="List a new property in your portfolio" onPress={() => navigation.navigate('CategorySelection', { flow: 'listing' })} isPrimary={true} />
                        <ActionButton icon="clipboard-text" title="Create Requirement" subtitle="Add new client requirement profile" onPress={() => navigation.navigate('CategorySelection', { flow: 'requirement' })} />
                        <ActionButton icon="compare-horizontal" title="Compare Projects" subtitle="Analyze new launch projects" onPress={() => navigation.navigate('ProjectFinder')} />
                    </View>
                </View>
                <View style={styles.bottomSpacing} />
            </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC', },
    header: { paddingTop: 12, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', },
    headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
    greeting: { fontSize: 15, color: '#64748B', fontWeight: '500', },
    username: { fontSize: 24, color: '#0F172A', fontWeight: '700', marginTop: 2, },
    notificationButton: { padding: 6, },
    notificationIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', position: 'relative', borderWidth: 1, borderColor: '#E2E8F0', },
    notificationDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 2, borderColor: '#FFFFFF', },
    scrollView: { flex: 1, backgroundColor: '#F8FAFC', },
    section: { paddingHorizontal: 20, marginBottom: 24, },
    sectionDivider: { height: 8, backgroundColor: '#F1F5F9', marginHorizontal: 0, marginBottom: 24, },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4, },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A', },
    viewAllButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F4F3FF', borderRadius: 20, borderWidth: 1, borderColor: '#E9E7FF', },
    viewAllText: { fontSize: 13, color: '#8B5CF6', fontWeight: '600', marginRight: 4, },
    summaryCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 1, shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4, borderWidth: 2, borderColor: '#8B5CF6', },
    summaryContent: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 20, },
    summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, },
    summaryTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', flex: 1, },
    statusIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#BBF7D0', marginLeft: 12, },
    statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 4, },
    statusText: { fontSize: 11, color: '#059669', fontWeight: '600', },
    summaryDescription: { fontSize: 14, color: '#64748B', lineHeight: 20, fontWeight: '400', },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6, },
    statCardContainer: { width: '50%', paddingHorizontal: 6, marginBottom: 12, },
    largeCardContainer: { width: '50%', },
    statCard: { backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 20, minHeight: 120, shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3, borderWidth: 1, borderColor: '#F1F5F9', },
    largeCard: { minHeight: 130, paddingHorizontal: 18, paddingVertical: 22, },
    cardHeader: { marginBottom: 16, },
    iconContainer: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2, },
    largeIconContainer: { width: 44, height: 44, borderRadius: 14, },
    cardContent: { flex: 1, justifyContent: 'center', },
    statValue: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 4, },
    largeStatValue: { fontSize: 28, marginBottom: 6, },
    statLabel: { fontSize: 13, color: '#64748B', fontWeight: '600', lineHeight: 16, },
    largeStatLabel: { fontSize: 14, lineHeight: 18, },
    actionsContainer: { gap: 10, },
    actionButton: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 18, flexDirection: 'row', alignItems: 'center', shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9', },
    primaryActionButton: { backgroundColor: '#8B5CF6', shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 6, borderColor: '#8B5CF6', },
    actionIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F4F3FF', justifyContent: 'center', alignItems: 'center', marginRight: 14, },
    primaryActionIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center', marginRight: 14, },
    actionContent: { flex: 1, },
    actionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 2, },
    primaryActionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', },
    actionSubtitle: { fontSize: 13, color: '#64748B', lineHeight: 16, fontWeight: '500', },
    primaryActionSubtitle: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 13, fontWeight: '500', },
    bottomSpacing: { height: 40, },
});

export default DashboardScreen;