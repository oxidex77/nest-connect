import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { FAB, Portal, Modal, PaperProvider, Button, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';

// --- Screen Imports ---
import DashboardScreen from '../features/dashboard/DashboardScreen';
import MyRequirementsScreen from '../features/requirements/MyRequirementsScreen';
import RequirementMatchesScreen from '../features/requirements/RequirementMatchesScreen';

const { width } = Dimensions.get('window');

// --- TYPE DEFINITIONS for NAVIGATORS ---
export type RequirementsStackParamList = {
  MyRequirements: undefined;
  RequirementMatches: { requirementId: string; requirementName: string; };
};

export type ListingsStackParamList = {
  MyListings: undefined;
  ListingMatches: { listingId: string; };
};

// --- Create Typed Stack Navigators ---
const RequirementsStackNav = createStackNavigator<RequirementsStackParamList>();
const ListingsStackNav = createStackNavigator<ListingsStackParamList>();

// --- STACK COMPONENTS ---
const RequirementsStack = () => (
  <RequirementsStackNav.Navigator screenOptions={{ headerShown: false }}>
    <RequirementsStackNav.Screen name="MyRequirements" component={MyRequirementsScreen} />
    <RequirementsStackNav.Screen name="RequirementMatches" component={RequirementMatchesScreen} />
  </RequirementsStackNav.Navigator>
);

const ListingsStack = () => {
  const MyListingsScreen = () => (
    <View style={styles.placeholderContainer}>
      <View style={styles.placeholderContent}>
        <View style={styles.placeholderIcon}>
          <Icon name="home-group" size={48} color="#8B5CF6" />
        </View>
        <Text style={styles.placeholderTitle}>My Listing</Text>
        <Text style={styles.placeholderSubtitle}>
          Manage and showcase your property portfolio with detailed listings and analytics
        </Text>
        <TouchableOpacity style={styles.comingSoonButton}>
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ListingsStackNav.Navigator screenOptions={{ headerShown: false }}>
      <ListingsStackNav.Screen name="MyListings" component={MyListingsScreen} />
    </ListingsStackNav.Navigator>
  );
};

// Custom Tab Bar Component with proper typing
const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.tabBarContainer}>
      {/* Background with blur effect for iOS, solid for Android */}
      {Platform.OS === 'ios' ? (
        <BlurView 
          style={styles.tabBarBlur} 
          intensity={80}
          tint="light"
        />
      ) : (
        <View style={styles.tabBarBackground} />
      )}
      
      <View style={styles.tabBarContent}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;
          const isFocused = state.index === index;

          // Skip rendering the middle FAB tab
          if (route.name === 'AddAction') return null;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Get icon name based on route with proper typing
          const getIconName = (routeName: string, focused: boolean): string => {
            const icons: Record<string, string> = {
              Home: focused ? 'view-dashboard' : 'view-dashboard-outline',
              RequirementsTab: focused ? 'clipboard-list' : 'clipboard-list-outline',
              ListingsTab: focused ? 'home-group' : 'home-group',
              Profile: focused ? 'account-circle' : 'account-circle-outline',
            };
            return icons[routeName] || 'circle';
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              style={[
                styles.tabButton,
                isFocused && styles.tabButtonActive
              ]}
              activeOpacity={0.7}
            >
              <View style={[
                styles.tabIconContainer,
                isFocused && styles.tabIconContainerActive
              ]}>
                <Icon 
                  name={getIconName(route.name, isFocused)} 
                  size={22} 
                  color={isFocused ? '#FFFFFF' : '#64748B'} 
                />
              </View>
              <Text style={[
                styles.tabLabel,
                isFocused && styles.tabLabelActive
              ]}>
                {typeof label === 'string' ? label : route.name}
              </Text>
              {isFocused && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Modern FAB Component with proper typing
interface ModernFABProps {
  onPress: () => void;
}

const ModernFAB = ({ onPress }: ModernFABProps) => {
  return (
    <View style={styles.fabContainer}>
      <TouchableOpacity 
        style={styles.fab}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.fabGradient}>
          <Icon name="plus" size={28} color="#FFFFFF" />
        </View>
        {/* Pulse animation rings */}
        <View style={[styles.pulseRing, styles.pulseRing1]} />
        <View style={[styles.pulseRing, styles.pulseRing2]} />
      </TouchableOpacity>
    </View>
  );
};

// Enhanced Modal Component with proper typing
interface AddActionModalProps {
  visible: boolean;
  onDismiss: () => void;
  navigation: any; // You can make this more specific based on your navigation type
}

const AddActionModal = ({ visible, onDismiss, navigation }: AddActionModalProps) => {
  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <View style={styles.modalDragIndicator} />
          <Text style={styles.modalTitle}>Quick Actions</Text>
          <Text style={styles.modalSubtitle}>What would you like to add today?</Text>
        </View>
        
        <View style={styles.modalActions}>
          <TouchableOpacity 
            style={[styles.actionCard, styles.primaryActionCard]}
            onPress={() => {
              onDismiss();
              // Navigate to Add Requirement
              // navigation.navigate('CategorySelection', { flow: 'requirement' });
            }}
            activeOpacity={0.9}
          >
            <View style={styles.actionCardIcon}>
              <Icon name="clipboard-plus" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.actionCardContent}>
              <Text style={styles.actionCardTitle}>Add Requirement</Text>
              <Text style={styles.actionCardSubtitle}>Create a new client requirement profile</Text>
            </View>
            <Icon name="arrow-right" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => {
              onDismiss();
              // Navigate to Add Listing
              // navigation.navigate('CategorySelection', { flow: 'listing' });
            }}
            activeOpacity={0.9}
          >
            <View style={[styles.actionCardIcon, styles.secondaryActionIcon]}>
              <Icon name="home-plus" size={24} color="#8B5CF6" />
            </View>
            <View style={styles.actionCardContent}>
              <Text style={[styles.actionCardTitle, styles.secondaryActionTitle]}>List Property</Text>
              <Text style={styles.actionCardSubtitle}>Add a new property to your portfolio</Text>
            </View>
            <Icon name="arrow-right" size={20} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Profile Placeholder Component
const ProfileScreen = () => (
  <View style={styles.placeholderContainer}>
    <View style={styles.placeholderContent}>
      <View style={styles.placeholderIcon}>
        <Icon name="account-circle" size={48} color="#8B5CF6" />
      </View>
      <Text style={styles.placeholderTitle}>Profile Settings</Text>
      <Text style={styles.placeholderSubtitle}>
        Manage your account, preferences, and view your activity history
      </Text>
      <TouchableOpacity style={styles.comingSoonButton}>
        <Text style={styles.comingSoonText}>Coming Soon</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// --- Main Bottom Tab Navigator ---
const Tab = createBottomTabNavigator();
const PlaceholderComponent = () => <View />;

export default function AppBottomNavigator() {
  const [isModalVisible, setModalVisible] = React.useState(false);
  const navigation = useNavigation();

  return (
    <PaperProvider>
      <Portal>
        <AddActionModal 
          visible={isModalVisible}
          onDismiss={() => setModalVisible(false)}
          navigation={navigation}
        />
      </Portal>

      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => (
          <>
            <CustomTabBar {...props} />
            <ModernFAB onPress={() => setModalVisible(true)} />
          </>
        )}
      >
        <Tab.Screen
          name="Home"
          component={DashboardScreen}
          options={{ tabBarLabel: 'Home' }}
        />
        <Tab.Screen
          name="RequirementsTab"
          component={RequirementsStack}
          options={{ tabBarLabel: 'Requirements' }}
        />
        <Tab.Screen
          name="AddAction"
          component={PlaceholderComponent}
          options={{ tabBarLabel: '' }}
        />
        <Tab.Screen
          name="ListingsTab"
          component={ListingsStack}
          options={{ tabBarLabel: 'Listings' }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ tabBarLabel: 'Profile' }}
        />
      </Tab.Navigator>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  // Tab Bar Styles
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    paddingBottom: Platform.OS === 'ios' ? 34 : 10,
  },
  tabBarBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  tabBarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  tabBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  tabButtonActive: {
    // Additional styling for active state if needed
  },
  tabIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginBottom: 4,
  },
  tabIconContainerActive: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  tabLabelActive: {
    color: '#8B5CF6',
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#8B5CF6',
  },

  // FAB Styles
  fabContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 85 : 75,
    left: width / 2 - 28,
    zIndex: 10,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  pulseRing: {
    position: 'absolute',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  pulseRing1: {
    width: 70,
    height: 70,
    top: -7,
    left: -7,
  },
  pulseRing2: {
    width: 84,
    height: 84,
    top: -14,
    left: -14,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },

  // Modal Styles
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '50%',
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  modalDragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalActions: {
    paddingHorizontal: 24,
    gap: 12,
  },

  // Action Card Styles
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryActionCard: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.2,
  },
  actionCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  secondaryActionIcon: {
    backgroundColor: '#F4F3FF',
  },
  actionCardContent: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  secondaryActionTitle: {
    color: '#0F172A',
  },
  actionCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },

  // Placeholder Styles
  placeholderContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  placeholderContent: {
    alignItems: 'center',
    maxWidth: 280,
  },
  placeholderIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F4F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E9E7FF',
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
  },
  placeholderSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  comingSoonButton: {
    backgroundColor: '#F4F3FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9E7FF',
  },
  comingSoonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
});