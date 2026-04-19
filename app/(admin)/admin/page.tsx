"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  Package, 
  Clock, 
  Users, 
  Coins, 
  Percent,
  ArrowUpRight,
  ChevronRight,
  Gem,
  User,
  CreditCard,
  Tag,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(err => console.error('Failed to fetch analytics:', err))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050810]">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  const stats = [
    { 
      label: "Today's Revenue", 
      value: data?.todayRevenue?.toLocaleString() || "0", 
      unit: "INR", 
      trend: `${data?.todayOrders || 0} orders today`, 
      icon: Coins, 
      color: "text-gold",
      bg: "bg-gold/10"
    },
    { 
      label: "Total Orders", 
      value: data?.totalOrders?.toLocaleString() || "0", 
      unit: "", 
      trend: "All time", 
      icon: Package, 
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    { 
      label: "Pending Approvals", 
      value: data?.pendingApprovals?.toString() || "0", 
      unit: "", 
      trend: "View Queue", 
      icon: Clock, 
      color: "text-orange-400",
      bg: "bg-orange-400/10",
      href: "/admin/payments"
    },
    { 
      label: "Active Users", 
      value: data?.activeUsers?.toString() || "0", 
      unit: "", 
      trend: `${data?.todayUsers || 0} new today`, 
      icon: Users, 
      color: "text-green-400",
      bg: "bg-green-400/10"
    },
    { 
      label: "Total Revenue", 
      value: data?.totalRevenue?.toLocaleString() || "0", 
      unit: "INR", 
      trend: "Since launch", 
      icon: TrendingUp, 
      color: "text-gold",
      bg: "bg-gold/10"
    },
    { 
      label: "Total Registered", 
      value: data?.totalUsers?.toLocaleString() || "0", 
      unit: "", 
      trend: "System wide", 
      icon: Percent, 
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
  ];

  const quickActions = [
    { label: "Add Package", icon: Gem, href: "/admin/packages", color: "text-gold" },
    { label: "Add Account", icon: User, href: "/admin/accounts", color: "text-gold" },
    { label: "Approve Payments", icon: CreditCard, href: "/admin/payments", color: "text-orange-400", badge: data?.pendingApprovals > 0 ? data.pendingApprovals.toString() : null },
    { label: "Create Coupon", icon: Tag, href: "/admin/coupons", color: "text-gold" },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-heading text-white uppercase tracking-tighter">
            Admin Dashboard
          </h1>
          <p className="text-gray-400 font-medium text-sm mt-1">{today}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#0d1120] border border-gold/5 rounded-2xl p-5 hover:border-gold/20 transition-all group"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", stat.bg)}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-baseline space-x-1">
                <span className={cn("text-xl font-black font-heading tracking-tight", stat.color)}>
                  {stat.value}
                </span>
                {stat.unit && <span className="text-[10px] text-gray-500 font-bold">{stat.unit}</span>}
              </div>
              {stat.href ? (
                <Link href={stat.href} className="text-[10px] font-bold text-gold hover:underline flex items-center space-x-1">
                  <span>{stat.trend}</span>
                  <ChevronRight size={10} />
                </Link>
              ) : (
                <p className={cn(
                  "text-[10px] font-bold flex items-center space-x-1",
                  stat.trend.includes('+') ? "text-green-400" : "text-gray-500"
                )}>
                  {stat.trend.includes('+') && <ArrowUpRight size={10} />}
                  <span>{stat.trend}</span>
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black font-heading text-white uppercase tracking-tighter">
              Recent Orders
            </h2>
            <Link href="/admin/orders" className="text-xs font-bold text-gold hover:underline uppercase tracking-widest">
              View All
            </Link>
          </div>
          <div className="bg-[#0d1120] border border-gold/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/2">
                    {["Order ID", "Player", "Type", "Amount", "Status", "Time"].map((head) => (
                      <th key={head} className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data?.recentOrders?.length > 0 ? data.recentOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gold/[0.03] transition-colors group">
                      <td className="px-6 py-4 text-xs font-bold text-white group-hover:text-gold transition-colors">{order.id}</td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-300">{order.player}</td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-400">{order.type}</td>
                      <td className="px-6 py-4 text-xs font-bold text-white">{order.amount}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                          order.status === "Completed" && "bg-green-400/10 text-green-400",
                          order.status === "Processing" && "bg-blue-400/10 text-blue-400",
                          order.status === "Pending" && "bg-orange-400/10 text-orange-400",
                          order.status === "Failed" && "bg-red-400/10 text-red-400"
                        )}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-gray-500 italic">{order.time}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-black font-heading text-white uppercase tracking-tighter">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="bg-[#0d1120] border border-gold/5 rounded-2xl p-5 hover:border-gold/30 hover:bg-gold/[0.02] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-gold transition-colors">
                    <action.icon size={20} />
                  </div>
                  <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{action.label}</span>
                </div>
                <div className="flex items-center space-x-3">
                  {action.badge && (
                    <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {action.badge}
                    </span>
                  )}
                  <ChevronRight size={16} className="text-gray-600 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
