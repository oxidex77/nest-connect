import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Text, Appbar } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../navigation/AppNavigator';

const CATEGORIES = [
    { id: 'RESIDENTIAL_SALE', title: 'Residential Sale', icon: 'home-city-outline', group: 'Residential', color: '#10B981' },
    { id: 'RESIDENTIAL_RENTAL', title: 'Residential Rental', icon: 'home-account', group: 'Residential', color: '#3B82F6' },
    { id: 'COMMERCIAL_SALE', title: 'Commercial Sale', icon: 'office-building-outline', group: 'Commercial', color: '#F59E0B' },
    { id: 'COMMERCIAL_RENTAL', title: 'Commercial Rental', icon: 'storefront-outline', group: 'Commercial', color: '#EF4444' },
    { id: 'PLOT', title: 'Plot / Land', icon: 'image-filter-hdr', group: 'Land', color: '#84CC16' },
    { id: 'NEW_PROJECT', title: 'New Project', icon: 'rocket-launch-outline', group: 'Projects', color: '#8B5CF6' },
];

const CategoryButton = ({ icon, title, color, onPress }: {
    icon: string; title: string; color: string; onPress: () => void;
}) => (
    <TouchableOpacity style={styles.buttonOuterContainer} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.buttonInnerContainer}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                <Icon name={icon} size={32} color={color} />
            </View>
            <Text style={styles.buttonTitle} numberOfLines={2}>{title}</Text>
        </View>
    </TouchableOpacity>
);

const CategorySelectionScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'CategorySelection'>>();
    const { flow } = route.params;
    const screenTitle = flow === 'requirement' ? 'Add New Requirement' : 'List New Property';

    const handleCategorySelect = (categoryId: string) => {
        switch (categoryId) {
            case 'RESIDENTIAL_SALE':
                navigation.navigate('ResidentialSaleForm', { flow });
                break;
            // Add cases for other forms as they are built
            default:
                alert(`Form for '${categoryId}' is coming soon!`);
                break;
        }
    };

    const groupedCategories = CATEGORIES.reduce((acc, category) => {
        (acc[category.group] = acc[category.group] || []).push(category);
        return acc;
    }, {} as Record<string, typeof CATEGORIES>);

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header elevated style={{ backgroundColor: '#FFFFFF' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={screenTitle} titleStyle={styles.appbarTitle} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.headerText}>Choose the category for the {flow} you want to add.</Text>
                {Object.entries(groupedCategories).map(([groupName, items]) => (
                    <View key={groupName} style={styles.groupContainer}>
                        <Text style={styles.groupTitle}>{groupName}</Text>
                        <View style={styles.buttonsGrid}>
                            {items.map(item => (
                                <CategoryButton
                                    key={item.id}
                                    icon={item.icon}
                                    title={item.title}
                                    color={item.color}
                                    onPress={() => handleCategorySelect(item.id)}
                                />
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    appbarTitle: { fontWeight: 'bold', color: '#1F2937' },
    scrollView: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 16 },
    headerText: { fontSize: 16, color: '#6B7280', marginBottom: 24, paddingHorizontal: 8, lineHeight: 24 },
    groupContainer: { marginBottom: 32 },
    groupTitle: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 16, paddingHorizontal: 8 },
    buttonsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 },
    buttonOuterContainer: { width: '50%', padding: 8 },
    buttonInnerContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#4B5563',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
        height: 150,
        justifyContent: 'center',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    buttonTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        textAlign: 'center',
        lineHeight: 18,
    },
});

export default CategorySelectionScreen;