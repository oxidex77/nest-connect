import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Appbar, Card, Title, ActivityIndicator, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Requirement, fetchMyRequirements } from '../../api/mockData';
import { RequirementsStackParamList } from '../../navigation/AppBottomNavigator';

// Type for the navigation prop, ensuring type safety when navigating.
type MyRequirementsNavigationProp = StackNavigationProp<RequirementsStackParamList, 'MyRequirements'>;

// A beautifully styled, reusable card for displaying a single requirement.
const RequirementCard = ({ item, onPress }: { item: Requirement; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress}>
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Title style={styles.cardTitle}>{item.name}</Title>
                    <View style={styles.matchChip}>
                        <Icon name="home-search-outline" size={16} color="#4F46E5" />
                        <Text style={styles.matchChipText}>{item.match_count} Matches</Text>
                    </View>
                </View>
                <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                        <Icon name="floor-plan" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{item.config}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Icon name="map-marker-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{item.location}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Icon name="cash" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>Up to {item.budget}</Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    </TouchableOpacity>
);

const MyRequirementsScreen = () => {
    const navigation = useNavigation<MyRequirementsNavigationProp>();
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadRequirements = useCallback(() => {
        setLoading(true);
        fetchMyRequirements()
            .then(setRequirements)
            .catch(error => console.error("Failed to fetch requirements:", error))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadRequirements();
    }, [loadRequirements]);

    // --- RENDER LOGIC ---

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} size="large" color="#4F46E5" />
                <Text style={styles.loadingText}>Loading Your Requirements...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header elevated={false} mode="center-aligned" style={{ backgroundColor: '#F8F9FA' }}>
                <Appbar.Content title="My Requirements" titleStyle={styles.appbarTitle} />
                <Appbar.Action icon="magnify" onPress={() => { /* Implement search */ }} />
            </Appbar.Header>

            {requirements.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="file-document-outline" size={80} color="#D1D5DB" />
                    <Text variant="titleMedium" style={styles.emptyTitle}>No Requirements Found</Text>
                    <Text style={styles.emptySubtitle}>Tap the button below to add your first property requirement.</Text>
                    <Button
                        icon="plus"
                        mode="contained"
                        style={styles.emptyButton}
                        onPress={() => { /* Navigate to Add Requirement screen */ }}
                    >
                        Add Requirement
                    </Button>
                </View>
            ) : (
                <FlatList
                    data={requirements}
                    renderItem={({ item }) => (
                        <RequirementCard
                            item={item}
                            onPress={() => navigation.navigate('RequirementMatches', { requirementId: item.id, requirementName: item.name })}
                        />
                    )}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={loadRequirements} colors={['#4F46E5']} />}
                    ListHeaderComponent={
                        <Text style={styles.headerText}>You have {requirements.length} active requirements.</Text>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    appbarTitle: {
        fontWeight: 'bold',
    },
    list: {
        paddingHorizontal: 16,
    },
    headerText: {
        fontSize: 16,
        color: '#6B7280',
        paddingHorizontal: 8,
        paddingBottom: 16,
    },
    // Card Styles
    card: {
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        elevation: 0, // Use border instead of elevation for a cleaner look
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontWeight: 'bold',
        color: '#1F2937',
    },
    matchChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEF2FF', // Light Indigo
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
    },
    matchChipText: {
        color: '#4338CA', // Darker Indigo
        fontWeight: '600',
        marginLeft: 6,
    },
    detailsContainer: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderColor: '#F3F4F6',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        marginLeft: 12,
        color: '#374151',
        fontSize: 14,
    },
    // Loading and Empty State Styles
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#6B7280',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#F8F9FA',
    },
    emptyTitle: {
        marginTop: 16,
        fontWeight: 'bold',
        color: '#1F2937'
    },
    emptySubtitle: {
        marginTop: 8,
        textAlign: 'center',
        color: '#6B7280',
        lineHeight: 20,
    },
    emptyButton: {
        marginTop: 24,
        backgroundColor: '#4F46E5',
        borderRadius: 12,
    }
});

export default MyRequirementsScreen;