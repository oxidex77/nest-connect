import { NavigatorScreenParams } from '@react-navigation/native';

// Types for the stacks inside the Bottom Tab Navigator
export type RequirementsStackParamList = {
    MyRequirements: undefined;
    RequirementMatches: { requirementId: string; requirementName: string; };
};

export type ListingsStackParamList = { MyListings: undefined; };

// Types for the Bottom Tab Navigator itself
export type MainTabsParamList = {
    Home: undefined;
    RequirementsTab: NavigatorScreenParams<RequirementsStackParamList>;
    AddAction: undefined; // For the FAB placeholder
    ListingsTab: NavigatorScreenParams<ListingsStackParamList>;
    Profile: undefined;
};

// Types for the Root Stack that contains everything
export type RootStackParamList = {
    MainTabs: NavigatorScreenParams<MainTabsParamList>;
    CategorySelection: { flow: 'requirement' | 'listing' };
    ResidentialSaleForm: { flow: 'requirement' | 'listing' };
    ResidentialRentalForm: { flow: 'requirement' | 'listing' };
    CommercialSaleForm: { flow: 'requirement' | 'listing' };
    ProjectFinder: undefined;
    ProjectComparisonDeck: { requirements: any };
    NewProjectForm: undefined;
};