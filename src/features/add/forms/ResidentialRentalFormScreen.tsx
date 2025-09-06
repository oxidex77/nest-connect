import React from 'react';
import { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Text, Appbar, TextInput, Button, Snackbar, HelperText } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { RootStackParamList } from '../../../navigation/AppNavigator';
import { addProperty } from '../../../services/api';

// --- Reusable Sub-Components ---
const SectionHeader = ({ title, icon }: { title: string, icon: string }) => (
    <View style={styles.sectionHeaderContainer}>
        <View style={styles.sectionIconContainer}><Icon name={icon} size={20} color="#4F46E5" /></View>
        <Text style={styles.sectionTitle}>{title}</Text>
    </View>
);

const ButtonSelector = ({ options, selectedValue, onSelect }: { options: string[], selectedValue: string, onSelect: (value: string) => void }) => (
    <View style={styles.buttonSelectorContainer}>
        {options.map(option => (
            <TouchableOpacity key={option} style={[styles.selectorButton, selectedValue === option && styles.selectorButtonActive]} onPress={() => onSelect(option)} activeOpacity={0.7}>
                <Text style={[styles.selectorButtonText, selectedValue === option && styles.selectorButtonTextActive]}>{option}</Text>
            </TouchableOpacity>
        ))}
    </View>
);

// --- Main Form Component ---
const ResidentialRentalFormScreen = () => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        propertyType: 'Apartment',
        configuration: '1 BHK',
        floorNumber: '',
        totalFloors: '',
        monthlyRent: '',
        depositAmount: '',
        areaSqft: '',
        furnishing: 'unfurnished',
        bachelorsAllowed: 'No',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = useCallback((field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');
        try {
            // --- Validation ---
            if (!formData.monthlyRent || !formData.areaSqft || !formData.configuration) {
                throw new Error('Please fill all required fields: Rent, Area, and Configuration.');
            }

            // --- Data Transformation for API ---
            const propertyData = {
                title: `${formData.configuration} for Rent in [Location]`, // We'll add location later
                description: `This ${formData.propertyType} is available for rent. Security Deposit: ₹${formData.depositAmount}. Bachelors Allowed: ${formData.bachelorsAllowed}.`,
                purpose: 'rent',
                propertyType: formData.propertyType,
                price: {
                    value: parseFloat(formData.monthlyRent),
                    priceType: 'per_month',
                },
                features: {
                    bedrooms: parseInt(formData.configuration.charAt(0)),
                    areaSqft: parseFloat(formData.areaSqft),
                    furnishing: formData.furnishing,
                },
                location: { address: 'TBD', city: 'TBD', state: 'TBD' }, // Placeholder
            };

            await addProperty(propertyData);

            Alert.alert("Success!", "Your rental property has been listed.", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header elevated style={{ backgroundColor: '#FFF' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="List a Residential Rental" />
            </Appbar.Header>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
                <View style={styles.formSection}>
                    <SectionHeader title="Property Details" icon="home-account" />
                    <Text style={styles.fieldLabel}>Property Type</Text>
                    <ButtonSelector options={['Apartment', 'Row House', 'Bungalow']} selectedValue={formData.propertyType} onSelect={val => handleInputChange('propertyType', val)} />
                    <Text style={styles.fieldLabel}>Configuration</Text>
                    <ButtonSelector options={['1 BHK', '2 BHK', '3 BHK', '4+ BHK']} selectedValue={formData.configuration} onSelect={val => handleInputChange('configuration', val)} />
                </View>

                <View style={styles.formSection}>
                    <SectionHeader title="Rent & Deposit" icon="cash-multiple" />
                    <View style={styles.inputRow}>
                        <TextInput label="Monthly Rent (₹) *" mode="outlined" keyboardType="numeric" value={formData.monthlyRent} onChangeText={val => handleInputChange('monthlyRent', val)} style={styles.inputHalf} />
                        <TextInput label="Deposit Amount (₹)" mode="outlined" keyboardType="numeric" value={formData.depositAmount} onChangeText={val => handleInputChange('depositAmount', val)} style={styles.inputHalf} />
                    </View>
                </View>

                <View style={styles.formSection}>
                    <SectionHeader title="Area & Floor" icon="floor-plan" />
                     <TextInput label="Carpet Area (sq ft) *" mode="outlined" keyboardType="numeric" value={formData.areaSqft} onChangeText={val => handleInputChange('areaSqft', val)} style={styles.input} />
                    <View style={styles.inputRow}>
                        <TextInput label="Floor Number" mode="outlined" keyboardType="numeric" value={formData.floorNumber} onChangeText={val => handleInputChange('floorNumber', val)} style={styles.inputHalf} />
                        <TextInput label="Total Floors" mode="outlined" keyboardType="numeric" value={formData.totalFloors} onChangeText={val => handleInputChange('totalFloors', val)} style={styles.inputHalf} />
                    </View>
                </View>

                <View style={styles.formSection}>
                    <SectionHeader title="Furnishing & Rules" icon="lamp" />
                    <Text style={styles.fieldLabel}>Furnishing Status</Text>
                    <ButtonSelector options={['unfurnished', 'semi-furnished', 'furnished']} selectedValue={formData.furnishing} onSelect={val => handleInputChange('furnishing', val)} />
                    <Text style={styles.fieldLabel}>Bachelors Allowed?</Text>
                    <ButtonSelector options={['Yes', 'No']} selectedValue={formData.bachelorsAllowed} onSelect={val => handleInputChange('bachelorsAllowed', val)} />
                </View>

                <Button mode="contained" onPress={handleSubmit} loading={isSubmitting} disabled={isSubmitting} style={styles.submitButton}>
                    Submit Rental Listing
                </Button>
            </ScrollView>
            <Snackbar visible={!!error} onDismiss={() => setError('')} style={{backgroundColor: '#B91C1C'}}>
                {error}
            </Snackbar>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    scrollView: { padding: 16 },
    formSection: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F1F5F9' },
    sectionHeaderContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    sectionIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
    fieldLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 10, marginTop: 16 },
    buttonSelectorContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    selectorButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1.5, borderColor: '#D1D5DB' },
    selectorButtonActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
    selectorButtonText: { fontSize: 14, fontWeight: '500', color: '#374151', textTransform: 'capitalize' },
    selectorButtonTextActive: { color: '#FFFFFF' },
    inputRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
    inputHalf: { flex: 1, backgroundColor: '#F9FAFB' },
    input: { backgroundColor: '#F9FAFB', marginTop: 8 },
    submitButton: { borderRadius: 12, marginTop: 8, paddingVertical: 8 },
});

export default ResidentialRentalFormScreen;