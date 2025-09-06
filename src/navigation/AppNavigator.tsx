import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, NavigatorScreenParams } from '@react-navigation/native';
import { Portal, Modal, PaperProvider, Surface, FAB, Button, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// --- Screen Imports ---
import DashboardScreen from '../features/dashboard/DashboardScreen';
import MyRequirementsScreen from '../features/requirements/MyRequirementsScreen';
import RequirementMatchesScreen from '../features/requirements/RequirementMatchesScreen';
import CategorySelectionScreen from '../features/add/CategorySelectionScreen';
import ResidentialSaleFormScreen from '../features/add/forms/ResidentialSaleFormScreen';
import ResidentialRentalFormScreen from '../features/add/forms/ResidentialRentalFormScreen';
import CommercialSaleFormScreen from '../features/add/forms/CommercialSaleFormScreen';
import NewProjectFormScreen from '../features/add/forms/NewProjectFormScreen';
import ProjectFinderScreen from '../features/projects/ProjectFinderScreen';
import ProjectComparisonDeckScreen from '../features/projects/ProjectComparisonDeckScreen';
import BrokerSiteScreen from '../screens/broker-site/BrokerSiteScreen';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isTablet = width > 768;

// Enhanced color palette
const colors = {
  primary: '#6366F1', // Modern indigo
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',
  secondary: '#F59E0B', // Amber accent
  background: '#FAFBFF',
  surface: '#FFFFFF',
  text: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  border: '#E2E8F0',
  shadow: '#0F172A',
  tabBarBackground: '#FFFFFF',
  fabShadow: 'rgba(99, 102, 241, 0.4)',
  cardBackground: '#F8FAFC',
  accent: '#8B5CF6',
};

// --- TYPE DEFINITIONS for ALL NAVIGATORS ---
export type RequirementsStackParamList = {
  MyRequirements: undefined;
  RequirementMatches: { requirementId: string; requirementName: string; };
};

export type ListingsStackParamList = {
  MyListings: undefined;
  ListingMatches: { listingId: string; };
};

export type MainTabsParamList = {
  Home: undefined;
  RequirementsTab: undefined;
  BrokerSiteScreen: undefined
  AddAction: undefined;
  ListingsTab: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  CategorySelection: { flow: 'requirement' | 'listing' };
  ResidentialSaleForm: { flow: 'requirement' | 'listing' };
  ResidentialRentalForm: { flow: 'requirement' | 'listing' };
  CommercialSaleForm: { flow: 'requirement' | 'listing' };
  NewProjectForm: undefined;
  ProjectFinder: undefined;
  ProjectComparisonDeck: { requirements: any };
};

// --- Create Typed Navigators ---
const RequirementsStackNav = createStackNavigator<RequirementsStackParamList>();
const ListingsStackNav = createStackNavigator<ListingsStackParamList>();
const RootStack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

// --- Stack Components ---
const RequirementsStack = () => (
  <RequirementsStackNav.Navigator screenOptions={{ headerShown: false }}>
    <RequirementsStackNav.Screen name="MyRequirements" component={MyRequirementsScreen} />
    <RequirementsStackNav.Screen name="RequirementMatches" component={RequirementMatchesScreen} />
  </RequirementsStackNav.Navigator>
);

const ListingsStack = () => {
  const MyListingsScreen = () => (
    <SafeAreaView style={styles.placeholderContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.placeholderContent}>
        <View style={[styles.placeholderIconContainer, { backgroundColor: colors.primary }]}>
          <Icon name="office-building-outline" size={40} color="#FFFFFF" />
        </View>
        <Text style={styles.placeholderTitle}>My Listings</Text>
        <Text style={styles.placeholderSubtitle}>
          Manage your property portfolio and track performance
        </Text>
        <View style={styles.comingSoonContainer}>
          <View style={styles.comingSoonChip}>
            <Icon name="rocket-launch-outline" size={16} color={colors.primary} />
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );

  return (
    <ListingsStackNav.Navigator screenOptions={{ headerShown: false }}>
      <ListingsStackNav.Screen name="MyListings" component={MyListingsScreen} />
    </ListingsStackNav.Navigator>
  );
};

// Enhanced Tab Bar Component
const EnhancedTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const [scaleAnims] = React.useState(
    state.routes.map(() => new Animated.Value(1))
  );
  const [translateAnims] = React.useState(
    state.routes.map(() => new Animated.Value(0))
  );

  const animatePress = (index: number) => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnims[index], {
          toValue: 0.85,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnims[index], {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(translateAnims[index], {
          toValue: -4,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnims[index], {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ])
    ]).start();
  };

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBarGradient}>
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            // Skip the middle FAB tab
            if (route.name === 'AddAction') {
              return <View key={index} style={styles.tabItemContainer} />;
            }

            const onPress = () => {
              animatePress(index);
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            // Enhanced icon mapping with outlined versions for inactive state
            const getIcon = (routeName: string, focused: boolean) => {
              const icons: Record<string, { active: string; inactive: string }> = {
                Home: { active: 'home', inactive: 'home-outline' },
                RequirementsTab: { active: 'clipboard-text', inactive: 'clipboard-text-outline' },
                ListingsTab: { active: 'office-building', inactive: 'office-building-outline' },
                Profile: { active: 'account-circle', inactive: 'account-circle-outline' },
              };
              const iconSet = icons[routeName] || { active: 'circle', inactive: 'circle-outline' };
              return focused ? iconSet.active : iconSet.inactive;
            };

            // Enhanced labels with better descriptions
            const getLabel = (routeName: string) => {
              const labels: Record<string, string> = {
                Home: 'Dashboard',
                RequirementsTab: 'Requirements',
                ListingsTab: 'Listings',
                Profile: 'Profile',
              };
              return labels[routeName] || routeName;
            };

            return (
              <Animated.View
                key={index}
                style={[
                  styles.tabItemContainer,
                  {
                    transform: [
                      { scale: scaleAnims[index] },
                      { translateY: translateAnims[index] }
                    ]
                  }
                ]}
              >
                <TouchableOpacity
                  onPress={onPress}
                  style={[
                    styles.tabItem,
                    isFocused && styles.tabItemFocused
                  ]}
                  activeOpacity={0.8}
                >
                  {isFocused && (
                    <View style={styles.tabItemBackground} />
                  )}
                  <View style={styles.tabIconContainer}>
                    <Icon
                      name={getIcon(route.name, isFocused)}
                      size={isSmallScreen ? 22 : 24}
                      color={isFocused ? '#FFFFFF' : colors.textLight}
                    />
                    {isFocused && <View style={styles.tabIndicator} />}
                  </View>
                  <Text style={[
                    styles.tabLabel,
                    {
                      color: isFocused ? '#FFFFFF' : colors.textSecondary,
                      fontWeight: isFocused ? '700' : '500'
                    }
                  ]}>
                    {getLabel(route.name)}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

// Enhanced Floating Action Button
interface EnhancedFABProps {
  onPress: () => void;
}

const EnhancedFAB = ({ onPress }: EnhancedFABProps) => {
  const [scaleAnim] = React.useState(new Animated.Value(1));
  const [rotateAnim] = React.useState(new Animated.Value(0));

  const animatePress = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      rotateAnim.setValue(0);
    });
  };

  const handlePress = () => {
    animatePress();
    onPress();
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={styles.fabContainer}>
      <Animated.View
        style={[
          styles.fabWrapper,
          {
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.fabTouchable}
          onPress={handlePress}
          activeOpacity={0.9}
        >
          <View style={styles.fab}>
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <Icon name="plus" size={28} color="#FFFFFF" />
            </Animated.View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

// Enhanced Modal Component
interface EnhancedModalProps {
  visible: boolean;
  onDismiss: () => void;
  navigation: StackNavigationProp<RootStackParamList>;
}

const EnhancedModal = ({ visible, onDismiss, navigation }: EnhancedModalProps) => {
  const [slideAnim] = React.useState(new Animated.Value(300));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={styles.modalContainer}
    >
      <Animated.View style={[
        styles.modalWrapper,
        { transform: [{ translateY: slideAnim }] }
      ]}>
        <View style={styles.modalSurface}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Quick Actions</Text>
            <Text style={styles.modalSubtitle}>
              Choose what you'd like to add to your portfolio
            </Text>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              onPress={() => {
                onDismiss();
                navigation.navigate('CategorySelection', { flow: 'requirement' });
              }}
              style={styles.modalActionItem}
            >
              <View style={styles.primaryButton}>
                <View style={styles.buttonIconContainer}>
                  <Icon name="clipboard-plus-outline" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.buttonTitle}>Add Requirement</Text>
                  <Text style={styles.buttonSubtitle}>Find matching properties</Text>
                </View>
                <Icon name="arrow-right" size={20} color="rgba(255,255,255,0.8)" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onDismiss();
                navigation.navigate('CategorySelection', { flow: 'listing' });
              }}
              style={styles.modalActionItem}
            >
              <View style={styles.secondaryButton}>
                <View style={[styles.buttonIconContainer, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
                  <Icon name="home-plus-outline" size={24} color={colors.primary} />
                </View>
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.secondaryButtonTitle}>List Property</Text>
                  <Text style={styles.secondaryButtonSubtitle}>Add to inventory</Text>
                </View>
                <Icon name="arrow-right" size={20} color={colors.textLight} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

// Enhanced Profile Screen
const ProfileScreen = () => (
  <SafeAreaView style={styles.placeholderContainer}>
    <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
    <View style={styles.placeholderContent}>
      <View style={[styles.placeholderIconContainer, { backgroundColor: colors.success }]}>
        <Icon name="account-outline" size={40} color="#FFFFFF" />
      </View>
      <Text style={styles.placeholderTitle}>Profile & Settings</Text>
      <Text style={styles.placeholderSubtitle}>
        Manage your account, preferences, and broker settings
      </Text>
      <View style={styles.comingSoonContainer}>
        <View style={styles.comingSoonChip}>
          <Icon name="rocket-launch-outline" size={16} color={colors.primary} />
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
      </View>
    </View>
  </SafeAreaView>
);

// Main Tabs Component
const MainTabs = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isModalVisible, setModalVisible] = React.useState(false);

  return (
    <PaperProvider>
      <Portal>
        <EnhancedModal
          visible={isModalVisible}
          onDismiss={() => setModalVisible(false)}
          navigation={navigation}
        />
      </Portal>

      <View style={styles.container}>
        <Tab.Navigator
          screenOptions={{ headerShown: false }}
          tabBar={(props) => (
            <View style={styles.tabBarWrapper}>
              <EnhancedFAB onPress={() => setModalVisible(true)} />
              <EnhancedTabBar {...props} />
            </View>
          )}
        >
          <Tab.Screen name="Home" component={DashboardScreen} />
          <Tab.Screen name="RequirementsTab" component={RequirementsStack} />
          <Tab.Screen name="BrokerSiteScreen" component={BrokerSiteScreen} />
          <Tab.Screen
            name="AddAction"
            component={() => <View />}
            listeners={{ tabPress: e => e.preventDefault() }}
          />
          <Tab.Screen name="ListingsTab" component={ListingsStack} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </View>
    </PaperProvider>
  );
};

// --- FINAL EXPORTED NAVIGATOR ---
export default function AppNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabs" component={MainTabs} />
      <RootStack.Screen name="CategorySelection" component={CategorySelectionScreen} />
      <RootStack.Screen name="ResidentialSaleForm" component={ResidentialSaleFormScreen} />
      <RootStack.Screen name="CommercialSaleForm" component={CommercialSaleFormScreen} />
      <RootStack.Screen name="NewProjectForm" component={NewProjectFormScreen} />
      <RootStack.Screen name="ProjectFinder" component={ProjectFinderScreen} />
      <RootStack.Screen name="ProjectComparisonDeck" component={ProjectComparisonDeckScreen} />
    </RootStack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // --- Enhanced Tab Bar Styles ---
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
  },
  tabBarContainer: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  },
  tabBarGradient: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.tabBarBackground,
  },
  tabBar: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 85 : 70,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingTop: 8,
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
  },
  tabItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    minHeight: 56,
    position: 'relative',
  },
  tabItemFocused: {
    transform: [{ translateY: -2 }],
  },
  tabItemBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tabIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  tabLabel: {
    fontSize: isSmallScreen ? 11 : 12,
    lineHeight: 16,
    fontWeight: '500',
    textAlign: 'center',
  },

  // --- Enhanced FAB Styles ---
  fabContainer: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
    bottom: Platform.OS === 'ios' ? 45 : 35,
  },
  fabWrapper: {
    shadowColor: colors.fabShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  fabTouchable: {
    borderRadius: 32,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: colors.secondary,
  },

  // --- Enhanced Modal Styles ---
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalWrapper: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  modalSurface: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 24,
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  modalHandle: {
    width: 48,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  modalActions: {
    paddingHorizontal: 28,
    gap: 16,
  },
  modalActionItem: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  buttonIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  secondaryButtonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  secondaryButtonSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // --- Enhanced Placeholder Screen Styles ---
  placeholderContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 120,
  },
  placeholderContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  placeholderIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  placeholderTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  placeholderSubtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 28,
    fontWeight: '500',
  },
  comingSoonContainer: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  comingSoonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 28,
    gap: 8,
    backgroundColor: '#F0F9FF',
  },
  comingSoonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
});