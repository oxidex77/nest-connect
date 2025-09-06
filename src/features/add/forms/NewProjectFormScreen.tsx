import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Text, Appbar, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as DocumentPicker from 'expo-document-picker';

type ConfigurationItem = { config: string; areaRange: string; units: string; };
type PricingItem = { config: string; area: string; priceRange: string; includesParking: string; parkingCost: string; };

const SectionHeader = ({ title, icon }: { title: string; icon: string; }) => (
    <View style={styles.sectionHeaderContainer}>
        <View style={styles.sectionIconContainer}><Icon name={icon} size={20} color="#4F46E5" /></View>
        <Text style={styles.sectionTitle}>{title}</Text>
    </View>
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
            onSelect(option as string);
        }
    };
    const isSelected = (option: string) => multiSelect ? Array.isArray(selectedValue) && selectedValue.includes(option) : selectedValue === option;
    return (
        <View style={styles.buttonSelectorContainer}>
            {options.map(option => (
                <TouchableOpacity key={option} style={[styles.selectorButton, isSelected(option) && styles.selectorButtonActive]} onPress={() => handleSelect(option)} activeOpacity={0.7}>
                    <Text style={[styles.selectorButtonText, isSelected(option) && styles.selectorButtonTextActive]}>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const AMENITIES_LIST = ['Swimming Pool', 'Gym', 'Clubhouse', 'EV Charging', 'Senior Park', 'Business Lounge' /* ... */ ];

const NewProjectFormScreen = () => {
    const navigation = useNavigation();

    const [basicInfo, setBasicInfo] = useState({ developerName: '', projectName: '', landParcelSize: '', totalTowers: '', floorsPerTower: '', unitsPerFloor: '', totalUnits: '', constructionType: '' });
    const [location, setLocation] = useState({ city: '', zone: '', locality: '', landmark: '', pincode: '', gmapsLink: '' });
    const [configurations, setConfigurations] = useState<ConfigurationItem[]>([{ config: '', areaRange: '', units: '' }]);
    const [pricing, setPricing] = useState<PricingItem[]>([{ config: '', area: '', priceRange: '', includesParking: 'No', parkingCost: '' }]);
    const [amenities, setAmenities] = useState({ totalArea: '', list: [] as string[] });
    const [possession, setPossession] = useState({ reraDate: '', builderDate: '', reraNumber: '' });
    const [paymentPlan, setPaymentPlan] = useState<string[]>([]);
    const [approvals, setApprovals] = useState({ banks: '', status: [] as string[] });
    const [media, setMedia] = useState({ brochure: null as DocumentPicker.DocumentPickerAsset | null, floorPlans: null, images: null, videoLink: '' });
    const [poc, setPoc] = useState({ name: '', phone: '', email: '', designation: '', contactMode: '' });
    
    const addConfiguration = () => setConfigurations([...configurations, { config: '', areaRange: '', units: '' }]);
    const addPricing = () => setPricing([...pricing, { config: '', area: '', priceRange: '', includesParking: 'No', parkingCost: '' }]);

    const handleConfigChange = (index: number, field: keyof ConfigurationItem, value: string) => {
        const updated = [...configurations];
        updated[index][field] = value;
        setConfigurations(updated);
    };

    const handlePricingChange = (index: number, field: keyof PricingItem, value: string) => {
        const updated = [...pricing];
        updated[index][field] = value;
        setPricing(updated);
    };

    const pickDocument = async (type: 'brochure' | 'floorPlans') => {
        let result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
        if (!result.canceled) {
            setMedia(prev => ({ ...prev, [type]: result.assets[0] }));
        }
    };
    
    const handleSubmit = () => {
        const fullFormData = { basicInfo, location, configurations, pricing, amenities, possession, paymentPlan, approvals, media, poc };
        console.log("Submitting New Project:", JSON.stringify(fullFormData, null, 2));
        Alert.alert("Success!", "Your new project has been listed.", [{ text: "OK", onPress: () => navigation.goBack() }]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="List a New Project" titleStyle={styles.appbarTitle} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.formSection}>
                    <SectionHeader title="Basic Information" icon="information-outline" />
                    <TextInput label="Developer Name" mode="outlined" style={styles.input} outlineStyle={styles.inputOutline} onChangeText={v => setBasicInfo(s => ({...s, developerName: v}))} />
                    <TextInput label="Project Name" mode="outlined" style={styles.input} outlineStyle={styles.inputOutline} onChangeText={v => setBasicInfo(s => ({...s, projectName: v}))} />
                    {/* ... other text inputs for this section ... */}
                </View>

                <View style={styles.formSection}>
                    <SectionHeader title="Configuration & Unit Details" icon="view-grid-plus-outline" />
                    {configurations.map((item, index) => (
                        <View key={index} style={styles.dynamicRow}>
                            <TextInput label="Configuration" value={item.config} onChangeText={v => handleConfigChange(index, 'config', v)} style={{flex: 1, marginRight: 8}}/>
                            <TextInput label="Carpet Area Range" value={item.areaRange} onChangeText={v => handleConfigChange(index, 'areaRange', v)} style={{flex: 1, marginRight: 8}}/>
                            <TextInput label="# of Units" value={item.units} onChangeText={v => handleConfigChange(index, 'units', v)} style={{flex: 1}}/>
                        </View>
                    ))}
                    <Button icon="plus" mode="text" onPress={addConfiguration}>Add Configuration</Button>
                </View>

                <View style={styles.formSection}>
                    <SectionHeader title="Pricing Summary" icon="cash-multiple" />
                    {pricing.map((item, index) => (
                        <View key={index} style={styles.dynamicSection}>
                           <TextInput label="Configuration" value={item.config} onChangeText={v => handlePricingChange(index, 'config', v)} style={{marginBottom: 8}}/>
                           <TextInput label="Price Range (e.g., 80L - 1Cr)" value={item.priceRange} onChangeText={v => handlePricingChange(index, 'priceRange', v)} style={{marginBottom: 8}}/>
                           <Text style={styles.fieldLabel}>Includes Parking?</Text>
                           <ButtonSelector options={['Yes', 'No']} selectedValue={item.includesParking} onSelect={v => handlePricingChange(index, 'includesParking', v as string)} />
                           {item.includesParking === 'No' && <TextInput label="Parking Cost" value={item.parkingCost} onChangeText={v => handlePricingChange(index, 'parkingCost', v)} style={{marginTop: 8}}/>}
                        </View>
                    ))}
                    <Button icon="plus" mode="text" onPress={addPricing}>Add Pricing Tier</Button>
                </View>

                <View style={styles.formSection}>
                    <SectionHeader title="Payment Plan" icon="chart-timeline-variant" />
                    {/* --- THE FIX IS HERE --- */}
                    <ButtonSelector
                        options={['Construction Linked', 'Subvention', '10:90', 'Down Payment', 'Other']}
                        selectedValue={paymentPlan}
                        onSelect={(value) => setPaymentPlan(value as string[])} // Use a wrapper function
                        multiSelect
                    />
                </View>
                
                <View style={styles.formSection}>
                    <SectionHeader title="Brochures & Media" icon="file-upload-outline" />
                    <Button icon="file-pdf-box" mode="outlined" onPress={() => pickDocument('brochure')}>
                        {media.brochure ? `Uploaded: ${media.brochure.name}` : 'Upload Brochure (PDF)'}
                    </Button>
                </View>

                <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>Submit Project</Button>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    appbar: { backgroundColor: '#FFFFFF' },
    appbarTitle: { fontWeight: '600', color: '#1F2937', fontSize: 18 },
    scrollView: { paddingHorizontal: 16, paddingBottom: 32 },
    formSection: { marginBottom: 24, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F1F5F9' },
    sectionHeaderContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    sectionIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
    input: { backgroundColor: '#FFFFFF', marginTop: 12 },
    inputOutline: { borderRadius: 8 },
    dynamicRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    dynamicSection: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    fieldLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 10, marginTop: 16 },
    buttonSelectorContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    selectorButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1.5, borderColor: '#D1D5DB', backgroundColor: '#FFFFFF' },
    selectorButtonActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
    selectorButtonText: { fontSize: 14, fontWeight: '500', color: '#374151' },
    selectorButtonTextActive: { color: '#FFFFFF' },
    submitButton: { borderRadius: 12, marginTop: 16, backgroundColor: '#4F46E5' },
});

export default NewProjectFormScreen;