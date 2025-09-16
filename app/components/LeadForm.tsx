"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { validateCreateBuyer } from "@/app/utils/validation";
import { Resolver } from "react-hook-form";
import { CreateBuyerInput } from "@/app/utils/validation";
import { useRouter } from 'next/navigation';

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

const createBuyerResolver: Resolver<any> = async (values) => {

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

export default function LeadForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
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

  const onSubmit = async (data: CreateBuyerInput) => {
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
        if (result.errors) {
          // Validation errors from Zod
          setError(result.errors.fieldErrors);
        } else {
          setError({ general: result.message });
        }
        setLoading(false);
        return;
      }
      
      setSuccess(true);
      form.reset(); // clear form after success
      router.push('/buyers');
    } catch (err) {
      console.error(err);
      setError({ general: "Something went wrong!" });
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg border border-gray-200 overflow-auto max-h-[95vh]">
        <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">Create Buyer Lead</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-gray-700 text-sm font-medium">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} className="h-10 bg-gray-50 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-gray-700 text-sm font-medium">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email (optional)" {...field} className="h-10 bg-gray-50 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-gray-700 text-sm font-medium">Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} className="h-10 bg-gray-50 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm" />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* City & Property Type */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-gray-700 text-sm font-medium">City</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 bg-gray-50 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"].map((city) => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-gray-700 text-sm font-medium">Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 bg-gray-50 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Apartment", "Villa", "Plot", "Office", "Retail"].map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* BHK (conditional) */}
            {["Apartment", "Villa"].includes(watchPropertyType) && (
              <FormField
                control={form.control}
                name="bhk"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-gray-700 text-sm font-medium">BHK</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 bg-gray-50 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm">
                          <SelectValue placeholder="Select BHK" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["1", "2", "3", "4", "Studio"].map((bhk) => (
                          <SelectItem key={bhk} value={bhk}>{bhk}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            )}

            {/* Budget Min & Max */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="budgetMin"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-gray-700 text-sm font-medium">Budget Min</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Min" {...field} className="h-10 bg-gray-50 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm" value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budgetMax"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-gray-700 text-sm font-medium">Budget Max</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Max" {...field} className="h-10 bg-gray-50 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm" value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Timeline & Source */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="timeline"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-gray-700 text-sm font-medium">Timeline</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 bg-gray-50 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["0-3m", "3-6m", ">6m", "Exploring"].map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-gray-700 text-sm font-medium">Source</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 bg-gray-50 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm">
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Website", "Referral", "Walk-in", "Call", "Other"].map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-gray-700 text-sm font-medium">Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes" {...field} className="bg-gray-50 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm" rows={3} />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-gray-700 text-sm font-medium">Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter tags separated by commas"
                      onChange={(e) => field.onChange(
                        e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                      )}
                      className="h-10 bg-gray-50 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md shadow transition-colors text-sm">
              Create Lead
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
