"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MessageSquare, Mail, Phone, Clock, 
  Send, CheckCircle2, AlertCircle, Loader2,
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SUBJECTS = [
  "Diamond Top-Up Issue",
  "Payment Problem",
  "Account or Login Issue",
  "Refund Request",
  "Other"
];

export default function ContactPage() {
  useEffect(() => {
    document.title = "Contact Support | ArtisanStore.xyz";
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderId: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name.trim() || formData.name.length < 2) newErrors.name = "Name is required (min 2 chars)";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) newErrors.email = "Valid email is required";
    if (!formData.subject) newErrors.subject = "Please select a subject";
    if (!formData.message.trim() || formData.message.length < 10) newErrors.message = "Message must be at least 10 characters";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setServerError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
      } else {
        setServerError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setServerError("Failed to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050810] text-white font-sans antialiased">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-gold font-black text-xs uppercase tracking-[0.2em]">GET IN TOUCH</span>
              <h1 className="text-4xl md:text-6xl font-black font-heading text-white uppercase tracking-tighter leading-none">
                Support<br />Center
              </h1>
              <p className="text-gray-400 text-lg">
                Have a question or need help with your order? Our team is available 24/7 to assist you.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Card className="bg-[#0d1120] border-white/5 p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold flex-shrink-0">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold">Live Chat</h3>
                  <p className="text-gray-400 text-xs mt-1">Click the chat bubble in the bottom right corner.</p>
                  <span className="inline-block bg-green-500/10 text-green-500 text-[10px] font-black px-2 py-0.5 rounded mt-2 uppercase">
                    Fastest response method
                  </span>
                </div>
              </Card>

              <Card className="bg-[#0d1120] border-white/5 p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold">Email Support</h3>
                  <p className="text-gray-400 text-xs mt-1">support@artisanstore.xyz</p>
                  <p className="text-gray-500 text-[10px] mt-1 font-bold uppercase tracking-widest">Response within 24 hours</p>
                </div>
              </Card>

              <Card className="bg-[#0d1120] border-white/5 p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 flex-shrink-0">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold">WhatsApp</h3>
                  <p className="text-gray-400 text-xs mt-1">+91 9387606432</p>
                  <p className="text-gray-500 text-[10px] mt-1 font-bold uppercase tracking-widest">Available 10 AM - 10 PM IST</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <Card className="bg-[#0d1120] border-gold/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-6 relative z-10"
                  >
                    <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto">
                      <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black font-heading text-white uppercase tracking-tighter">Message Sent!</h2>
                      <p className="text-gray-400 font-medium">
                        We received your message and will respond to <span className="text-white font-bold">{formData.email}</span> within 24 hours.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsSuccess(false);
                        setFormData({ name: "", email: "", orderId: "", subject: "", message: "" });
                      }}
                      className="text-gray-500 hover:text-gold text-sm font-bold uppercase tracking-widest transition-colors"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="space-y-6 relative z-10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Your Name</label>
                        <Input
                          placeholder="John Doe"
                          className={`h-14 bg-black/40 border-white/10 rounded-xl focus:border-gold/50 transition-all ${errors.name ? 'border-red-500/50' : ''}`}
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><AlertCircle size={10} /> {errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Email Address</label>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          className={`h-14 bg-black/40 border-white/10 rounded-xl focus:border-gold/50 transition-all ${errors.email ? 'border-red-500/50' : ''}`}
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><AlertCircle size={10} /> {errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Order ID (Optional)</label>
                        <Input
                          placeholder="e.g. ord_12345"
                          className="h-14 bg-black/40 border-white/10 rounded-xl focus:border-gold/50 transition-all font-mono text-sm"
                          value={formData.orderId}
                          onChange={e => setFormData({ ...formData, orderId: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Subject</label>
                        <Select
                          onValueChange={val => setFormData({ ...formData, subject: val || "" })}
                          value={formData.subject}
                        >
                          <SelectTrigger className={`h-14 bg-black/40 border-white/10 rounded-xl focus:border-gold/50 transition-all ${errors.subject ? 'border-red-500/50' : ''}`}>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0d1120] border-white/10 text-white">
                            {SUBJECTS.map(s => (
                              <SelectItem key={s} value={s} className="hover:bg-white/5 focus:bg-white/5">{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.subject && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><AlertCircle size={10} /> {errors.subject}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Message</label>
                      <Textarea
                        placeholder="How can we help you?"
                        className={`min-h-[150px] bg-black/40 border-white/10 rounded-xl focus:border-gold/50 transition-all resize-none ${errors.message ? 'border-red-500/50' : ''}`}
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                      />
                      {errors.message && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><AlertCircle size={10} /> {errors.message}</p>}
                    </div>

                    {serverError && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm font-medium">
                        <AlertCircle size={18} />
                        {serverError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-16 rounded-2xl bg-gold text-black font-black text-xl uppercase tracking-[0.2em] shadow-2xl shadow-gold/10 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send size={20} />
                          <span>Send Message</span>
                        </div>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </Card>
          </div>

        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
