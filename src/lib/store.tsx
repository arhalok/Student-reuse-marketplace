'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Listing,
  NeedRequest,
  Offer,
  Message,
  StudentProfile,
  Campus,
  Category,
  ExchangeSpot,
  ItemCondition,
  TransactionMode,
} from './types';
import {
  INITIAL_CAMPUSES,
  INITIAL_PROFILES,
  INITIAL_CATEGORIES,
  INITIAL_SPOTS,
  INITIAL_LISTINGS,
  INITIAL_NEED_REQUESTS,
} from './mock-data';

interface MarketplaceContextType {
  // Active context
  currentCampus: Campus;
  setCampus: (campus: Campus) => void;
  currentProfile: StudentProfile;
  setProfile: (profile: StudentProfile) => void;
  availableProfiles: StudentProfile[];
  
  // Data
  campuses: Campus[];
  categories: Category[];
  exchangeSpots: ExchangeSpot[];
  listings: Listing[];
  needRequests: NeedRequest[];
  offers: Offer[];
  messages: Message[];

  // Actions
  createListing: (data: Partial<Listing>) => { listing: Listing; matchedNeedsCount: number };
  createNeedRequest: (data: Partial<NeedRequest>) => { need: NeedRequest; matchedListingsCount: number };
  
  // Negotiation & Lifecycle
  makeOffer: (listingId: string, offeredAmount: number, notes?: string) => Offer;
  respondToOffer: (offerId: string, action: 'ACCEPT' | 'REJECT' | 'COUNTER', counterAmount?: number) => void;
  scheduleMeeting: (offerId: string, spotId: string, time: string) => void;
  completeTransaction: (offerId: string) => void;
  
  // Messaging
  sendMessage: (listingId: string, receiverId: string, content: string) => void;
  
  // Calculations
  calculateFairPrice: (originalPrice: number, condition: ItemCondition) => { min: number; max: number; suggested: number };
  
  // Semester filter
  selectedSemester: number | 'ALL';
  setSelectedSemester: (sem: number | 'ALL') => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | 'ALL';
  setSelectedCategory: (cat: string | 'ALL') => void;
  selectedMode: TransactionMode | 'ALL';
  setSelectedMode: (mode: TransactionMode | 'ALL') => void;

  // Sustainability stats
  impactStats: {
    itemsReused: number;
    moneySaved: number;
    co2SavedKg: number;
  };

  // Reset to default
  resetData: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [currentCampus, setCampusState] = useState<Campus>(INITIAL_CAMPUSES[0]);
  const [currentProfile, setProfileState] = useState<StudentProfile>(INITIAL_PROFILES['user-rahul']);
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [needRequests, setNeedRequests] = useState<NeedRequest[]>(INITIAL_NEED_REQUESTS);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [selectedSemester, setSelectedSemester] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | 'ALL'>('ALL');
  const [selectedMode, setSelectedMode] = useState<TransactionMode | 'ALL'>('ALL');

  // Load from localStorage on client mount if available
  useEffect(() => {
    try {
      const savedListings = localStorage.getItem('srm_listings');
      if (savedListings) setListings(JSON.parse(savedListings));

      const savedNeeds = localStorage.getItem('srm_needs');
      if (savedNeeds) setNeedRequests(JSON.parse(savedNeeds));

      const savedOffers = localStorage.getItem('srm_offers');
      if (savedOffers) setOffers(JSON.parse(savedOffers));

      const savedProfileId = localStorage.getItem('srm_profile_id');
      if (savedProfileId && INITIAL_PROFILES[savedProfileId]) {
        setProfileState(INITIAL_PROFILES[savedProfileId]);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem('srm_listings', JSON.stringify(listings));
      localStorage.setItem('srm_needs', JSON.stringify(needRequests));
      localStorage.setItem('srm_offers', JSON.stringify(offers));
      localStorage.setItem('srm_profile_id', currentProfile.id);
    } catch {
      // ignore
    }
  }, [listings, needRequests, offers, currentProfile]);

  const setCampus = (campus: Campus) => {
    setCampusState(campus);
  };

  const setProfile = (profile: StudentProfile) => {
    setProfileState(profile);
  };

  // Price Guidance Engine (Section 12 of PRD)
  const calculateFairPrice = (originalPrice: number, condition: ItemCondition) => {
    if (!originalPrice || originalPrice <= 0) {
      return { min: 200, max: 500, suggested: 350 };
    }
    let minPct = 0.3;
    let maxPct = 0.5;
    let sugPct = 0.4;

    switch (condition) {
      case 'LIKE_NEW':
        minPct = 0.55;
        maxPct = 0.70;
        sugPct = 0.62;
        break;
      case 'EXCELLENT':
        minPct = 0.45;
        maxPct = 0.58;
        sugPct = 0.50;
        break;
      case 'GOOD':
        minPct = 0.30;
        maxPct = 0.45;
        sugPct = 0.38;
        break;
      case 'FAIR':
        minPct = 0.18;
        maxPct = 0.30;
        sugPct = 0.24;
        break;
      case 'FOR_PARTS':
        minPct = 0.08;
        maxPct = 0.15;
        sugPct = 0.10;
        break;
    }

    const min = Math.round((originalPrice * minPct) / 10) * 10;
    const max = Math.round((originalPrice * maxPct) / 10) * 10;
    const suggested = Math.round((originalPrice * sugPct) / 10) * 10;

    return { min, max, suggested };
  };

  // Create Listing with Demand Matching (Section 5 & 13)
  const createListing = (data: Partial<Listing>) => {
    const newListing: Listing = {
      id: `list-${Date.now()}`,
      sellerId: currentProfile.id,
      campusId: currentCampus.id,
      categoryId: data.categoryId || 'cat-calc',
      title: data.title || 'Untitled Academic Item',
      description: data.description || '',
      images: data.images && data.images.length > 0 
        ? data.images 
        : ['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=600'],
      mode: data.mode || 'BUY',
      price: data.mode === 'GIVE_AWAY' ? 0 : Number(data.price || 0),
      originalNewPrice: data.originalNewPrice ? Number(data.originalNewPrice) : undefined,
      exchangeDetails: data.exchangeDetails,
      rentalRatePerWeek: data.rentalRatePerWeek ? Number(data.rentalRatePerWeek) : undefined,
      condition: data.condition || 'GOOD',
      bookInspection: data.bookInspection,
      targetCourse: data.targetCourse || 'Engineering',
      relevantSemesters: data.relevantSemesters || [1, 2],
      isBundle: data.isBundle || false,
      bundleItems: data.bundleItems || [],
      status: 'ACTIVE',
      preferredSpotId: data.preferredSpotId || 'spot-lib',
      viewsCount: 1,
      savesCount: 0,
      createdAt: new Date().toISOString(),
    };

    // Smart Demand Match Check
    const matchingNeeds = needRequests.filter(n => {
      const matchCampus = n.campusId === newListing.campusId;
      const titleWords = newListing.title.toLowerCase().split(/\s+/);
      const needWords = n.itemTitle.toLowerCase().split(/\s+/);
      const titleOverlap = titleWords.some(w => w.length > 3 && needWords.includes(w));
      const budgetOk = newListing.price <= n.maxBudget;
      return matchCampus && titleOverlap && budgetOk && n.status === 'OPEN';
    });

    // Mark matched need if any
    if (matchingNeeds.length > 0) {
      setNeedRequests(prev =>
        prev.map(n =>
          matchingNeeds.some(m => m.id === n.id)
            ? { ...n, status: 'MATCHED', matchedListingId: newListing.id }
            : n
        )
      );
    }

    setListings(prev => [newListing, ...prev]);
    return { listing: newListing, matchedNeedsCount: matchingNeeds.length };
  };

  // Create Need Request with Supply Matching (Section 5)
  const createNeedRequest = (data: Partial<NeedRequest>) => {
    const newNeed: NeedRequest = {
      id: `need-${Date.now()}`,
      buyerId: currentProfile.id,
      campusId: currentCampus.id,
      categoryId: data.categoryId,
      itemTitle: data.itemTitle || 'Academic Supply Needed',
      maxBudget: Number(data.maxBudget || 1000),
      preferredCondition: data.preferredCondition || 'GOOD',
      requiredByDate: data.requiredByDate,
      notes: data.notes,
      targetSemester: data.targetSemester,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };

    // Check existing listings
    const matched = listings.filter(l => {
      const matchCampus = l.campusId === newNeed.campusId;
      const titleWords = l.title.toLowerCase().split(/\s+/);
      const needWords = newNeed.itemTitle.toLowerCase().split(/\s+/);
      const titleOverlap = titleWords.some(w => w.length > 3 && needWords.includes(w));
      const budgetOk = l.price <= newNeed.maxBudget;
      return matchCampus && titleOverlap && budgetOk && l.status === 'ACTIVE';
    });

    if (matched.length > 0) {
      newNeed.status = 'MATCHED';
      newNeed.matchedListingId = matched[0].id;
    }

    setNeedRequests(prev => [newNeed, ...prev]);
    return { need: newNeed, matchedListingsCount: matched.length };
  };

  // Offer Workflow (Section 20 of PRD)
  const makeOffer = (listingId: string, offeredAmount: number, notes?: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) throw new Error('Listing not found');

    const newOffer: Offer = {
      id: `offer-${Date.now()}`,
      listingId,
      listing,
      buyerId: currentProfile.id,
      buyer: currentProfile,
      sellerId: listing.sellerId,
      seller: INITIAL_PROFILES[listing.sellerId] || currentProfile,
      offeredAmount,
      status: 'PENDING',
      notes,
      createdAt: new Date().toISOString(),
    };

    // Update listing status
    setListings(prev =>
      prev.map(l => (l.id === listingId ? { ...l, status: 'OFFER_RECEIVED' } : l))
    );

    setOffers(prev => [newOffer, ...prev]);
    return newOffer;
  };

  const respondToOffer = (offerId: string, action: 'ACCEPT' | 'REJECT' | 'COUNTER', counterAmount?: number) => {
    setOffers(prev =>
      prev.map(o => {
        if (o.id !== offerId) return o;
        if (action === 'ACCEPT') {
          // Reserve the item
          setListings(lprev =>
            lprev.map(l => (l.id === o.listingId ? { ...l, status: 'RESERVED' } : l))
          );
          return { ...o, status: 'ACCEPTED' };
        }
        if (action === 'COUNTER') {
          return { ...o, status: 'COUNTERED', counterAmount: counterAmount || o.offeredAmount };
        }
        if (action === 'REJECT') {
          return { ...o, status: 'REJECTED' };
        }
        return o;
      })
    );
  };

  const scheduleMeeting = (offerId: string, spotId: string, time: string) => {
    const spot = INITIAL_SPOTS.find(s => s.id === spotId);
    setOffers(prev =>
      prev.map(o => {
        if (o.id !== offerId) return o;
        // update listing
        setListings(lprev =>
          lprev.map(l => (l.id === o.listingId ? { ...l, status: 'MEETING_SCHEDULED' } : l))
        );
        return {
          ...o,
          meetingSpotId: spotId,
          meetingSpot: spot,
          meetingTime: time,
          status: 'ACCEPTED',
        };
      })
    );
  };

  const completeTransaction = (offerId: string) => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;

    // Set offer completed
    setOffers(prev =>
      prev.map(o => (o.id === offerId ? { ...o, status: 'COMPLETED' } : o))
    );

    // Set listing sold
    setListings(prev =>
      prev.map(l => (l.id === offer.listingId ? { ...l, status: 'SOLD' } : l))
    );

    // Increment seller transactions count in profiles
    INITIAL_PROFILES[offer.sellerId] = {
      ...(INITIAL_PROFILES[offer.sellerId] || currentProfile),
      successfulTransactions: (INITIAL_PROFILES[offer.sellerId]?.successfulTransactions || 0) + 1,
      totalTransactions: (INITIAL_PROFILES[offer.sellerId]?.totalTransactions || 0) + 1,
    };
  };

  const sendMessage = (listingId: string, receiverId: string, content: string) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      listingId,
      senderId: currentProfile.id,
      receiverId,
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const resetData = () => {
    setListings(INITIAL_LISTINGS);
    setNeedRequests(INITIAL_NEED_REQUESTS);
    setOffers([]);
    setMessages([]);
    localStorage.removeItem('srm_listings');
    localStorage.removeItem('srm_needs');
    localStorage.removeItem('srm_offers');
  };

  // Campus sustainability impact calculator
  const completedListings = listings.filter(l => l.status === 'SOLD');
  const itemsReused = 128 + completedListings.length;
  const moneySaved = 142500 + completedListings.reduce((sum, l) => sum + ((l.originalNewPrice || l.price * 1.8) - l.price), 0);
  const co2SavedKg = Math.round(itemsReused * 4.2);

  return (
    <MarketplaceContext.Provider
      value={{
        currentCampus,
        setCampus,
        currentProfile,
        setProfile,
        availableProfiles: Object.values(INITIAL_PROFILES),
        campuses: INITIAL_CAMPUSES,
        categories: INITIAL_CATEGORIES,
        exchangeSpots: INITIAL_SPOTS,
        listings,
        needRequests,
        offers,
        messages,
        createListing,
        createNeedRequest,
        makeOffer,
        respondToOffer,
        scheduleMeeting,
        completeTransaction,
        sendMessage,
        calculateFairPrice,
        selectedSemester,
        setSelectedSemester,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedMode,
        setSelectedMode,
        impactStats: {
          itemsReused,
          moneySaved,
          co2SavedKg,
        },
        resetData,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}
