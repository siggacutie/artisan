"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Upload, Crop, Type, MousePointer2, Settings2, 
  PlusCircle, Save, Palette, Trash2, GripHorizontal,
  ChevronUp, ChevronDown, Image as ImageIcon,
  Maximize2, Move, ZoomIn, ZoomOut, Type as FontIcon,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface BannerElement {
  id: string;
  type: "text" | "button" | "title" | "subtitle";
  content: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  fontSize?: number;
  color?: string;
  bgColor?: string;
  padding?: string;
  borderRadius?: string;
  link?: string;
  fontFamily?: string;
  fontWeight?: string;
  letterSpacing?: string;
  textShadow?: string;
  opacity?: number;
  rotation?: number;
}

interface ImageConfig {
  scale: number;
  x: number;
  y: number;
}

interface BannerEditorProps {
  banner: any;
  onSave: (data: any) => void;
  onClose: () => void;
}

const RECOMMENDED_RATIO = 1200 / 400; // 3:1 aspect ratio

const FONT_FAMILIES = [
  { label: "Orbitron (Gaming)", value: "font-heading" },
  { label: "Rajdhani (Modern)", value: "font-body" },
  { label: "Inter (Standard)", value: "font-sans" },
];

export const BannerEditor = ({ banner, onSave, onClose }: BannerEditorProps) => {
  const [activeTab, setActiveTab] = useState<"image" | "design" | "layers">("image");
  const [imageUrl, setImageUrl] = useState<string | null>(banner?.imageUrl || null);
  const [title, setTitle] = useState(banner?.title || "");
  const [subtitle, setSubtitle] = useState(banner?.subtitle || "");
  const [startColor, setStartColor] = useState(banner?.gradientStart || "#ffd700");
  const [endColor, setEndColor] = useState(banner?.gradientEnd || "#f59e0b");
  const [imageConfig, setImageConfig] = useState<ImageConfig>(banner?.imageConfig || { scale: 1, x: 0, y: 0 });
  const [elements, setElements] = useState<BannerElement[]>(banner?.contentConfig || []);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize title and subtitle as elements if they don't exist in elements list
  useEffect(() => {
    if (elements.length === 0) {
      const initialElements: BannerElement[] = [];
      if (title) {
        initialElements.push({
          id: "title-default",
          type: "title",
          content: title,
          x: 5,
          y: 45,
          fontSize: 64,
          color: "#ffffff",
          fontFamily: "font-heading",
          fontWeight: "900",
          letterSpacing: "-0.05em",
        });
      }
      if (subtitle) {
        initialElements.push({
          id: "subtitle-default",
          type: "subtitle",
          content: subtitle,
          x: 5,
          y: 65,
          fontSize: 20,
          color: "rgba(255,255,255,0.8)",
          fontFamily: "font-body",
          fontWeight: "500",
        });
      }
      setElements(initialElements);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const ratio = img.width / img.height;
          if (Math.abs(ratio - RECOMMENDED_RATIO) > 0.5) {
            setImageError(`Proportions are quite different from 3:1. Use cropping tools below to adjust.`);
          } else {
            setImageError(null);
          }
          setImageUrl(event.target?.result as string);
          setImageConfig({ scale: 1, x: 0, y: 0 });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const addElement = (type: "text" | "button") => {
    const newElement: BannerElement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === "text" ? "New Text Element" : "Click Me",
      x: 50,
      y: 50,
      fontSize: type === "text" ? 24 : 14,
      color: "#ffffff",
      bgColor: type === "button" ? "#ffd700" : "transparent",
      padding: type === "button" ? "12px 32px" : "0px",
      borderRadius: type === "button" ? "12px" : "0px",
      fontFamily: type === "text" ? "font-body" : "font-heading",
      fontWeight: "700",
    };
    setElements([...elements, newElement]);
    setSelectedElementId(newElement.id);
  };

  const updateElement = (id: string, updates: Partial<BannerElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
    // If it's the title or subtitle, update the top-level state too
    const el = elements.find(e => e.id === id);
    if (el?.type === "title" && updates.content) setTitle(updates.content);
    if (el?.type === "subtitle" && updates.content) setSubtitle(updates.content);
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const selectedElement = elements.find(el => el.id === selectedElementId);

  const handleSaveClick = () => {
    // Sync title/subtitle from elements before saving
    const titleEl = elements.find(el => el.type === "title");
    const subtitleEl = elements.find(el => el.type === "subtitle");
    
    onSave({ 
      title: titleEl?.content || title, 
      subtitle: subtitleEl?.content || subtitle, 
      imageUrl, 
      gradientStart: startColor, 
      gradientEnd: endColor, 
      contentConfig: elements,
      imageConfig
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-[1400px] bg-[#0d1120] border border-gold/20 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row h-[90vh] shadow-[0_0_100px_rgba(0,0,0,0.8)]"
      >
        {/* Left Sidebar - Tools */}
        <div className="w-full md:w-96 border-r border-white/5 flex flex-col bg-[#0a0f1e] overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black font-heading text-white uppercase tracking-tighter">Artisan Editor</h2>
              <p className="text-[10px] text-gold font-black uppercase tracking-widest mt-1">v2.0 Professional</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all hover:bg-red-500/20">
              <X size={20} />
            </button>
          </div>

          <div className="flex border-b border-white/5">
            {[
              { id: "image", icon: ImageIcon, label: "Canvas" },
              { id: "design", icon: Palette, label: "Properties" },
              { id: "layers", icon: GripHorizontal, label: "Layers" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 py-5 flex flex-col items-center gap-1.5 transition-all relative",
                  activeTab === tab.id ? "text-gold bg-gold/5" : "text-gray-500 hover:text-white hover:bg-white/[0.02]"
                )}
              >
                <tab.icon size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                {activeTab === tab.id && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-gold" />}
              </button>
            ))}
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-8">
            {activeTab === "image" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Background Image</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group aspect-[3/1] rounded-2xl border-2 border-dashed border-white/10 hover:border-gold/30 bg-white/[0.02] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all overflow-hidden relative"
                  >
                    {imageUrl ? (
                      <>
                        <img src={imageUrl} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10 flex flex-col items-center gap-2">
                          <Upload size={24} className="text-gold" />
                          <span className="text-[10px] font-black uppercase text-white bg-black/60 px-4 py-2 rounded-xl border border-white/10">Replace Image</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload size={24} className="text-gray-500 group-hover:text-gold transition-colors" />
                        </div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center px-4">Upload high-res banner<br /><span className="text-gray-700">1200x400 (3:1) Recommended</span></p>
                      </>
                    )}
                    <input ref={fileInputRef} type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </div>
                </div>

                {imageUrl && (
                  <div className="space-y-6 p-5 bg-white/[0.02] rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">Image Controls</span>
                       <button onClick={() => setImageConfig({ scale: 1, x: 0, y: 0 })} className="text-[9px] font-bold text-gold uppercase hover:underline">Reset</button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] font-black text-gray-500 uppercase">
                          <span>Zoom / Scale</span>
                          <span className="text-gold">{Math.round(imageConfig.scale * 100)}%</span>
                        </div>
                        <Slider 
                          value={[imageConfig.scale]} 
                          min={0.5} max={3} step={0.01} 
                          onValueChange={([val]: number[]) => setImageConfig({ ...imageConfig, scale: val })} 
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] font-black text-gray-500 uppercase">
                          <span>Vertical Offset</span>
                          <span className="text-gold">{Math.round(imageConfig.y)}%</span>
                        </div>
                        <Slider 
                          value={[imageConfig.y]} 
                          min={-100} max={100} step={1} 
                          onValueChange={([val]: number[]) => setImageConfig({ ...imageConfig, y: val })} 
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] font-black text-gray-500 uppercase">
                          <span>Horizontal Offset</span>
                          <span className="text-gold">{Math.round(imageConfig.x)}%</span>
                        </div>
                        <Slider 
                          value={[imageConfig.x]} 
                          min={-100} max={100} step={1} 
                          onValueChange={([val]: number[]) => setImageConfig({ ...imageConfig, x: val })} 
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Overlay Gradients</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-gray-600 uppercase ml-1">Start Color</span>
                      <div className="flex gap-2">
                        <input type="color" value={startColor} onChange={(e) => setStartColor(e.target.value)} className="w-full h-12 rounded-xl bg-transparent border border-white/10 p-1 cursor-pointer" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-gray-600 uppercase ml-1">End Color</span>
                      <div className="flex gap-2">
                        <input type="color" value={endColor} onChange={(e) => setEndColor(e.target.value)} className="w-full h-12 rounded-xl bg-transparent border border-white/10 p-1 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "design" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                {!selectedElement ? (
                  <div className="p-12 bg-white/[0.01] border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center text-center gap-4">
                    <MousePointer2 size={32} className="text-gray-700" />
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest leading-relaxed">Select an element on the canvas<br />to edit its unique properties</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between bg-gold/10 p-4 rounded-2xl border border-gold/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center text-black">
                           {selectedElement.type === "text" || selectedElement.type === "title" || selectedElement.type === "subtitle" ? <FontIcon size={16} /> : <PlusCircle size={16} />}
                        </div>
                        <span className="text-xs font-black text-gold uppercase tracking-widest">{selectedElement.type}</span>
                      </div>
                      <button onClick={() => deleteElement(selectedElement.id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 transition-all hover:text-white">
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Content Text</label>
                      <Input 
                        value={selectedElement.content} 
                        onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })} 
                        className="h-14 bg-white/[0.03] border-white/10 focus:border-gold/40 rounded-xl text-sm font-bold" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Font Family</label>
                        <Select value={selectedElement.fontFamily || ""} onValueChange={(val: string | null) => updateElement(selectedElement.id, { fontFamily: val || undefined })}>
                          <SelectTrigger className="bg-white/[0.03] border-white/10 h-12 rounded-xl">
                            <SelectValue placeholder="Select Font" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0d1120] border-gold/20 text-white">
                            {FONT_FAMILIES.map(font => (
                              <SelectItem key={font.value} value={font.value} className="focus:bg-gold focus:text-black">
                                {font.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Font Weight</label>
                        <Select value={selectedElement.fontWeight || ""} onValueChange={(val: string | null) => updateElement(selectedElement.id, { fontWeight: val || undefined })}>
                          <SelectTrigger className="bg-white/[0.03] border-white/10 h-12 rounded-xl">
                            <SelectValue placeholder="Weight" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0d1120] border-gold/20 text-white">
                            {["300", "400", "500", "600", "700", "800", "900"].map(w => (
                              <SelectItem key={w} value={w} className="focus:bg-gold focus:text-black">{w}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Size (px)</label>
                        <Input type="number" value={selectedElement.fontSize} onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })} className="h-12 bg-white/[0.03] border-white/10 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Text Color</label>
                        <div className="flex gap-2">
                           <input type="color" value={selectedElement.color?.startsWith('rgba') ? '#ffffff' : selectedElement.color} onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })} className="w-full h-12 rounded-xl bg-transparent border border-white/10 p-1 cursor-pointer" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="flex justify-between items-center text-[9px] font-black text-gray-500 uppercase">
                        <span>Letter Spacing</span>
                        <span className="text-gold">{selectedElement.letterSpacing || "0em"}</span>
                      </div>
                      <Slider 
                        value={[parseFloat(selectedElement.letterSpacing?.replace('em', '') || '0')]} 
                        min={-0.1} max={0.5} step={0.01} 
                        onValueChange={([val]: number[]) => updateElement(selectedElement.id, { letterSpacing: `${val}em` })} 
                      />
                    </div>

                    {selectedElement.type === "button" && (
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Button Background</label>
                          <input type="color" value={selectedElement.bgColor} onChange={(e) => updateElement(selectedElement.id, { bgColor: e.target.value })} className="w-full h-12 rounded-xl bg-transparent border border-white/10 p-1 cursor-pointer" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Button Action Link</label>
                          <Input value={selectedElement.link || ""} onChange={(e) => updateElement(selectedElement.id, { link: e.target.value })} placeholder="/games/..." className="h-12 bg-white/[0.03] border-white/10 rounded-xl text-xs" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "layers" && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Hierarchy</label>
                <div className="space-y-2">
                  {elements.length === 0 ? (
                    <div className="p-8 text-center text-gray-600 italic text-[10px] font-bold uppercase tracking-widest">No elements added</div>
                  ) : (
                    elements.map((el) => (
                      <div 
                        key={el.id}
                        onClick={() => setSelectedElementId(el.id)}
                        className={cn(
                          "p-4 rounded-2xl border flex items-center justify-between transition-all cursor-pointer group",
                          selectedElementId === el.id ? "bg-gold/10 border-gold/30 shadow-lg shadow-gold/5" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <GripHorizontal size={16} className={cn("transition-colors", selectedElementId === el.id ? "text-gold" : "text-gray-700")} />
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", selectedElementId === el.id ? "bg-gold text-black" : "bg-white/5 text-gray-400")}>
                            {el.type === "button" ? <PlusCircle size={14} /> : <FontIcon size={14} />}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[11px] font-black text-white uppercase tracking-tight truncate max-w-[120px]">{el.content}</span>
                             <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{el.type}</span>
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }} className="opacity-0 group-hover:opacity-100 text-red-500 hover:scale-110 transition-all p-2"><Trash2 size={14} /></button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-white/5 bg-black/40">
            <Button 
              onClick={handleSaveClick}
              className="w-full bg-gradient-to-r from-gold to-[#f59e0b] text-black font-black uppercase tracking-widest h-16 rounded-[1.25rem] shadow-2xl flex items-center justify-center gap-3 group hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Save size={20} className="group-hover:rotate-12 transition-transform" />
              <span>Publish Changes</span>
            </Button>
          </div>
        </div>

        {/* Main Editor Canvas */}
        <div className="flex-grow bg-[#050810] relative overflow-hidden flex items-center justify-center p-12 select-none bg-[radial-gradient(circle_at_center,_#0a0f1e_0%,_#050810_100%)]">
          {/* Canvas Header */}
          <div className="absolute top-10 left-10 right-10 flex items-center justify-between pointer-events-none z-50">
            <div className="flex items-center gap-4 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 shadow-2xl">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Production Preview</span>
            </div>
            <div className="flex gap-3">
               <div className="bg-black/60 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 text-[10px] font-black text-gray-400 uppercase tracking-widest shadow-2xl">
                 1200 x 400 PX
               </div>
            </div>
          </div>

          {/* Real Canvas Area */}
          <div 
            ref={canvasRef}
            className="w-full aspect-[3/1] max-w-5xl rounded-[2.5rem] overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 group/canvas"
            style={{ 
              background: imageUrl ? 'none' : `linear-gradient(135deg, ${startColor}, ${endColor})` 
            }}
          >
            {imageUrl && (
              <motion.div 
                className="absolute inset-0 w-full h-full"
                animate={{ 
                  scale: imageConfig.scale,
                  x: `${imageConfig.x}%`,
                  y: `${imageConfig.y}%`
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                <img src={imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
              </motion.div>
            )}
            
            {/* Gradient Overlay */}
            <div 
              className="absolute inset-0 transition-opacity duration-700 pointer-events-none" 
              style={{ background: `linear-gradient(135deg, ${startColor}99, ${endColor}44)` }}
            />

            {/* Dynamic Draggable Elements */}
            {elements.map((el) => (
              <motion.div
                key={el.id}
                drag
                dragMomentum={false}
                dragConstraints={canvasRef}
                onDragStart={() => setSelectedElementId(el.id)}
                onDragEnd={(_, info) => {
                  if (canvasRef.current) {
                    const rect = canvasRef.current.getBoundingClientRect();
                    // Calculate relative to parent canvas
                    const newX = ((info.point.x - rect.left) / rect.width) * 100;
                    const newY = ((info.point.y - rect.top) / rect.height) * 100;
                    
                    // Clamp to canvas bounds
                    const clampedX = Math.max(0, Math.min(100, newX));
                    const clampedY = Math.max(0, Math.min(100, newY));
                    
                    updateElement(el.id, { x: clampedX, y: clampedY });
                  }
                }}
                className={cn(
                  "absolute cursor-grab active:cursor-grabbing group/el",
                  selectedElementId === el.id && "z-50"
                )}
                style={{ 
                  left: `${el.x}%`, 
                  top: `${el.y}%`,
                  transform: 'translate(-50%, -50%)',
                  // Ensure motion doesn't persist visual transforms after state update
                  x: 0, 
                  y: 0
                }}
                onClick={(e) => { e.stopPropagation(); setSelectedElementId(el.id); setActiveTab("design"); }}
              >
                {/* Selection Border */}
                {selectedElementId === el.id && (
                  <motion.div 
                    layoutId="selection" 
                    className="absolute -inset-4 border-2 border-gold rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.4)] z-[-1]" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full pb-2">
                       <div className="bg-gold text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter whitespace-nowrap">
                         Drag to Position
                       </div>
                    </div>
                  </motion.div>
                )}

                {el.type === "button" ? (
                  <button
                    style={{ 
                      fontSize: `${el.fontSize}px`, 
                      color: el.color, 
                      backgroundColor: el.bgColor,
                      padding: el.padding,
                      borderRadius: el.borderRadius,
                      fontWeight: el.fontWeight,
                      letterSpacing: el.letterSpacing,
                      fontFamily: el.fontFamily === 'font-heading' ? 'Orbitron' : el.fontFamily === 'font-body' ? 'Rajdhani' : 'Inter'
                    }}
                    className={cn(
                      "font-black uppercase tracking-widest whitespace-nowrap shadow-2xl transition-transform hover:scale-105",
                      el.fontFamily
                    )}
                  >
                    {el.content}
                  </button>
                ) : (
                  <div
                    style={{ 
                      fontSize: `${el.fontSize}px`, 
                      color: el.color,
                      fontWeight: el.fontWeight,
                      letterSpacing: el.letterSpacing,
                      fontFamily: el.fontFamily === 'font-heading' ? 'Orbitron' : el.fontFamily === 'font-body' ? 'Rajdhani' : 'Inter',
                      opacity: el.opacity,
                    }}
                    className={cn(
                      "font-black uppercase tracking-tight whitespace-nowrap leading-[0.9] drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]",
                      el.fontFamily
                    )}
                  >
                    {el.content}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Canvas Bottom Controls */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/60 backdrop-blur-xl p-3 rounded-[2rem] border border-white/10 pointer-events-auto shadow-2xl">
             <button onClick={() => addElement("text")} className="h-12 rounded-xl hover:bg-white/10 flex items-center justify-center text-white transition-all gap-3 px-6 group/btn">
               <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover/btn:bg-white/20 transition-all">
                  <Type size={18} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">Add Text</span>
             </button>
             <div className="w-px h-8 bg-white/10" />
             <button onClick={() => addElement("button")} className="h-12 rounded-xl hover:bg-gold/10 flex items-center justify-center text-gold transition-all gap-3 px-6 group/btn">
               <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center group-hover/btn:bg-gold/20 transition-all">
                  <PlusCircle size={18} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">Add Button</span>
             </button>
             <div className="w-px h-8 bg-white/10" />
             <button onClick={() => { if(confirm("Clear all elements?")) setElements([]); setImageUrl(null); }} className="h-12 rounded-xl hover:bg-red-500/10 flex items-center justify-center text-red-500 transition-all gap-3 px-6 group/btn">
               <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover/btn:bg-red-500/20 transition-all">
                  <Trash2 size={18} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">Reset Canvas</span>
             </button>
          </div>
        </div>
      </motion.div>
      <style jsx global>{`
        .font-heading { font-family: 'Orbitron', sans-serif; }
        .font-body { font-family: 'Rajdhani', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 215, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 215, 0, 0.3);
        }
      `}</style>
    </div>
  );
};
