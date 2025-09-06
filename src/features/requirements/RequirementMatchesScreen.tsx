import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ScrollView, SafeAreaView } from 'react-native';
import { Text, Appbar, Chip, useTheme } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchMatchesForRequirement, MatchedProperty } from '../../api/mockData';
import MatchCard from '../../components/MatchCard'; // Uses the new, beautiful card
import LoadingShimmer from '../../components/LoadingShimmer'; // Uses the new shimmer

const RequirementMatchesScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const theme = useTheme();
    const { requirementId, requirementName } = route.params;

    const [matches, setMatches] = useState<MatchedProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('Best Match');

    useEffect(() => {
        setLoading(true);
        fetchMatchesForRequirement(requirementId)
            .then(setMatches)
            .finally(() => setLoading(false));
    }, [requirementId]);
    
    const filters = ['Best Match', 'Price: Low to High', 'Newest First', 'Carpet Area'];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#F8F9FA' }]}>
            <Appbar.Header elevated={false} style={{ backgroundColor: '#F8F9FA' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={`Matches for '${requirementName}'`} titleStyle={{fontWeight: 'bold'}} />
            </Appbar.Header>

            <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
                    {filters.map(filter => (
                        <Chip
                            key={filter}
                            mode="flat"
                            selected={activeFilter === filter}
                            onPress={() => setActiveFilter(filter)}
                            style={[styles.chip, activeFilter === filter ? {backgroundColor: theme.colors.primary} : {backgroundColor: '#FFFFFF'}]}
                            textStyle={[styles.chipText, activeFilter === filter ? {color: '#FFFFFF'} : {color: '#4B5563'}]}
                        >
                            {filter}
                        </Chip>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <LoadingShimmer />
            ) : (
                <FlatList
                    data={matches}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => <MatchCard property={item} onPress={() => {/* Navigate to Property Details */}} />}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    filterContainer: { paddingHorizontal: 16, paddingVertical: 12 },
    chip: { marginRight: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
    chipText: { fontWeight: '500' },
    list: { paddingHorizontal: 16, paddingTop: 16 },
});

export default RequirementMatchesScreen;