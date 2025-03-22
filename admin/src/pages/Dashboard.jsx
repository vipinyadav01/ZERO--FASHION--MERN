import  { useState, useEffect } from 'react';
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
    ArrowUpRight
} from 'lucide-react';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [greeting, setGreeting] = useState('');

    // Main color theme
    const primaryColor = "#131313"; // Dark background
    const secondaryColor = "#939393"; // Gray text/secondary
    const accentColor = "#ff6200"; // Orange accent/highlight

    useEffect(() => {
        updateDateTime();
        setCurrentUser(sessionStorage.getItem("user") || "Guest");
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
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 mx-auto" style={{ borderColor: accentColor }}></div>
                    <p style={{ color: secondaryColor }} className="font-medium text-lg">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen antialiased py-6 px-4 sm:px-6" style={{ backgroundColor: primaryColor }}>
            {/* Main Content */}
            <main className="max-w-7xl mx-auto">
                {/* Welcome Bento Box */}
                <section className="rounded-3xl shadow-2xl p-6 sm:p-8 mb-8 relative overflow-hidden" 
                    style={{ 
                        background: `linear-gradient(135deg, ${primaryColor}, #1c1c1c)`,
                        borderWidth: '1px',
                        borderColor: '#2a2a2a',
                    }}>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-2 animate-fade-in" style={{ color: 'white' }}>
                                {greeting}, {currentUser}!
                            </h2>
                            <p className="text-base sm:text-lg mb-4" style={{ color: secondaryColor }}>
                                Welcome to your Zero Fashion dashboard
                            </p>
                            <div className="flex items-center gap-2 text-sm" style={{ color: secondaryColor }}>
                                <Clock className="h-4 w-4" style={{ color: accentColor }} />
                                <span>{currentDateTime}</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-full" style={{ backgroundColor: 'rgba(255, 98, 0, 0.15)' }}>
                            <Sparkles className="h-12 w-12" style={{ color: accentColor }} />
                        </div>
                    </div>

                    {/* Abstract decorative elements */}
                    <div className="absolute top-0 right-0 rounded-full opacity-20 w-64 h-64 -mt-32 -mr-32" 
                        style={{ backgroundColor: accentColor, filter: 'blur(40px)' }}></div>
                    <div className="absolute bottom-0 left-0 rounded-full opacity-10 w-40 h-40 -mb-20 -ml-20" 
                        style={{ backgroundColor: accentColor, filter: 'blur(30px)' }}></div>
                </section>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Performance Insight */}
                    <div className="md:col-span-1 lg:col-span-1 rounded-3xl shadow-lg p-5 hover:shadow-md transition-all duration-300"
                        style={{ 
                            backgroundColor: '#1a1a1a', 
                            borderWidth: '1px',
                            borderColor: '#2a2a2a',
                        }}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 98, 0, 0.15)' }}>
                                <TrendingUp className="h-6 w-6" style={{ color: accentColor }} />
                            </div>
                        </div>
                        <h3 style={{ color: secondaryColor }} className="text-sm font-medium mb-1">Monthly Sales Growth</h3>
                        <p className="text-2xl font-bold truncate" style={{ color: 'white' }}>{mockInsights.salesTrend}</p>
                        <span className="text-xs mt-2 inline-block px-2 py-1 rounded-full" 
                            style={{ backgroundColor: 'rgba(255, 98, 0, 0.15)', color: accentColor }}>
                            Outperforming target
                        </span>
                    </div>

                    {/* Goal Progress */}
                    <div className="md:col-span-1 lg:col-span-1 rounded-3xl shadow-lg p-5 hover:shadow-md transition-all duration-300"
                        style={{ 
                            backgroundColor: '#1a1a1a', 
                            borderWidth: '1px',
                            borderColor: '#2a2a2a',
                        }}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 98, 0, 0.15)' }}>
                                <PieChart className="h-6 w-6" style={{ color: accentColor }} />
                            </div>
                        </div>
                        <h3 style={{ color: secondaryColor }} className="text-sm font-medium mb-1">Monthly Target</h3>
                        <p className="text-2xl font-bold truncate" style={{ color: 'white' }}>{mockInsights.monthlyTarget}</p>
                        
                        {/* Progress bar */}
                        <div className="w-full h-2 bg-gray-700 rounded-full mt-3">
                            <div className="h-2 rounded-full" style={{ width: mockInsights.monthlyTarget, backgroundColor: accentColor }}></div>
                        </div>
                    </div>

                    {/* Top Category */}
                    <div className="md:col-span-1 lg:col-span-1 rounded-3xl shadow-lg p-5 hover:shadow-md transition-all duration-300"
                        style={{ 
                            backgroundColor: '#1a1a1a', 
                            borderWidth: '1px',
                            borderColor: '#2a2a2a',
                        }}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 98, 0, 0.15)' }}>
                                <Star className="h-6 w-6" style={{ color: accentColor }} />
                            </div>
                        </div>
                        <h3 style={{ color: secondaryColor }} className="text-sm font-medium mb-1">Top Category</h3>
                        <p className="text-2xl font-bold truncate" style={{ color: 'white' }}>{mockInsights.topCategory}</p>
                        <p className="text-xs mt-2" style={{ color: secondaryColor }}>
                            32% of total sales this month
                        </p>
                    </div>

                    {/* Customer Satisfaction */}
                    <div className="md:col-span-1 lg:col-span-1 rounded-3xl shadow-lg p-5 hover:shadow-md transition-all duration-300"
                        style={{ 
                            backgroundColor: '#1a1a1a', 
                            borderWidth: '1px',
                            borderColor: '#2a2a2a',
                        }}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 98, 0, 0.15)' }}>
                                <Heart className="h-6 w-6" style={{ color: accentColor }} />
                            </div>
                        </div>
                        <h3 style={{ color: secondaryColor }} className="text-sm font-medium mb-1">Customer Satisfaction</h3>
                        <p className="text-2xl font-bold truncate" style={{ color: 'white' }}>{mockInsights.customerSatisfaction}</p>
                        <div className="flex mt-2">
                            {[1, 2, 3, 4, 5].map((star, i) => (
                                <Star key={i} className="h-4 w-4" fill={i < 4.8 ? accentColor : 'none'} style={{ color: accentColor }} />
                            ))}
                        </div>
                    </div>

                    {/* Tips & Recommendations - Larger box */}
                    <div className="md:col-span-2 lg:col-span-2 rounded-3xl shadow-lg p-6 hover:shadow-md transition-all duration-300"
                        style={{ 
                            backgroundColor: '#1a1a1a', 
                            borderWidth: '1px',
                            borderColor: '#2a2a2a',
                        }}>
                        <div className="flex items-center mb-5">
                            <Lightbulb className="h-6 w-6 mr-3" style={{ color: accentColor }} />
                            <h3 className="text-xl font-semibold" style={{ color: 'white' }}>Tips & Insights</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl hover:translate-y-1 transition-all duration-200"
                                style={{ backgroundColor: 'rgba(255, 98, 0, 0.1)', borderLeft: `3px solid ${accentColor}` }}>
                                <h4 className="font-medium mb-1" style={{ color: accentColor }}>Optimize Inventory</h4>
                                <p className="text-sm" style={{ color: secondaryColor }}>
                                    5 products are running low on stock. Consider restocking "Winter Collection" items before the season begins.
                                </p>
                            </div>
                            
                            <div className="p-4 rounded-xl hover:translate-y-1 transition-all duration-200"
                                style={{ backgroundColor: 'rgba(255, 98, 0, 0.1)', borderLeft: `3px solid ${accentColor}` }}>
                                <h4 className="font-medium mb-1" style={{ color: accentColor }}>Enhance Product Images</h4>
                                <p className="text-sm" style={{ color: secondaryColor }}>
                                    Products with multiple angles in their gallery have 43% higher conversion rates. Consider updating your top sellers.
                                </p>
                            </div>
                            
                            <div className="p-4 rounded-xl hover:translate-y-1 transition-all duration-200"
                                style={{ backgroundColor: 'rgba(255, 98, 0, 0.1)', borderLeft: `3px solid ${accentColor}` }}>
                                <h4 className="font-medium mb-1" style={{ color: accentColor }}>Run Flash Sale Campaign</h4>
                                <p className="text-sm" style={{ color: secondaryColor }}>
                                    Historical data shows Tuesday evenings have peak engagement. Schedule your next promotion then for maximum impact.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Promotions */}
                    <div className="md:col-span-1 lg:col-span-1 rounded-3xl shadow-lg p-5 hover:shadow-md transition-all duration-300"
                        style={{ 
                            backgroundColor: '#1a1a1a', 
                            borderWidth: '1px',
                            borderColor: '#2a2a2a',
                        }}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 98, 0, 0.15)' }}>
                                <Zap className="h-6 w-6" style={{ color: accentColor }} />
                            </div>
                        </div>
                        <h3 style={{ color: secondaryColor }} className="text-sm font-medium mb-1">Next Promotion</h3>
                        <p className="text-lg font-bold" style={{ color: 'white' }}>{mockInsights.nextPromotion}</p>
                        <div className="flex items-center mt-3">
                            <Calendar className="h-4 w-4 mr-2" style={{ color: accentColor }} />
                            <span className="text-xs" style={{ color: secondaryColor }}>Starts in 5 days</span>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="md:col-span-1 lg:col-span-1 rounded-3xl shadow-lg p-5 hover:shadow-md transition-all duration-300"
                        style={{ 
                            backgroundColor: '#1a1a1a', 
                            borderWidth: '1px',
                            borderColor: '#2a2a2a',
                        }}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 98, 0, 0.15)' }}>
                                <Award className="h-6 w-6" style={{ color: accentColor }} />
                            </div>
                        </div>
                        <h3 style={{ color: secondaryColor }} className="text-sm font-medium mb-3">Your Tasks</h3>
                        
                        <div className="space-y-2.5">
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: accentColor }}></div>
                                <p className="text-sm" style={{ color: 'white' }}>Approve new products</p>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: accentColor }}></div>
                                <p className="text-sm" style={{ color: 'white' }}>Review customer feedback</p>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: accentColor }}></div>
                                <p className="text-sm" style={{ color: 'white' }}>Update promo banners</p>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: accentColor }}></div>
                                <p className="text-sm" style={{ color: 'white' }}>Schedule social posts</p>
                            </div>
                        </div>
                        
                        <button className="mt-4 w-full py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-1" 
                            style={{ backgroundColor: accentColor, color: 'white' }}>
                            View All Tasks <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;