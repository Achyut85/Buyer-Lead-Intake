
import { z } from 'zod';

// Base enums for validation
export const citySchema = z.enum(['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other']);
export const propertyTypeSchema = z.enum(['Apartment', 'Villa', 'Plot', 'Office', 'Retail']);
export const bhkSchema = z.enum(['1', '2', '3', '4', 'Studio']);
export const purposeSchema = z.enum(['Buy', 'Rent']);
export const timelineSchema = z.enum(['0-3m', '3-6m', '>6m', 'Exploring']);
export const sourceSchema = z.enum(['Website', 'Referral', 'Walk-in', 'Call', 'Other']);
export const statusSchema = z.enum([
  'New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped'
]);

// Phone validation - Indian mobile numbers
const phoneRegex = /^[6-9]\d{9}$/;
export const phoneSchema = z.string()
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number must not exceed 15 digits')
  .regex(/^\d+$/, 'Phone number must contain only digits')
  .refine((phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }, 'Invalid phone number format');

// Email validation (optional)
export const emailSchema = z.string().email('Invalid email format').optional().or(z.literal(''));

// Budget validation
export const budgetSchema = z.number()
  .int('Budget must be a whole number')
  .min(0, 'Budget cannot be negative')
  .optional();

// Tags validation
export const tagsSchema = z.array(z.string().trim().min(1)).default([]);

// Notes validation
export const notesSchema = z.string()
  .max(1000, 'Notes cannot exceed 1000 characters')
  .optional()
  .or(z.literal(''));

// Main buyer schema
export const buyerSchema = z.object({
  fullName: z.string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(80, 'Full name cannot exceed 80 characters'),
  
  email: emailSchema,
  
  phone: phoneSchema,
  
  city: citySchema,
  
  propertyType: propertyTypeSchema,
  
  bhk: bhkSchema.optional(),
  
  purpose: purposeSchema,
  
  budgetMin: budgetSchema,
  
  budgetMax: budgetSchema,
  
  timeline: timelineSchema,
  
  source: sourceSchema,
  
  status: statusSchema.default('New'),
  
  notes: notesSchema,
  
  tags: tagsSchema,
})
.refine((data) => {
  // BHK is required for residential properties
  if (['Apartment', 'Villa'].includes(data.propertyType)) {
    return data.bhk !== undefined && data.bhk !== null;
  }
  return true;
}, {
  message: 'BHK is required for Apartment and Villa properties',
  path: ['bhk']
})
.refine((data) => {
  // Budget max should be greater than or equal to budget min
  if (data.budgetMin !== undefined && data.budgetMax !== undefined) {
    return data.budgetMax >= data.budgetMin;
  }
  return true;
}, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax']
});

// Schema for creating a new buyer (without ID and timestamps)
export const createBuyerSchema = buyerSchema;

// Schema for updating a buyer (all fields optional except ID)
export const updateBuyerSchema = buyerSchema.partial().extend({
  id: z.string().uuid('Invalid buyer ID'),
  updatedAt: z.date().optional(), // For optimistic concurrency control
});

// Schema for CSV import
export const csvBuyerSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.string().email().optional().or(z.literal('')),
  phone: phoneSchema,
  city: citySchema,
  propertyType: propertyTypeSchema,
  bhk: bhkSchema.optional().or(z.literal('')),
  purpose: purposeSchema,
  budgetMin: z.string().transform((val) => {
    if (!val || val === '') return undefined;
    const num = parseInt(val);
    return isNaN(num) ? undefined : num;
  }).optional(),
  budgetMax: z.string().transform((val) => {
    if (!val || val === '') return undefined;
    const num = parseInt(val);
    return isNaN(num) ? undefined : num;
  }).optional(),
  timeline: timelineSchema,
  source: sourceSchema,
  notes: z.string().max(1000).optional().or(z.literal('')),
  tags: z.string().transform((val) => {
    if (!val || val === '') return [];
    return val.split(',').map(tag => tag.trim()).filter(Boolean);
  }).optional().or(z.literal('')),
  status: statusSchema.default('New'),
})
.refine((data) => {
  // BHK validation for CSV
  if (['Apartment', 'Villa'].includes(data.propertyType)) {
    return data.bhk !== undefined && data.bhk !== '';
  }
  return true;
}, {
  message: 'BHK is required for Apartment and Villa properties',
  path: ['bhk']
})
.refine((data) => {
  // Budget validation for CSV
  if (data.budgetMin !== undefined && data.budgetMax !== undefined) {
    return data.budgetMax >= data.budgetMin;
  }
  return true;
}, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax']
});

// Query parameters schema for filtering
// export const buyerQuerySchema = z.object({
//   page: z.string().transform(Number).pipe(z.number().int().min(1)).default('1'),
//   limit: z.string().transform(Number).pipe(z.number().int().min(1).max(100)).default('10'),
//   search: z.string().optional(),
//   city: citySchema.optional(),
//   propertyType: propertyTypeSchema.optional(),
//   status: statusSchema.optional(),
//   timeline: timelineSchema.optional(),
//   sortBy: z.enum(['fullName', 'updatedAt', 'createdAt', 'city', 'status']).default('updatedAt'),
//   sortOrder: z.enum(['asc', 'desc']).default('desc'),
// });

// Export types
export type BuyerInput = z.infer<typeof buyerSchema>;
export type CreateBuyerInput = z.infer<typeof createBuyerSchema>;
export type UpdateBuyerInput = z.infer<typeof updateBuyerSchema>;
export type CsvBuyerInput = z.infer<typeof csvBuyerSchema>;
// export type BuyerQuery = z.infer<typeof buyerQuerySchema>;

// Validation helper functions
export function validateBuyer(data: unknown) {
  return buyerSchema.safeParse(data);
}

export function validateCreateBuyer(data: unknown) {
  return createBuyerSchema.safeParse(data);
}

export function validateUpdateBuyer(data: unknown) {
  return updateBuyerSchema.safeParse(data);
}

export function validateCsvBuyer(data: unknown) {
  return csvBuyerSchema.safeParse(data);
}

// export function validateBuyerQuery(data: unknown) {
//   return buyerQuerySchema.safeParse(data);
// }