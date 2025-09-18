"use client"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { Download, Plus, Users } from "lucide-react"
import { usePathname } from "next/navigation";
import { ImportModal } from "./ImportModal";

export default function Header() {
    const pathname = usePathname();
    
    return (
        <div className="bg-gradient-to-r from-white via-gray-50/50 to-white border-b border-gray-300 pb-6 mb-6 mt-4 px-6 max-w-7xl w-full">
            <div className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-start ">
                {/* Title Section */}
                <div className="text-center lg:text-left ">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                        <div className="p-2.5 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/25">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r">
                            Buyers
                        </h1>
                    </div>
                    <p className="text-gray-600 text-base font-medium ">
                        Manage and track your buyer information effectively
                    </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto lg:min-w-[280px] sm:justify-center ">
                    <ImportModal/>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full sm:w-auto h-11 px-6 rounded-2xl border-2 border-gray-200/80 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                    <Link href="/buyers/new" className="w-full sm:w-auto">
                        <Button 
                            variant="blue" 
                            size="sm" 
                            className="w-full h-11 px-6 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] border-0"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Buyer
                        </Button>
                    </Link>
                </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="mt-8 pt-6  border-gray-200/60">
                <nav className="flex items-center justify-center lg:justify-start">
                    <ul className="flex items-center gap-8">
                        <li>
                            <Link
                                href="/"
                                className={`relative px-2 py-3 font-bold text-base transition-all duration-300 hover:scale-105 ${
                                    pathname === "/" 
                                        ? "text-blue-600" 
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                All Buyers
                                {pathname === "/" && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg shadow-blue-500/50 animate-pulse" />
                                )}
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/buyers"
                                className={`relative px-2 py-3 font-bold text-base transition-all duration-300 hover:scale-105 ${
                                    pathname === "/buyers"
                                        ? "text-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                Your Leads
                                {pathname === "/buyers" && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg shadow-blue-500/50 animate-pulse" />
                                )}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}