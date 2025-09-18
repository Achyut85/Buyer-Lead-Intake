"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { X, Filter, SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useUrlFilters } from "../utils/hooks/useUrlFilters";
import { useRouter } from "next/navigation";

const timelineMap: Record<string, string> = {
    ZERO_TO_THREE_MONTHS: "0-3m",
    THREE_TO_SIX_MONTHS: "3-6m",
    MORE_THAN_SIX_MONTHS: ">6m",
    EXPLORING: "Exploring",
};

export default function BuyerFilters() {
    const { filters, setFilter } = useUrlFilters();
    const activeFiltersCount = Object.values(filters).filter(Boolean).length;
    const router = useRouter();

    return (
        <div className="bg-white/90 backdrop-blur-lg border border-gray-200/60 rounded-3xl shadow-2xl shadow-gray-900/10 overflow-hidden mt-4 max-w-7xl  w-full ">
            {/* Header: Title + Search + Clear All */}
            <div className="p-6 pb-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 text-gray-900">
                            <div className="p-3 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/25">
                                <Filter className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    Buyer Filters
                                </h2>
                                <p className="text-sm text-gray-500 font-medium">Filter and search buyers</p>
                            </div>
                        </div>

                        {activeFiltersCount > 0 && (
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg shadow-blue-500/25 border border-blue-400/30">
                                {activeFiltersCount} active
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        {/* Search Bar */}
                        <div className="relative flex-1 lg:w-80">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 z-1 text-gray-400  " />
                            <Input
                                type="text"
                                placeholder="Search by email or name..."
                                className="pl-11 pr-4 h-12 border-2 border-gray-200/80 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm hover:shadow-md transition-all duration-200 bg-gray-50/50 hover:bg-white backdrop-blur-sm font-medium placeholder:text-gray-400 w-full"
                            />
                        </div>

                        {activeFiltersCount > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-12 px-6 text-gray-600 hover:text-red-500 hover:border-red-300 hover:bg-red-50 font-semibold rounded-2xl transition-all duration-200 border-2 border-gray-200/80 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md whitespace-nowrap"
                                onClick={() =>
                                    setFilter({
                                        city: null,
                                        propertyType: null,
                                        status: null,
                                        timeline: null,
                                    })
                                }
                            >
                                Clear All
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters Grid */}
            <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {/** CITY FILTER **/}
                    <FilterSelect
                        label="City"
                        value={filters.city}
                        options={["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"]}
                        color="blue"
                        onChange={(val) => setFilter("city", val)}
                    />

                    {/** PROPERTY TYPE **/}
                    <FilterSelect
                        label="Property Type"
                        value={filters.propertyType}
                        options={["Apartment", "Villa", "Plot", "Office", "Retail"]}
                        color="emerald"
                        onChange={(val) => setFilter("propertyType", val)}
                    />

                    {/** STATUS **/}
                    <FilterSelect
                        label="Status"
                        value={filters.status}
                        options={["New", "Qualified", "Contacted", "Visited", "Negotiation", "Converted", "Dropped"]}
                        color="purple"
                        onChange={(val) => setFilter("status", val)}
                    />

                    {/** TIMELINE **/}
                    <FilterSelect
                        label="Timeline"
                        value={filters.timeline}
                        options={["ZERO_TO_THREE_MONTHS", "THREE_TO_SIX_MONTHS", "MORE_THAN_SIX_MONTHS", "EXPLORING"]}
                        color="amber"
                        displayMap={{
                            ZERO_TO_THREE_MONTHS: "0-3 Months",
                            THREE_TO_SIX_MONTHS: "3-6 Months",
                            MORE_THAN_SIX_MONTHS: ">6 Months",
                            EXPLORING: "Exploring",
                        }}
                        onChange={(val) => setFilter("timeline", val)}
                    />
                </div>

                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200/60">
                        <div className="flex items-center gap-3 mb-5">
                            <h3 className="text-sm font-bold text-gray-700">Active Filters</h3>
                            <div className="flex-1 h-px bg-gradient-to-r from-gray-300 via-gray-200 to-transparent"></div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {filters.city && (
                                <ActiveFilterTag
                                    label="City"
                                    value={filters.city}
                                    color="blue"
                                    onRemove={() => setFilter("city", "")}
                                />
                            )}
                            {filters.propertyType && (
                                <ActiveFilterTag
                                    label="Type"
                                    value={filters.propertyType}
                                    color="emerald"
                                    onRemove={() => setFilter("propertyType", "")}
                                />
                            )}
                            {filters.status && (
                                <ActiveFilterTag
                                    label="Status"
                                    value={filters.status}
                                    color="purple"
                                    onRemove={() => setFilter("status", "")}
                                />
                            )}
                            {filters.timeline && (
                                <ActiveFilterTag
                                    label="Timeline"
                                    value={timelineMap[filters.timeline] || filters.timeline}
                                    color="amber"
                                    onRemove={() => setFilter("timeline", "")}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/** Reusable FilterSelect component **/
interface FilterSelectProps {
    label: string;
    value: string;
    options: string[];
    color: 'blue' | 'emerald' | 'purple' | 'amber';
    displayMap?: Record<string, string>;
    onChange: (val: string) => void;
}

function FilterSelect({ label, value, options, color, displayMap, onChange }: FilterSelectProps) {
    const colorConfig = {
        blue: {
            dot: 'bg-blue-500',
            border: 'hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500/15',
            content: 'hover:bg-blue-50/80 focus:bg-blue-50/80'
        },
        emerald: {
            dot: 'bg-emerald-500',
            border: 'hover:border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/15',
            content: 'hover:bg-emerald-50/80 focus:bg-emerald-50/80'
        },
        purple: {
            dot: 'bg-purple-500',
            border: 'hover:border-purple-300 focus:border-purple-500 focus:ring-purple-500/15',
            content: 'hover:bg-purple-50/80 focus:bg-purple-50/80'
        },
        amber: {
            dot: 'bg-amber-500',
            border: 'hover:border-amber-300 focus:border-amber-500 focus:ring-amber-500/15',
            content: 'hover:bg-amber-50/80 focus:bg-amber-50/80'
        }
    };

    const config = colorConfig[color];

    return (
        <div className="space-y-3 relative group">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2.5 mb-1">
                <div className={`w-2.5 h-2.5 ${config.dot} rounded-full shadow-sm`}></div>
                {label}
            </label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className={`w-full h-14 rounded-2xl border-2 border-gray-200/80 ${config.border} transition-all duration-300 bg-gray-50/50 hover:bg-white backdrop-blur-sm shadow-sm hover:shadow-lg font-medium text-gray-700 group-hover:scale-[1.02]`}>
                    <SelectValue placeholder={`Choose ${label.toLowerCase()}`} className="font-medium" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-2xl border-0 bg-white/95 backdrop-blur-lg p-2">
                    {options.map((opt) => (
                        <SelectItem
                            key={opt}
                            value={opt}
                            className={`rounded-xl ${config.content} my-1.5 font-medium text-gray-700 px-4 py-3 transition-all duration-200 cursor-pointer hover:scale-[1.02]`}
                        >
                            {displayMap?.[opt] ?? opt}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>


        </div>
    );
}

/** Reusable ActiveFilterTag component **/
interface ActiveFilterTagProps {
    label: string;
    value: string;
    color: 'blue' | 'emerald' | 'purple' | 'amber';
    onRemove: () => void;
}

function ActiveFilterTag({ label, value, color, onRemove }: ActiveFilterTagProps) {
    const colorConfig = {
        blue: {
            bg: 'bg-gradient-to-r from-blue-100 to-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            dot: 'bg-blue-500',
            button: 'text-blue-600 hover:text-blue-800 hover:bg-blue-200'
        },
        emerald: {
            bg: 'bg-gradient-to-r from-emerald-100 to-emerald-50',
            border: 'border-emerald-200',
            text: 'text-emerald-800',
            dot: 'bg-emerald-500',
            button: 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-200'
        },
        purple: {
            bg: 'bg-gradient-to-r from-purple-100 to-purple-50',
            border: 'border-purple-200',
            text: 'text-purple-800',
            dot: 'bg-purple-500',
            button: 'text-purple-600 hover:text-purple-800 hover:bg-purple-200'
        },
        amber: {
            bg: 'bg-gradient-to-r from-amber-100 to-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-800',
            dot: 'bg-amber-500',
            button: 'text-amber-600 hover:text-amber-800 hover:bg-amber-200'
        }
    };

    const config = colorConfig[color];

    return (
        <div className={`inline-flex items-center gap-3 ${config.bg} border ${config.border} ${config.text} px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm`}>
            <div className={`w-2 h-2 ${config.dot} rounded-full`}></div>
            <span className="font-bold text-xs uppercase tracking-wide">{label}:</span>
            <span className="font-medium">{value}</span>
            <button
                onClick={onRemove}
                className={`${config.button} rounded-full p-1.5 transition-all duration-200 ml-1 hover:scale-110`}
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}