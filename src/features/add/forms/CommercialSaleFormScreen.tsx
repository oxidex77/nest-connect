import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Text, Appbar, TextInput, Button, Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { addProperty } from '../../../services/api';

// --- Reusable Sub-Components ---
const SectionHeader = ({ title, icon }: { title: string; icon: string; }) => (
    <View style={styles.sectionHeaderContainer}>
        <View style={styles.sectionIconContainer}><Icon name={icon} size={20} color="#4F46E5" /></View>
        <Text style={styles.sectionTitle}>{title}</Text>
    </View>
);

const ButtonSelector = ({ options, selectedValue, onSelect, multiSelect = false }: {
    options: string[]; selectedValue: string | string[]; onSelect: (value: any) => void; multiSelect?: boolean;
}) => {
    const handlePress = (option: string) => {
        if (multiSelect) {
            const newSelection = Array.isArray(selectedValue) ? [...selectedValue] : [];
            const index = newSelection.indexOf(option);
            if (index > -1) newSelection.splice(index, 1);
            else newSelection.push(option);
            onSelect(newSelection);
        } else {
            onSelect(option);
        }
    };
    return (
        <View style={styles.buttonSelectorContainer}>
            {options.map(option => {
                const isSelected = multiSelect ? selectedValue.includes(option) : selectedValue === option;
                return (
                    <TouchableOpacity key={option} style={[styles.selectorButton, isSelected && styles.selectorButtonActive]} onPress={() => handlePress(option)}>
                        <Text style={[styles.selectorButtonText, isSelected && styles.selectorButtonTextActive]}>{option}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

// --- Data Constants & Main Component ---
const SHOP_BEST_FOR = ['Medical', 'Salon', 'Grocery', 'Restaurant', 'Cafe'];
const OFFICE_BEST_FOR = ['Lawyer Office', 'CA Office', 'Call Center', 'IT Office'];
const defaultFormState = { carpetArea: '', price: '', bestFor: [], bathroomAvailable: 'No', furnishing: 'unfurnished', seaters: '' };

const CommercialSaleFormScreen = () => {
    const navigation = useNavigation();
    const [propertyType, setPropertyType] = useState<'Shop' | 'Office Space' | ''>('');
    const [formData, setFormData] = useState(defaultFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = useCallback((field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const resetForm = () => setFormData(defaultFormState);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');
        try {
            if (!propertyType || !formData.carpetArea || !formData.price) {
                throw new Error('Please fill Property Type, Area, and Price.');
            }

            // Combine specific details into a rich description
            let description = `A prime commercial ${propertyType}.`;
            if(propertyType === 'Office Space') {
                description += ` Accommodates up to ${formData.seaters} seaters. Status: ${formData.furnishing}.`;
            }
            if(formData.bestFor.length > 0) {
                description += ` Ideally suited for: ${formData.bestFor.join(', ')}.`;
            }

            const propertyData = {
                title: `Commercial ${propertyType} for Sale`,
                description,
                purpose: 'sale',
                propertyType: propertyType,
                price: { value: parseFloat(formData.price) },
                features: {
                    areaSqft: parseFloat(formData.carpetArea),
                    furnishing: formData.furnishing,
                },
                location: { address: 'TBD', city: 'TBD', state: 'TBD' }, // Placeholder
            };

            await addProperty(propertyData);
            Alert.alert("Success!", `Your ${propertyType} has been listed.`, [{ text: "OK", onPress: () => navigation.goBack() }]);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderShopFields = () => (
        <>
            <View style={styles.formSection}>
                <SectionHeader title="Shop Details" icon="storefront-outline" />
                <TextInput label="Carpet Area (sqft) *" mode="outlined" keyboardType="numeric" value={formData.carpetArea} onChangeText={val => handleInputChange('carpetArea', val)} style={styles.input} />
                <Text style={styles.fieldLabel}>Private Bathroom Available?</Text>
                <ButtonSelector options={['Yes', 'No']} selectedValue={formData.bathroomAvailable} onSelect={val => handleInputChange('bathroomAvailable', val)} />
            </View>
            <View style={styles.formSection}>
                <SectionHeader title="Best Suited For" icon="tag-heart-outline" />
                <ButtonSelector options={SHOP_BEST_FOR} selectedValue={formData.bestFor} onSelect={val => handleInputChange('bestFor', val)} multiSelect />
            </View>
        </>
    );

    const renderOfficeFields = () => (
         <>
            <View style={styles.formSection}>
                <SectionHeader title="Office Details" icon="office-building-outline" />
                <TextInput label="Carpet Area (sqft) *" mode="outlined" keyboardType="numeric" value={formData.carpetArea} onChangeText={val => handleInputChange('carpetArea', val)} style={styles.input} />
                <TextInput label="Number of Seaters" mode="outlined" keyboardType="numeric" value={formData.seaters} onChangeText={val => handleInputChange('seaters', val)} style={styles.input} />
                <Text style={styles.fieldLabel}>Furnishing Status</Text>
                <ButtonSelector options={['furnished', 'semi-furnished', 'unfurnished']} selectedValue={formData.furnishing} onSelect={val => handleInputChange('furnishing', val)} />
            </View>
             <View style={styles.formSection}>
                <SectionHeader title="Best Suited For" icon="tag-heart-outline" />
                <ButtonSelector options={OFFICE_BEST_FOR} selectedValue={formData.bestFor} onSelect={val => handleInputChange('bestFor', val)} multiSelect />
            </View>
        </>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header elevated style={{ backgroundColor: '#FFF' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="List a Commercial Property" />
            </Appbar.Header>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollView}>
                <View style={styles.formSection}>
                    <SectionHeader title="Select Property Type" icon="tag-outline" />
                    <ButtonSelector options={['Shop', 'Office Space']} selectedValue={propertyType} onSelect={(val) => { setPropertyType(val as any); resetForm(); }} />
                </View>

                {propertyType === 'Shop' && renderShopFields()}
                {propertyType === 'Office Space' && renderOfficeFields()}
                
                {propertyType && (
                    <>
                        <View style={styles.formSection}>
                            <SectionHeader title="Pricing" icon="cash-multiple" />
                            <TextInput label="Total Expected Price (₹) *" mode="outlined" keyboardType="numeric" value={formData.price} onChangeText={val => handleInputChange('price', val)} style={styles.input}/>
                        </View>
                        <Button mode="contained" onPress={handleSubmit} loading={isSubmitting} disabled={isSubmitting} style={styles.submitButton}>Submit Listing</Button>
                    </>
                )}
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
    input: { backgroundColor: '#F9FAFB', marginTop: 8 },
    submitButton: { borderRadius: 12, marginTop: 8, paddingVertical: 8 },
});

export default CommercialSaleFormScreen;