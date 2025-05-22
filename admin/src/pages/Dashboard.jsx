import { useState, useEffect } from 'react';
import { backendUrl } from "../App";
import axios from 'axios';
import {
    Sparkles,
    Clock,
    Calendar,
    Award,
    TrendingUp,
    Zap,
    Lightbulb,
    PieChart,
    Star,
    Heart,
    User,
    ArrowUpRight,
    CheckCircle2,
    AlertCircle,
    ShoppingBag
} from 'lucide-react';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [greeting, setGreeting] = useState('');

    // Updated color theme to match our new aesthetic
    const primaryColor = "#0f172a"; // Dark slate background
    const secondaryColor = "#94a3b8"; // Slate text
    const darkBgColor = "#1e293b"; // Darker slate for cards
    const accentFromColor = "#4f46e5"; // Indigo
    const accentToColor = "#7e22ce"; // Purple

    useEffect(() => {
        updateDateTime();
        setCurrentUser(sessionStorage.getItem("user") || "Vipin Yadav");
        setGreeting(getGreeting());
        setTimeout(() => setIsLoading(false), 800);
        const timer = setInterval(() => {
            updateDateTime();
            setGreeting(getGreeting());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Good Morning";
        if (hour >= 12 && hour < 18) return "Good Afternoon";
        if (hour >= 18 && hour < 22) return "Good Evening";
        return "Good Night";
    };

    const updateDateTime = () => {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        setCurrentDateTime(now.toLocaleDateString(undefined, options));
    };

    // Mock data for dashboard insights
    const mockInsights = {
        salesTrend: "+12.7%",
        monthlyTarget: "86%",
        topCategory: "Outerwear",
        customerSatisfaction: "4.8/5",
        nextPromotion: "Summer Flash Sale",
        pendingTasks: 4
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="text-center space-y-4">
                    <div className="h-12 w-12 mx-auto relative">
                        <div className="absolute inset-0 rounded-full animate-pulse bg-indigo-600/20"></div>
                        <div className="absolute inset-0 rounded-full animate-spin border-2 border-transparent border-t-indigo-500"></div>
                    </div>
                    <p className="text-slate-400 font-medium text-lg">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen antialiased py-20 px-4 sm:px-6 bg-slate-900">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto">
                {/* Welcome Section */}
                <section className="rounded-3xl shadow-xl p-6 sm:p-8 mb-8 relative overflow-hidden 
                    bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
                                {greeting}, {currentUser}!
                            </h2>
                            <p className="text-base sm:text-lg mb-4 text-slate-300">
                                Welcome to your Zero Fashion dashboard
                            </p>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <Clock className="h-4 w-4 text-indigo-400" />
                                <span>{currentDateTime}</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 
                            backdrop-blur-sm border border-indigo-500/20">
                            <Sparkles className="h-12 w-12 text-indigo-400" />
                        </div>
                    </div>

                    {/* Abstract decorative elements */}
                    <div className="absolute top-0 right-0 rounded-full opacity-20 w-64 h-64 -mt-32 -mr-32 
                        bg-indigo-500 blur-[50px]"></div>
                    <div className="absolute bottom-0 left-0 rounded-full opacity-10 w-40 h-40 -mb-20 -ml-20 
                        bg-purple-600 blur-[40px]"></div>
                </section>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Performance Insight */}
                    <div className="md:col-span-1 lg:col-span-1 rounded-3xl shadow-lg p-5 hover:shadow-xl transition-all duration-300
                        bg-slate-800 border border-slate-700 hover:translate-y-[-2px] group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors duration-300">
                                <TrendingUp className="h-6 w-6 text-indigo-400" />
                            </div>
                        </div>
                        <h3 className="text-sm font-medium mb-1 text-slate-400">Monthly Sales Growth</h3>
                        <p className="text-2xl font-bold truncate text-white">{mockInsights.salesTrend}</p>
                        <span className="text-xs mt-2 inline-block px-2 py-1 rounded-full 
                            bg-green-500/20 text-green-400 border border-green-500/20">
                            Outperforming target
                        </span>
                    </div>

                    {/* Goal Progress */}
                    <div className="md:col-span-1 lg:col-span-1 rounded-3xl shadow-lg p-5 hover:shadow-xl transition-all duration-300
                        bg-slate-800 border border-slate-700 hover:translate-y-[-2px] group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors duration-300">
                                <PieChart className="h-6 w-6 text-indigo-400" />
                            </div>
                        </div>
                        <h3 className="text-sm font-medium mb-1 text-slate-400">Monthly Target</h3>
                        <p className="text-2xl font-bold truncate text-white">{mockInsights.monthlyTarget}</p>
                        
                        {/* Progress bar */}
                        <div className="w-full h-2 bg-slate-700 rounded-full mt-3">
                            <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                                style={{ width: mockInsights.monthlyTarget }}></div>
                        </div>
                    </div>

                    {/* Top Category */}
                    <div className="md:col-span-1 lg:col-span-1 rounded-3xl shadow-lg p-5 hover:shadow-xl transition-all duration-300
                        bg-slate-800 border border-slate-700 hover:translate-y-[-2px] group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors duration-300">
                                <ShoppingBag className="h-6 w-6 text-indigo-400" />
                            </div>
                        </div>
                        <h3 className="text-sm font-medium mb-1 text-slate-400">Top Category</h3>
                        <p className="text-2xl font-bold truncate text-white">{mockInsights.topCategory}</p>
                        <p className="text-xs mt-2 text-slate-400">
                            32% of total sales this month
                        </p>
                    </div>

                    {/* Customer Satisfaction */}
                    <div className="md:col-span-1 lg:col-span-1 rounded-3xl shadow-lg p-5 hover:shadow-xl transition-all duration-300
                        bg-slate-800 border border-slate-700 hover:translate-y-[-2px] group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors duration-300">
                                <Heart className="h-6 w-6 text-indigo-400" />
                            </div>
                        </div>
                        <h3 className="text-sm font-medium mb-1 text-slate-400">Customer Satisfaction</h3>
                        <p className="text-2xl font-bold truncate text-white">{mockInsights.customerSatisfaction}</p>
                        <div className="flex mt-2">
                            {[1, 2, 3, 4, 5].map((star, i) => (
                                <Star 
                                    key={i} 
                                    className="h-4 w-4 text-indigo-400" 
                                    fill={i < 4.8 ? "currentColor" : "none"} 
                                />
                            ))}
                        </div>
                    </div>

                    {/* Tips & Recommendations - Larger box */}
                    <div className="md:col-span-2 lg:col-span-2 rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all duration-300
                        bg-slate-800 border border-slate-700 hover:translate-y-[-2px]">
                        <div className="flex items-center mb-5">
                            <div className="p-2 rounded-lg bg-indigo-500/20 mr-3">
                                <Lightbulb className="h-5 w-5 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white">Tips & Insights</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl transition-all duration-200 bg-slate-700/50 border-l-4 border-purple-500 hover:bg-slate-700">
                                <h4 className="font-medium mb-1 text-purple-400">Optimize Inventory</h4>
                                <p className="text-sm text-slate-300">
                                    5 products are running low on stock. Consider restocking "Winter Collection" items before the season begins.
                                </p>
                            </div>
                            
                            <div className="p-4 rounded-xl transition-all duration-200 bg-slate-700/50 border-l-4 border-indigo-500 hover:bg-slate-700">
                                <h4 className="font-medium mb-1 text-indigo-400">Enhance Product Images</h4>
                                <p className="text-sm text-slate-300">
                                    Products with multiple angles in their gallery have 43% higher conversion rates. Consider updating your top sellers.
                                </p>
                            </div>
                            
                            <div className="p-4 rounded-xl transition-all duration-200 bg-slate-700/50 border-l-4 border-blue-500 hover:bg-slate-700">
                                <h4 className="font-medium mb-1 text-blue-400">Run Flash Sale Campaign</h4>
                                <p className="text-sm text-slate-300">
                                    Historical data shows Tuesday evenings have peak engagement. Schedule your next promotion then for maximum impact.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Promotions */}
                    <div className="md:col-span-1 lg:col-span-1 rounded-3xl shadow-lg p-5 hover:shadow-xl transition-all duration-300
                        bg-slate-800 border border-slate-700 hover:translate-y-[-2px] group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors duration-300">
                                <Zap className="h-6 w-6 text-indigo-400" />
                            </div>
                        </div>
                        <h3 className="text-sm font-medium mb-1 text-slate-400">Next Promotion</h3>
                        <p className="text-lg font-bold text-white">{mockInsights.nextPromotion}</p>
                        <div className="flex items-center mt-3">
                            <Calendar className="h-4 w-4 mr-2 text-indigo-400" />
                            <span className="text-xs text-slate-400">Starts in 5 days</span>
                        </div>
                        
                        <button className="mt-4 w-full py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-1 
                            bg-slate-700 text-white hover:bg-slate-600 transition-colors">
                            View Details <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="md:col-span-1 lg:col-span-1 rounded-3xl shadow-lg p-5 hover:shadow-xl transition-all duration-300
                        bg-slate-800 border border-slate-700 hover:translate-y-[-2px] group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors duration-300">
                                <Award className="h-6 w-6 text-indigo-400" />
                            </div>
                        </div>
                        <h3 className="text-sm font-medium mb-3 text-slate-400">Your Tasks</h3>
                        
                        <div className="space-y-2.5">
                            <div className="flex items-center p-2 rounded-lg hover:bg-slate-700/50 transition-colors">
                                <CheckCircle2 className="h-5 w-5 mr-2 text-purple-400" />
                                <p className="text-sm text-white">Approve new products</p>
                            </div>
                            <div className="flex items-center p-2 rounded-lg hover:bg-slate-700/50 transition-colors">
                                <CheckCircle2 className="h-5 w-5 mr-2 text-purple-400" />
                                <p className="text-sm text-white">Review customer feedback</p>
                            </div>
                            <div className="flex items-center p-2 rounded-lg hover:bg-slate-700/50 transition-colors">
                                <AlertCircle className="h-5 w-5 mr-2 text-amber-400" />
                                <p className="text-sm text-white">Update promo banners</p>
                            </div>
                            <div className="flex items-center p-2 rounded-lg hover:bg-slate-700/50 transition-colors">
                                <AlertCircle className="h-5 w-5 mr-2 text-amber-400" />
                                <p className="text-sm text-white">Schedule social posts</p>
                            </div>
                        </div>
                        
                        <button className="mt-4 w-full py-2.5 text-sm font-medium rounded-xl flex items-center justify-center gap-1 
                            bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 
                            transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40">
                            View All Tasks <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;