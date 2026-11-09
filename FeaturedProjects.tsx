import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ProjectItem {
  id: string;
  title: string;
  category: '3D Motion' | 'Brand Identity' | 'Video Editing' | 'AI Workflows' | 'Graphic Design';
  aspectType: 'square' | 'portrait' | 'landscape';
  aspectLabel: string;
  gridSpan: string;
  heightClass: string;
  image: string;
  client: string;
  year: string;
  tools: string[];
  description: string;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'p1',
    title: 'Aura Kinetic Identity',
    category: 'Brand Identity',
    aspectType: 'landscape',
    aspectLabel: '16:9 Landscape',
    gridSpan: 'col-span-1 md:col-span-12 lg:col-span-8',
    heightClass: 'h-[320px] sm:h-[380px] lg:h-[420px]',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    client: 'Aura Collective',
    year: '2026',
    tools: ['Cinema 4D', 'Illustrator', 'After Effects'],
    description: 'Complete visual identity, kinetic motion guidelines, and high-contrast editorial system engineered for an avant-garde digital arts collective.'
  },
  {
    id: 'p2',
    title: 'Cybernetic HUD & Hologram',
    category: '3D Motion',
    aspectType: 'portrait',
    aspectLabel: '3:4 Portrait',
    gridSpan: 'col-span-1 md:col-span-6 lg:col-span-4',
    heightClass: 'h-[420px] sm:h-[480px] lg:h-[420px]',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    client: 'NeuroTech Labs',
    year: '2026',
    tools: ['Blender Cycles', 'Octane', 'Figma'],
    description: 'Futuristic holographic HUD simulation with dispersion shaders and tactile glass refraction designed for next-gen wearable spatial interfaces.'
  },
  {
    id: 'p3',
    title: 'Apex Velocity Commercial',
    category: 'Video Editing',
    aspectType: 'landscape',
    aspectLabel: '16:9 Landscape',
    gridSpan: 'col-span-1 md:col-span-6 lg:col-span-5',
    heightClass: 'h-[320px] sm:h-[380px] lg:h-[400px]',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1000&q=80',
    client: 'Apex Athletics',
    year: '2026',
    tools: ['Premiere Pro', 'DaVinci Resolve', 'Soundly'],
    description: 'High-octane commercial pacing with dynamic match cuts, analog film texture, and bespoke cinematic sound design for social campaign launches.'
  },
  {
    id: 'p4',
    title: 'Fluid Chromatic Vortex',
    category: '3D Motion',
    aspectType: 'square',
    aspectLabel: '1:1 Square',
    gridSpan: 'col-span-1 md:col-span-6 lg:col-span-3',
    heightClass: 'h-[320px] sm:h-[380px] lg:h-[400px]',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    client: 'Solaria Media',
    year: '2026',
    tools: ['Houdini', 'Redshift', 'Photoshop'],
    description: 'Complex particle and fluid simulation exploring chromatic aberration, surface tension dynamics, and caustic light interactions.'
  },
  {
    id: 'p5',
    title: 'Neo-Tokyo Editorial Poster',
    category: 'Brand Identity',
    aspectType: 'portrait',
    aspectLabel: '3:4 Portrait',
    gridSpan: 'col-span-1 md:col-span-6 lg:col-span-4',
    heightClass: 'h-[420px] sm:h-[480px] lg:h-[400px]',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    client: 'Kuro Cultural Festival',
    year: '2026',
    tools: ['Photoshop', 'Illustrator', 'Glyphs'],
    description: 'Brutalist typographic hierarchy blending bilingual kanji-latin lettering with distressed risograph textures and vector grids.'
  },
  {
    id: 'p6',
    title: 'Solstice Cinematic Grade',
    category: 'Video Editing',
    aspectType: 'square',
    aspectLabel: '1:1 Square',
    gridSpan: 'col-span-1 md:col-span-6 lg:col-span-4',
    heightClass: 'h-[340px] sm:h-[400px] lg:h-[420px]',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
    client: 'Indie Motion Pictures',
    year: '2026',
    tools: ['DaVinci Resolve', 'FilmConvert', 'After Effects'],
    description: 'Moody atmospheric color grading and analog film grain mastering for a psychological drama short, tuned with custom HDR color curves.'
  },
  {
    id: 'p7',
    title: 'Bioluminescent Synthetics',
    category: 'AI Workflows',
    aspectType: 'portrait',
    aspectLabel: '3:4 Portrait',
    gridSpan: 'col-span-1 md:col-span-6 lg:col-span-4',
    heightClass: 'h-[420px] sm:h-[480px] lg:h-[420px]',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80',
    client: 'Exo Organics',
    year: '2026',
    tools: ['ComfyUI', 'Photoshop', 'Topaz AI'],
    description: 'Custom diffusion-driven visual synthesis guided by 3D depth control nets, refined with manual hand-painted composite textures.'
  },
  {
    id: 'p8',
    title: 'Quantum Monolith Renders',
    category: '3D Motion',
    aspectType: 'landscape',
    aspectLabel: '16:9 Landscape',
    gridSpan: 'col-span-1 md:col-span-12 lg:col-span-4',
    heightClass: 'h-[320px] sm:h-[380px] lg:h-[420px]',
    image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1200&q=80',
    client: 'Vektor Architecture',
    year: '2026',
    tools: ['Blender', 'Cycles', 'After Effects'],
    description: 'Photorealistic brutalist architecture situated in atmospheric foggy terrain with volumetric neon perimeter illumination.'
  }
];

const CATEGORIES = ['All', '3D Motion', 'Brand Identity', 'Video Editing', 'AI Workflows'] as const;
type CategoryType = typeof CATEGORIES[number];

export default function FeaturedProjects(): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const filteredProjects = selectedCategory === 'All'
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter((p) => p.category === selectedCategory);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModalProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section 
      id="featured-projects" 
      className="relative w-full bg-[#0F111A] text-white py-20 px-4 sm:px-6 lg:px-12 overflow-hidden selection:bg-[#7B8AF4]/30 selection:text-[#7B8AF4]"
    >
      <div 
        className="absolute top-1/4 -left-48 w-96 h-96 bg-[#7B8AF4]/10 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#7B8AF4]/10 rounded-full blur-[140px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* 1. SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#7B8AF4]/10 border border-[#7B8AF4]/25 text-[#7B8AF4] text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(123,138,244,0.15)]">
              <span className="text-white/40">┌</span> CURATED ARCHIVE & PRODUCTIONS
            </div>
            
            <div className="flex items-center flex-wrap gap-3 sm:gap-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                Featured Projects
              </h2>

              {/* Glowing Neon Blue (#7B8AF4) Dot Accent */}
              <span
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#7B8AF4] inline-block shadow-[0_0_12px_#7B8AF4,0_0_24px_rgba(123,138,244,0.8)] animate-pulse"
                aria-label="Glowing accent dot"
              />

              {/* Glowing Neon Blue (#7B8AF4) Line Accent */}
              <span
                className="hidden sm:inline-block w-12 sm:w-16 h-[3px] rounded-full bg-gradient-to-r from-[#7B8AF4] via-[#7B8AF4] to-transparent shadow-[0_0_10px_#7B8AF4]"
                aria-label="Glowing accent line"
              />
            </div>
            <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-xl font-light">
              High-impact 3D animation, brand identity, and commercial video production built for scaling modern creative ventures.
            </p>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 border ${
                    isActive
                      ? 'bg-[#7B8AF4] text-[#0F111A] border-[#7B8AF4] font-semibold shadow-[0_0_18px_rgba(123,138,244,0.55)] scale-105'
                      : 'bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.08] border-white/10'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. MASONRY PORTFOLIO GRID with 4. Framer Motion Scroll Animations */}
        <motion.div
          key={selectedCategory}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto"
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              layout
              onClick={() => setActiveModalProject(project)}
              className={`group relative rounded-2xl overflow-hidden bg-[#141724] border border-white/10 shadow-2xl transition-all duration-500 hover:border-[#7B8AF4]/40 hover:shadow-[0_12px_36px_rgba(123,138,244,0.22)] cursor-pointer ${project.gridSpan} ${project.heightClass}`}
            >
              {/* Scale-105 image */}
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* 3. Glassmorphism overlay */}
              <div className="absolute inset-0 bg-[#0F111A]/75 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-out flex flex-col justify-between p-6 sm:p-7 z-10 pointer-events-none group-hover:pointer-events-auto">
                
                {/* Aspect Ratio Badge & Arrow */}
                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out">
                  <span className="text-[11px] font-mono tracking-widest uppercase text-white/70 bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full">
                    {project.aspectLabel}
                  </span>
                  
                  <div className="w-9 h-9 rounded-full bg-[#7B8AF4]/15 border border-[#7B8AF4]/40 flex items-center justify-center text-[#7B8AF4] shadow-[0_0_12px_rgba(123,138,244,0.35)]">
                    <svg className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </div>
                </div>

                {/* EXACT CENTER: "MQ" Logo Reveal */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="transform scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out flex flex-col items-center">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute -inset-6 bg-[#7B8AF4]/25 rounded-full blur-xl pointer-events-none" />
                      
                      <span 
                        className="relative text-[#7B8AF4] font-black text-4xl sm:text-5xl md:text-6xl tracking-widest select-none"
                        style={{
                          textShadow: '0 0 15px #7B8AF4, 0 0 30px rgba(123, 138, 244, 0.8), 0 0 50px rgba(123, 138, 244, 0.4)'
                        }}
                      >
                        MQ
                      </span>
                    </div>
                    <span 
                      className="text-[10px] sm:text-[11px] font-mono tracking-[0.35em] uppercase text-[#7B8AF4]/90 mt-1.5 select-none"
                      style={{ textShadow: '0 0 10px rgba(123, 138, 244, 0.7)' }}
                    >
                      AGENCY
                    </span>
                  </div>
                </div>

                {/* BOTTOM: Project Details */}
                <div className="transform translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out delay-75 z-20">
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#7B8AF4] mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7B8AF4] shadow-[0_0_8px_#7B8AF4]"></span>
                    {project.category}
                  </span>
                  
                  <h3 className="text-white font-bold text-lg sm:text-xl md:text-2xl tracking-tight leading-snug">
                    {project.title}
                  </h3>
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Accent Counter */}
        <div className="mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-gray-500 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#7B8AF4]/60"></span>
            <span>SHOWING {filteredProjects.length} CURATED PROJECTS</span>
          </div>
          <div className="flex items-center gap-3 text-[#7B8AF4]">
            <span>DESIGN</span>
            <span>•</span>
            <span>3D ANIMATION</span>
            <span>•</span>
            <span>VIDEO PRODUCTION</span>
          </div>
        </div>

      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeModalProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalProject(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#141724] border border-[#7B8AF4]/30 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
            >
              <button
                type="button"
                onClick={() => setActiveModalProject(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#0F111A]/80 border border-white/10 text-white hover:text-[#7B8AF4] hover:border-[#7B8AF4] flex items-center justify-center transition-all duration-200"
                aria-label="Close modal"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-64 md:h-[480px]">
                  <img
                    src={activeModalProject.image}
                    alt={activeModalProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141724] via-transparent to-transparent md:hidden" />
                </div>

                <div className="p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#7B8AF4] uppercase tracking-widest mb-2">
                      <span className="w-2 h-2 rounded-full bg-[#7B8AF4] shadow-[0_0_8px_#7B8AF4]"></span>
                      {activeModalProject.category} • {activeModalProject.year}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                      {activeModalProject.title}
                    </h3>

                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                      {activeModalProject.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="text-xs font-mono text-gray-400">
                        <span className="text-white font-medium">Client:</span> {activeModalProject.client}
                      </div>
                      
                      <div className="text-xs font-mono text-gray-400">
                        <span className="text-white font-medium">Discipline:</span> {activeModalProject.aspectLabel}
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {activeModalProject.tools.map((tool) => (
                          <span
                            key={tool}
                            className="text-[11px] font-mono px-2.5 py-1 rounded bg-white/5 border border-white/10 text-gray-300"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-[#7B8AF4]">MUHAMMED QASIM — MQ</span>
                    <button
                      type="button"
                      onClick={() => setActiveModalProject(null)}
                      className="px-5 py-2 rounded-full bg-[#7B8AF4] text-[#0F111A] font-semibold text-xs tracking-wider uppercase hover:shadow-[0_0_15px_rgba(123,138,244,0.6)] transition-all"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
