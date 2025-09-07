import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { Text, Appbar, TextInput, Button, HelperText, Snackbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { addProperty, uploadImage } from '../../../services/api';

// --- Reusable Sub-Components ---
const SectionHeader = ({ title, icon }: { title: string, icon: string }) => (
    <View style={styles.sectionHeaderContainer}>
        <View style={styles.sectionIcon}><Icon name={icon} size={20} color="#4F46E5" /></View>
        <Text style={styles.sectionTitle}>{title}</Text>
    </View>
);
    const handleInputChange = <T extends keyof FormData>(
        section: T,
        field: keyof FormData[T],
        value: string
    ) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };
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

// --- Main Form Component ---
const ResidentialSaleFormScreen = () => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        propertyType: 'Apartment',
        location: { address: '', city: '', state: '', pincode: '' },
        price: { value: '' },
        features: { bedrooms: '', bathrooms: '', areaSqft: '', furnishing: 'unfurnished' },
        media: [] as { url: string, isPrimary: boolean }[],
    });
    const [localImages, setLocalImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (section: keyof typeof formData, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const pickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: 10 - localImages.length,
            quality: 0.7,
            base64: true, // Request base64 data for upload
        });

        if (!result.canceled) {
            uploadImages(result.assets);
        }
    };

    const uploadImages = async (assets: ImagePicker.ImagePickerAsset[]) => {
        setIsUploading(true);
        try {
            const uploadPromises = assets.map(asset => FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 }).then(base64 => uploadImage(base64)));
            const urls = await Promise.all(uploadPromises);
            
            setFormData(prev => ({
                ...prev,
                media: [
                    ...prev.media,
                    ...urls.map((url, index) => ({ url, isPrimary: prev.media.length === 0 && index === 0 }))
                ]
            }));
            setLocalImages(prev => [...prev, ...assets]);
        } catch (err: any) {
            setError('Failed to upload some images. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');
        try {
            // Basic Validation
            if (!formData.title || !formData.features.areaSqft || !formData.price.value) {
                throw new Error('Please fill in Title, Area, and Price.');
            }
            const submissionData = {
                ...formData,
                price: { ...formData.price, value: parseFloat(formData.price.value) },
                features: {
                    ...formData.features,
                    bedrooms: parseInt(formData.features.bedrooms) || undefined,
                    bathrooms: parseInt(formData.features.bathrooms) || undefined,
                    areaSqft: parseFloat(formData.features.areaSqft),
                }
            };
            
            await addProperty(submissionData);
            
            Alert.alert("Success!", "Your property has been listed successfully.", [
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
                <Appbar.Content title="List Residential Property" />
            </Appbar.Header>
            <ScrollView contentContainerStyle={styles.scrollView}>
                {/* Basic Details */}
                <View style={styles.formSection}>
                    <SectionHeader title="Basic Details" icon="home-city-outline" />
                    <TextInput label="Property Title / Headline *" mode="outlined" value={formData.title} onChangeText={v => setFormData(p => ({...p, title: v}))} style={styles.input}/>
                    <TextInput label="Description" mode="outlined" value={formData.description} onChangeText={v => setFormData(p => ({...p, description: v}))} style={styles.input} multiline numberOfLines={4}/>
                    <Text style={styles.fieldLabel}>Property Type</Text>
                    <ButtonSelector options={['Apartment', 'Villa', 'Row House']} selectedValue={formData.propertyType} onSelect={v => setFormData(p => ({...p, propertyType: v}))} />
                </View>

                {/* Features */}
                <View style={styles.formSection}>
                    <SectionHeader title="Features & Amenities" icon="star-four-points-outline" />
                    <TextInput label="Carpet Area (sq ft) *" mode="outlined" keyboardType="numeric" value={formData.features.areaSqft} onChangeText={v => handleInputChange('features', 'areaSqft', v)} style={styles.input} />
                    <View style={styles.row}>
                        <TextInput label="Bedrooms *" mode="outlined" keyboardType="numeric" value={formData.features.bedrooms} onChangeText={v => handleInputChange('features', 'bedrooms', v)} style={styles.inputHalf} />
                        <TextInput label="Bathrooms" mode="outlined" keyboardType="numeric" value={formData.features.bathrooms} onChangeText={v => handleInputChange('features', 'bathrooms', v)} style={styles.inputHalf} />
                    </View>
                    <Text style={styles.fieldLabel}>Furnishing Status</Text>
                    <ButtonSelector options={['unfurnished', 'semi-furnished', 'furnished']} selectedValue={formData.features.furnishing} onSelect={v => handleInputChange('features', 'furnishing', v)} />
                </View>
                
                {/* Pricing */}
                <View style={styles.formSection}>
                    <SectionHeader title="Pricing" icon="cash-multiple" />
                    <TextInput label="Total Expected Price (₹) *" mode="outlined" keyboardType="numeric" value={formData.price.value} onChangeText={v => handleInputChange('price', 'value', v)} style={styles.input}/>
                </View>

                {/* Photos */}
                <View style={styles.formSection}>
                    <SectionHeader title="Photos" icon="camera-outline" />
                    <TouchableOpacity style={styles.uploadButton} onPress={pickImages} disabled={isUploading}>
                        <Icon name="camera-plus-outline" size={24} color="#4F46E5" />
                        <Text style={styles.uploadButtonText}>Add Photos</Text>
                    </TouchableOpacity>
                    {isUploading && <ActivityIndicator style={{ marginTop: 16 }} />}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }}>
                        {localImages.map((img, index) => (
                            <Image key={img.uri} source={{ uri: img.uri }} style={styles.previewImage} />
                        ))}
                    </ScrollView>
                </View>

                <Button mode="contained" onPress={handleSubmit} loading={isSubmitting} disabled={isSubmitting || isUploading} style={styles.submitButton}>
                    Submit Property
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
    sectionIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
    input: { backgroundColor: '#F9FAFB', marginTop: 8 },
    row: { flexDirection: 'row', gap: 12 },
    inputHalf: { flex: 1, backgroundColor: '#F9FAFB', marginTop: 8 },
    fieldLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 10, marginTop: 16 },
    buttonSelectorContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    selectorButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1.5, borderColor: '#D1D5DB' },
    selectorButtonActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
    selectorButtonText: { fontSize: 14, fontWeight: '500', color: '#374151', textTransform: 'capitalize' },
    selectorButtonTextActive: { color: '#FFFFFF' },
    uploadButton: { alignItems: 'center', padding: 24, borderRadius: 12, borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed', backgroundColor: '#F9FAFB' },
    uploadButtonText: { fontSize: 16, fontWeight: '600', color: '#4F46E5', marginTop: 8 },
    previewImage: { width: 100, height: 100, borderRadius: 8, marginRight: 8, borderWidth: 1, borderColor: '#E5E7EB' },
    submitButton: { borderRadius: 12, marginTop: 8, paddingVertical: 8 },
});

export default ResidentialSaleFormScreen;