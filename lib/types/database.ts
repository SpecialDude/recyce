// Database Enums
export type UserRole = 'user' | 'admin'
export type AddressType = 'shipping' | 'billing'
export type VariantType = 'carrier' | 'storage' | 'color'
export type OfferStatus = 'pending' | 'accepted' | 'declined' | 'expired'
export type OrderStatus =
    | 'pending'
    | 'awaiting_shipment'
    | 'shipped'
    | 'received'
    | 'inspecting'
    | 'inspected'
    | 'payout_pending'
    | 'payout_complete'
    | 'cancelled'
export type InspectionStatus = 'pending' | 'in_progress' | 'completed' | 'disputed'
export type PayoutMethod = 'paypal' | 'stripe' | 'check' | 'zelle'
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type BlogStatus = 'draft' | 'published' | 'archived'
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type PricingRuleType = 'base_price' | 'condition_override' | 'seasonal_bonus'

// Database Tables
export interface Profile {
    id: string
    email: string
    full_name: string | null
    phone: string | null
    role: UserRole
    created_at: string
    updated_at: string
}

export interface Address {
    id: string
    user_id: string
    type: AddressType
    street: string
    city: string
    state: string
    zip_code: string
    country: string
    is_default: boolean
    created_at: string
}

export interface DeviceCategory {
    id: string
    name: string
    slug: string
    icon_url: string | null
    display_order: number
    is_active: boolean
    created_at: string
}

export interface DeviceBrand {
    id: string
    category_id: string
    name: string
    slug: string
    logo_url: string | null
    display_order: number
    is_active: boolean
    created_at: string
}

export interface DeviceModel {
    id: string
    brand_id: string
    name: string
    slug: string
    base_price: number
    has_carrier_variants: boolean
    has_storage_variants: boolean
    has_accessories: boolean
    image_url: string | null
    specifications: Record<string, any>
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface DeviceVariant {
    id: string
    model_id: string
    variant_type: VariantType
    variant_value: string
    price_adjustment: number
    display_order: number
    created_at: string
}

export interface ConditionMultiplier {
    id: string
    condition_name: string
    condition_slug: string
    multiplier: number
    description: string
    display_order: number
    created_at: string
}

export interface PricingRule {
    id: string
    model_id: string | null
    category_id: string | null
    rule_type: PricingRuleType
    value: number
    start_date: string | null
    end_date: string | null
    is_active: boolean
    created_at: string
}

export interface Offer {
    id: string
    user_id: string
    device_model_id: string
    condition_id: string
    carrier_variant_id: string | null
    storage_variant_id: string | null
    has_original_box: boolean
    has_charger: boolean
    quoted_price: number
    final_price: number | null
    status: OfferStatus
    expires_at: string
    accepted_at: string | null
    metadata: Record<string, any>
    created_at: string
    updated_at: string
}

export interface Order {
    id: string
    offer_id: string
    user_id: string
    order_number: string
    status: OrderStatus
    shipping_address_id: string
    tracking_number: string | null
    shipping_carrier: string | null
    shipping_notes: string | null
    label_url: string | null
    shipped_at: string | null
    received_at: string | null
    created_at: string
    updated_at: string
}

export interface Inspection {
    id: string
    order_id: string
    inspector_id: string
    actual_condition_id: string
    discrepancies: string | null
    adjusted_price: number | null
    photos: string[]
    notes: string | null
    status: InspectionStatus
    inspected_at: string | null
    created_at: string
    updated_at: string
}

export interface Payout {
    id: string
    order_id: string
    user_id: string
    amount: number
    method: PayoutMethod
    payment_email: string | null
    payment_details: Record<string, any>
    status: PayoutStatus
    processed_at: string | null
    transaction_id: string | null
    created_at: string
    updated_at: string
}

export interface BlogPost {
    id: string
    author_id: string
    title: string
    slug: string
    excerpt: string
    content: string
    featured_image: string | null
    status: BlogStatus
    published_at: string | null
    created_at: string
    updated_at: string
}

export interface FAQ {
    id: string
    category: string
    question: string
    answer: string
    display_order: number
    is_featured: boolean
    created_at: string
    updated_at: string
}

export interface SupportTicket {
    id: string
    user_id: string
    order_id: string | null
    subject: string
    description: string
    status: TicketStatus
    priority: TicketPriority
    assigned_to: string | null
    created_at: string
    updated_at: string
}

export interface AuditLog {
    id: string
    user_id: string
    action: string
    entity_type: string
    entity_id: string
    old_values: Record<string, any> | null
    new_values: Record<string, any> | null
    ip_address: string
    user_agent: string
    created_at: string
}

// Extended types with relations
export interface DeviceModelWithBrand extends DeviceModel {
    brand: DeviceBrand
}

export interface DeviceBrandWithCategory extends DeviceBrand {
    category: DeviceCategory
}

export interface OfferWithDetails extends Offer {
    device_model: DeviceModelWithBrand
    condition: ConditionMultiplier
    carrier_variant?: DeviceVariant
    storage_variant?: DeviceVariant
}

export interface OrderWithDetails extends Order {
    offer: OfferWithDetails
    shipping_address: Address
    inspection?: Inspection
    payout?: Payout
}

// Form types
export interface LoginFormData {
    email: string
    password: string
}

export interface SignupFormData {
    email: string
    password: string
    full_name: string
    phone?: string
}

export interface ShippingFormData {
    street: string
    city: string
    state: string
    zip_code: string
    country: string
}

export interface DeviceSelectionState {
    category?: DeviceCategory
    brand?: DeviceBrand
    model?: DeviceModel
    condition?: ConditionMultiplier
    carrier_variant?: DeviceVariant
    storage_variant?: DeviceVariant
    has_original_box: boolean
    has_charger: boolean
    quoted_price?: number
}

// API Response types
export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    count: number
    page: number
    pageSize: number
    totalPages: number
}

// Pricing calculation types
export interface PriceBreakdown {
    base_price: number
    condition_multiplier: number
    variant_adjustments: number
    accessories_bonus: number
    final_price: number
}
