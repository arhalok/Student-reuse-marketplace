// ==============================================================================
// DOMAIN TYPES FOR STUDENT REUSE MARKETPLACE
// Campus-first reuse ecosystem for buying, selling, exchanging, renting & gifting
// ==============================================================================

export type TransactionMode = 'BUY' | 'EXCHANGE' | 'RENT' | 'GIVE_AWAY';

export type ItemCondition = 'LIKE_NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'FOR_PARTS';

export type ListingStatus = 
  | 'DRAFT'
  | 'ACTIVE'
  | 'OFFER_RECEIVED'
  | 'RESERVED'
  | 'MEETING_SCHEDULED'
  | 'SOLD'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'REPORTED';

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'COUNTERED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

export type RequestStatus = 'OPEN' | 'MATCHED' | 'FULFILLED' | 'CANCELLED';

export interface Campus {
  id: string;
  name: string;
  shortCode: string;
  city: string;
  state: string;
  domainSuffix: string;
}

export interface StudentProfile {
  id: string;
  campusId: string;
  fullName: string;
  avatarUrl?: string;
  collegeEmail: string;
  isStudentVerified: boolean;
  degreeProgram: string;
  currentYear: number;
  currentSemester: number;
  phoneNumber?: string;
  upiId?: string;
  
  // Trust metrics
  totalTransactions: number;
  successfulTransactions: number;
  responseRatePercent: number;
  avgResponseMinutes: number;
  trustRating: number;
  memberSinceYear: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  displayOrder: number;
}

export interface ExchangeSpot {
  id: string;
  campusId: string;
  name: string;
  description: string;
  isRecommended: boolean;
}

export interface Listing {
  id: string;
  sellerId: string;
  seller?: StudentProfile;
  campusId: string;
  categoryId: string;
  category?: Category;
  
  title: string;
  description: string;
  images: string[];
  
  mode: TransactionMode;
  price: number; // 0 for GIVE_AWAY
  originalNewPrice?: number;
  exchangeDetails?: string;
  rentalRatePerWeek?: number;
  
  // Standardized condition
  condition: ItemCondition;
  bookInspection?: {
    hasHighlighting: boolean;
    hasWriting: boolean;
    missingPages: boolean;
    coverWear: boolean;
    edition?: string;
    isbn?: string;
  };
  
  // Semester Graph
  targetCourse: string;
  relevantSemesters: number[];
  isBundle?: boolean;
  bundleItems?: string[];
  
  // Lifecycle
  status: ListingStatus;
  preferredSpotId?: string;
  preferredSpot?: ExchangeSpot;
  viewsCount: number;
  savesCount: number;
  createdAt: string;
}

export interface NeedRequest {
  id: string;
  buyerId: string;
  buyer?: StudentProfile;
  campusId: string;
  categoryId?: string;
  
  itemTitle: string;
  maxBudget: number;
  preferredCondition: ItemCondition;
  requiredByDate?: string;
  notes?: string;
  targetSemester?: number;
  
  status: RequestStatus;
  matchedListingId?: string;
  createdAt: string;
}

export interface Offer {
  id: string;
  listingId: string;
  listing?: Listing;
  buyerId: string;
  buyer?: StudentProfile;
  sellerId: string;
  seller?: StudentProfile;
  
  offeredAmount: number;
  counterAmount?: number;
  status: OfferStatus;
  
  meetingSpotId?: string;
  meetingSpot?: ExchangeSpot;
  meetingTime?: string;
  notes?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  listingId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

export interface SemesterPackItem {
  name: string;
  category: string;
  originalPrice: number;
  resalePrice: number;
  semester: number;
  icon: string;
}
