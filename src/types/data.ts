// This file defines the shape of our data, matching the backend Mongoose models.

export interface Property {
    _id: string;
    title: string;
    description?: string;
    purpose: 'sale' | 'rent' | 'lease';
    propertyType: string;
    location: {
        address: string;
        city: string;
        state: string;
    };
    price: {
        value: number;
        priceType: 'lumpsum' | 'per_month';
    };
    features: {
        bedrooms?: number;
        bathrooms?: number;
        areaSqft: number;
        furnishing?: string;
    };
    media: { url: string; isPrimary: boolean }[];
    isFeatured?: boolean;
}

export interface Requirement {
    _id: string;
    clientName: string;
    purpose: 'buy' | 'rent';
    propertyTypes: string[];
    budget: {
        min: number;
        max: number;
    };
}

// A specific type for the matched property card
export interface MatchedProperty extends Property {
    match_percentage: number;
}