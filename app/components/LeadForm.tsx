"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { validateCreateBuyer } from "@/app/utils/validation";
import { Resolver } from "react-hook-form";
import { CreateBuyerInput } from "@/app/utils/validation";
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, User, Mail, Phone, MapPin, Home, Calendar, Tag, FileText, Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";

import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertDescription } from "./ui/alert";

// Constants moved outside component to prevent re-creation
const CITIES = ["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"];
const PROPERTY_TYPES = ["Apartment", "Villa", "Plot", "Office", "Retail"];
const BHK_OPTIONS = ["1", "2", "3", "4", "Studio"];
const TIMELINE_OPTIONS = ["0-3m", "3-6m", ">6m", "Exploring"];
const SOURCE_OPTIONS = ["Website", "Referral", "Walk-in", "Call", "Other"];
const PROPERTY_TYPES_WITH_BHK = ["Apartment", "Villa"];

const createBuyerResolver: Resolver<CreateBuyerInput> = async (values) => {
  const payload = {
    ...values,
    budgetMin: values.budgetMin ? Number(values.budgetMin) : undefined,
    budgetMax: values.budgetMax ? Number(values.budgetMax) : undefined,
  };
  
  const result = validateCreateBuyer(payload);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const fieldErrors = result.error.flatten().fieldErrors;
  const errors: Record<string, any> = {};

  (Object.keys(fieldErrors) as (keyof typeof fieldErrors)[]).forEach((key) => {
    if (fieldErrors[key]?.length) {
      errors[key] = { type: 'manual', message: fieldErrors[key]![0] };
    }
  });

  return { values: {}, errors };
};

interface ApiError {
  fieldErrors?: Record<string, string[]>;
  general?: string;
}

export default function LeadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<CreateBuyerInput>({
    resolver: createBuyerResolver,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      city: "Chandigarh",
      propertyType: "Apartment",
      bhk: "1",
      purpose: "Buy",
      budgetMin: undefined,
      budgetMax: undefined,
      timeline: "Exploring",
      source: "Other",
      status: "New",
      notes: "",
      tags: [],
    },
  });

  const watchPropertyType = form.watch("propertyType");
  const showBhkField = PROPERTY_TYPES_WITH_BHK.includes(watchPropertyType);

  const onSubmit = useCallback(async (data: CreateBuyerInput) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/buyers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        const apiError: ApiError = {};
        if (result.errors) {
          apiError.fieldErrors = result.errors.fieldErrors;
        } else {
          apiError.general = result.message || "Failed to create buyer lead";
        }
        setError(apiError);
        return;
      }
      
      setSuccess(true);
      form.reset();
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push('/buyers');
      }, 1500);
      
    } catch (err) {
      console.error("Form submission error:", err);
      setError({ general: "Network error. Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  }, [form, router]);

  const handleTagsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    form.setValue("tags", tags);
  }, [form]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-200/30 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-200/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="w-full max-full relative z-10 px-8 py-4">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100/50 backdrop-blur-sm overflow-hidden">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30">
                <User className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Buyer Lead</h1>
              <p className="text-blue-100 text-lg">Add a new potential buyer to your pipeline</p>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/10 rounded-full"></div>
          </div>

          <div className="p-8 space-y-8">
            {/* Enhanced Success Alert */}
            {success && (
              <Alert className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm animate-in slide-in-from-top-2 duration-300">
                <AlertDescription className="text-green-800 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="font-medium">Lead created successfully! Redirecting to buyers list...</span>
                </AlertDescription>
              </Alert>
            )}

            {/* Enhanced Error Alert */}
            {error?.general && (
              <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-rose-50 shadow-sm animate-in slide-in-from-top-2 duration-300">
                <AlertDescription className="text-red-800 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="font-medium">{error.general}</span>
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-blue-100 to-indigo-100">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-gray-700 text-sm font-semibold flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            Full Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter full name"
                              {...field}
                              className="h-12 bg-gray-50/50 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs font-medium" />
                        </FormItem>
                      )}
                    />

                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-gray-700 text-sm font-semibold flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            Phone *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="Enter phone number"
                              {...field}
                              className="h-12 bg-gray-50/50 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                              disabled={loading}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs font-medium" />
                        </FormItem>
                      )}
                    />
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-gray-700 text-sm font-semibold flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email (optional)"
                            {...field}
                            className="h-12 bg-gray-50/50 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs font-medium" />
                      </FormItem>
                    )}
                  />
                  </div>

                </div>

                {/* Property Preferences Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-blue-100 to-indigo-100">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Home className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Property Preferences</h3>
                  </div>

                  {/* City & Property Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-gray-700 text-sm font-semibold flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            City *
                          </FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={loading}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 bg-gray-50/50 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900">
                                <SelectValue placeholder="Select city" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-gray-200 shadow-xl">
                              {CITIES.map((city) => (
                                <SelectItem key={city} value={city} className="rounded-lg hover:bg-gray-50 transition-colors">
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500 text-xs font-medium" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-gray-700 text-sm font-semibold flex items-center gap-2">
                            <Home className="w-4 h-4 text-gray-500" />
                            Property Type *
                          </FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={loading}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 bg-gray-50/50 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-gray-200 shadow-xl">
                              {PROPERTY_TYPES.map((type) => (
                                <SelectItem key={type} value={type} className="rounded-lg hover:bg-gray-50 transition-colors">
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500 text-xs font-medium" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* BHK (conditional) */}
                  {showBhkField && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="bhk"
                        render={({ field }) => (
                          <FormItem className="space-y-2 animate-in slide-in-from-left duration-300">
                            <FormLabel className="text-gray-700 text-sm font-semibold">
                              BHK
                            </FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              disabled={loading}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 bg-gray-50/50 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900">
                                  <SelectValue placeholder="Select BHK" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl border-gray-200 shadow-xl">
                                {BHK_OPTIONS.map((bhk) => (
                                  <SelectItem key={bhk} value={bhk} className="rounded-lg hover:bg-gray-50 transition-colors">
                                    {bhk}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500 text-xs font-medium" />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Budget Min & Max */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="budgetMin"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-gray-700 text-sm font-semibold">
                            Budget Min (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Minimum budget"
                              {...field}
                              className="h-12 bg-gray-50/50 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                              value={field.value ?? ""}
                              disabled={loading}
                              min="0"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs font-medium" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budgetMax"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-gray-700 text-sm font-semibold">
                            Budget Max (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Maximum budget"
                              {...field}
                              className="h-12 bg-gray-50/50 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                              value={field.value ?? ""}
                              disabled={loading}
                              min="0"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs font-medium" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Additional Details Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-gradient-to-r from-blue-100 to-indigo-100">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Additional Details</h3>
                  </div>

                  {/* Timeline & Source */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="timeline"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-gray-700 text-sm font-semibold flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            Timeline
                          </FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={loading}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 bg-gray-50/50 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900">
                                <SelectValue placeholder="Select timeline" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-gray-200 shadow-xl">
                              {TIMELINE_OPTIONS.map((timeline) => (
                                <SelectItem key={timeline} value={timeline} className="rounded-lg hover:bg-gray-50 transition-colors">
                                  {timeline}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500 text-xs font-medium" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-gray-700 text-sm font-semibold">
                            Source
                          </FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={loading}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 bg-gray-50/50 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900">
                                <SelectValue placeholder="Select source" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-gray-200 shadow-xl">
                              {SOURCE_OPTIONS.map((source) => (
                                <SelectItem key={source} value={source} className="rounded-lg hover:bg-gray-50 transition-colors">
                                  {source}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500 text-xs font-medium" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-gray-700 text-sm font-semibold flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          Notes
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional notes or requirements"
                            {...field}
                            className="bg-gray-50/50 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder:text-gray-400 resize-none min-h-[100px]"
                            rows={4}
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs font-medium" />
                      </FormItem>
                    )}
                  />

                  {/* Tags */}
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-gray-700 text-sm font-semibold flex items-center gap-2">
                          <Tag className="w-4 h-4 text-gray-500" />
                          Tags
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter tags separated by commas (e.g., urgent, vip, first-time-buyer)"
                            onChange={handleTagsChange}
                            className="h-12 bg-gray-50/50 border-gray-200 rounded-xl hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs font-medium" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Enhanced Submit Button */}
                <div className="pt-8 border-t border-gray-100">
                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 text-base flex items-center justify-center gap-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating Lead...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Create Lead
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}