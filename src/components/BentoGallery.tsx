'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Image as ImageIcon, Search, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageItem } from '@/hooks/usePollinations';

interface BentoGalleryProps {
  images: ImageItem[];
  onOpenImage: (url: string) => void;
  isUniform?: boolean;
}

export default function BentoGallery({ images, onOpenImage, isUniform = false }: BentoGalleryProps) {
  const handleDownload = async (url: string, prompt: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${prompt.slice(0, 20).replace(/[^a-z0-9]/gi, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className={cn("max-w-7xl mx-auto px-6 py-12", isUniform && "max-w-full")}>
      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[300px]",
        isUniform && "lg:grid-cols-3 xl:grid-cols-3" // Adjust for All Models view
      )}>
        <AnimatePresence mode="popLayout">
          {images.map((img, index) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.6,
                delay: index * 0.05,
                ease: [0.23, 1, 0.32, 1]
              }}
              className={cn(
                "group relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-white/5 backdrop-blur-sm cursor-pointer",
                !isUniform && index % 5 === 0 ? "md:col-span-2 md:row-span-2" : "",
                !isUniform && index % 7 === 0 ? "md:row-span-2" : ""
              )}
              onClick={() => onOpenImage(img.url)}
            >
              {/* Image Container */}
              <div className="absolute inset-0 z-0">
                <img
                  src={img.url}
                  alt={img.prompt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              </div>

              {/* Overlay Content */}
              <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-purple-600/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-white">
                    {img.model}
                  </span>
                </div>
                <p className="text-white font-medium text-lg line-clamp-2 leading-snug mb-4">
                  "{img.prompt}"
                </p>
                <div className="flex items-center gap-3">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(img.url, '_blank');
                    }}
                    className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5 text-white" />
                  </div>
                  
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(img.url, img.prompt);
                    }}
                    className="w-12 h-12 rounded-2xl bg-purple-600 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-purple-500 transition-all cursor-pointer shadow-lg shadow-purple-600/40"
                    title="Download image"
                  >
                    <Download className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Static Badge (Top Right) */}
              <div className="absolute top-4 right-4 z-20 opacity-100 group-hover:opacity-0 transition-opacity">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 p-2 rounded-xl">
                  <ImageIcon className="w-4 h-4 text-white/70" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {images.length === 0 && (
          <div className="col-span-full h-24 invisible" />
        )}
      </div>
    </div>
  );
}
