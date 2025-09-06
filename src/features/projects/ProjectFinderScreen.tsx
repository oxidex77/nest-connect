import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text, Appbar, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../navigation/AppNavigator';

// --- FULL IMPLEMENTATION OF REUSABLE COMPONENTS ---

const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionTitle}>{title}</Text>
);

const ButtonSelector = ({ options, selectedValue, onSelect, multiSelect = false }: {
    options: string[];
    selectedValue: string | string[];
    onSelect: (value: string | string[]) => void;
    multiSelect?: boolean;
}) => {
    const handleSelect = (option: string) => {
        if (multiSelect) {
            const currentValues = Array.isArray(selectedValue) ? selectedValue : [];
            const newValues = currentValues.includes(option) ? currentValues.filter(v => v !== option) : [...currentValues, option];
            onSelect(newValues);
        } else {
            onSelect(option);
        }
    };
    const isSelected = (option: string) => multiSelect ? Array.isArray(selectedValue) && selectedValue.includes(option) : selectedValue === option;
    return (
        <View style={styles.buttonSelectorContainer}>
            {options.map(option => (
                <TouchableOpacity
                    key={option}
                    style={[styles.selectorButton, isSelected(option) && styles.selectorButtonActive]}
                    onPress={() => handleSelect(option)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.selectorButtonText, isSelected(option) && styles.selectorButtonTextActive]}>
                        {option}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

// --- MAIN COMPONENT ---

const ProjectFinderScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [requirements, setRequirements] = useState({
        location: '',
        budgetMin: '',
        budgetMax: '',
        configurations: [] as string[], // Initialize as empty array
        possession: '',
        amenity: '',
    });

    const handleInputChange = useCallback((field: keyof typeof requirements, value: any) => {
        setRequirements(prev => ({ ...prev, [field]: value }));
    }, []);
    
    const handleSearch = () => {
        navigation.navigate('ProjectComparisonDeck', { requirements });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="#1F2937" />
                <Appbar.Content title="Find & Compare Projects" titleStyle={styles.appbarTitle} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.headerText}>Enter client requirements to find the best matching projects.</Text>

                <View style={styles.formSection}>
                    <SectionHeader title="Location" />
                    <TextInput label="City or Area (e.g., Mira Road)" mode="outlined" style={styles.input} outlineStyle={styles.inputOutline} />
                </View>

                <View style={styles.formSection}>
                    <SectionHeader title="Budget" />
                    <View style={styles.inputRow}>
                        <TextInput label="Min Budget (e.g., 80L)" mode="outlined" style={styles.inputHalf} outlineStyle={styles.inputOutline} />
                        <TextInput label="Max Budget (e.g., 1.2Cr)" mode="outlined" style={styles.inputHalf} outlineStyle={styles.inputOutline} />
                    </View>
                </View>

                <View style={styles.formSection}>
                    <SectionHeader title="Configuration" />
                    {/* THE FIX: Explicitly type 'val' as a string array */}
                    <ButtonSelector
                        options={['1 BHK', '2 BHK', '3 BHK', '4+ BHK']}
                        selectedValue={requirements.configurations}
                        onSelect={(val: string | string[]) => handleInputChange('configurations', val)}
                        multiSelect
                    />
                </View>

                <View style={styles.formSection}>
                    <SectionHeader title="Preferred Possession" />
                    {/* THE FIX: Explicitly type 'val' as a string */}
                    <ButtonSelector
                        options={['Ready', 'Up to 1 Year', '1-2 Years', '2+ Years']}
                        selectedValue={requirements.possession}
                        onSelect={(val: string | string[]) => handleInputChange('possession', val as string)}
                    />
                </View>

                <Button mode="contained" onPress={handleSearch} style={styles.submitButton} contentStyle={styles.submitButtonContent}>
                    Show Matching Projects
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    appbar: { backgroundColor: '#FFFFFF' },
    appbarTitle: { fontWeight: 'bold', color: '#111827' },
    scrollView: { padding: 20 },
    headerText: { fontSize: 16, color: '#6B7280', marginBottom: 24, lineHeight: 24 },
    formSection: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 12 },
    input: { backgroundColor: '#F9FAFB' },
    inputOutline: { borderRadius: 12, borderColor: '#D1D5DB' },
    inputRow: { flexDirection: 'row', gap: 12 },
    inputHalf: { flex: 1, backgroundColor: '#F9FAFB' },
    submitButton: { backgroundColor: '#4F46E5', borderRadius: 12, marginTop: 16 },
    submitButtonContent: { paddingVertical: 8 },
    buttonSelectorContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    selectorButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1.5, borderColor: '#D1D5DB', backgroundColor: '#FFFFFF' },
    selectorButtonActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
    selectorButtonText: { fontSize: 14, fontWeight: '500', color: '#374151' },
    selectorButtonTextActive: { color: '#FFFFFF' },
});

export default ProjectFinderScreen;