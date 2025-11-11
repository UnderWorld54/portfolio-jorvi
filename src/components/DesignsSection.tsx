"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

interface CategoryCardProps {
  title: string;
  slug: string;
  image: string;
  description: string;
  count: number;
  index: number;
}

const CategoryCard = ({ title, slug, image, description, count, index }: CategoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Détecter si c'est un appareil tactile
  const [isTouch, setIsTouch] = useState(false);
  
  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();
  }, []);
  
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["2deg", "-2deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-2deg", "2deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const cardVariants = {
    initial: { 
      opacity: 0, 
      y: 60,
      scale: 0.9
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="h-full min-h-[200px] sm:min-h-[240px] md:min-h-[280px] lg:min-h-[320px]"
    >
      <Link href={`/designs/${slug}`} className="block h-full w-full">
        <motion.div
          className="relative group cursor-pointer overflow-hidden h-full rounded-xl md:rounded-2xl from-gray-900 via-black to-black border border-red-500/20"
          onMouseMove={!isTouch ? handleMouseMove : undefined}
          onMouseEnter={() => !isTouch && setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          style={{
            rotateX: !isTouch ? rotateX : undefined,
            rotateY: !isTouch ? rotateY : undefined,
            transformStyle: !isTouch ? "preserve-3d" : undefined,
          }}
          whileHover={{ 
            scale: 1.01,
            borderColor: "rgba(239, 68, 68, 0.5)",
            boxShadow: "0 5px 15px rgba(239, 68, 68, 0.1), 0 0 25px rgba(239, 68, 68, 0.03)"
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Image de fond avec parallaxe */}
          <motion.div 
            className="absolute inset-0 overflow-hidden"
            style={{
              scale: isHovered ? 1.1 : 1,
              transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)"
            }}
          >
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
              loading="eager"
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            
            {/* Gradient overlay animé */}
            <motion.div 
              className="absolute inset-0 from-black/90 via-black/70 to-black/90"
              animate={{
                background: isHovered 
                  ? "linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(239,68,68,0.15), rgba(0,0,0,0.6))"
                  : "linear-gradient(to bottom right, rgba(0,0,0,0.9), rgba(0,0,0,0.7), rgba(0,0,0,0.9))"
              }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>

          {/* Contenu avec effet 3D */}
          <div 
            className="absolute inset-0 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between z-10"
            style={{ transform: !isTouch ? "translateZ(10px)" : undefined }}
          >
            {/* Titre et description */}
            <div>
              <motion.div
                animate={{
                  y: isHovered ? -5 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.h3
                  className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white uppercase mb-1 sm:mb-1.5 tracking-tight"
                  style={{ fontFamily: "serif" }}
                  animate={{
                    textShadow: isHovered 
                      ? "0 0 8px rgba(239, 68, 68, 0.4), 0 0 15px rgba(239, 68, 68, 0.2)"
                      : "none"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {title}
                </motion.h3>
                <motion.p 
                  className="text-white/70 text-xs sm:text-sm md:text-base font-light"
                  animate={{
                    color: isHovered ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.7)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {description}
                </motion.p>
              </motion.div>
            </div>

            {/* Bas avec nombre et CTA */}
            <motion.div 
              className="flex items-end justify-between mt-auto"
              animate={{
                y: isHovered ? 5 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg font-semibold px-2 sm:px-2.5 md:px-3 py-1 sm:py-1 md:py-1.5 rounded-md sm:rounded-lg bg-black/70 backdrop-blur-sm"
                animate={{
                  scale: isHovered ? 1.05 : 1,
                  color: isHovered ? "rgb(239, 68, 68)" : "rgba(255, 255, 255, 0.9)",
                  backgroundColor: isHovered ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.7)"
                }}
                transition={{ duration: 0.2 }}
              >
                {count}
                <span className="text-xs sm:text-xs md:text-sm font-normal text-white/60 ml-1">éléments</span>
              </motion.div>
              
              {/* CTA avec animation */}
              <motion.div
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  x: isHovered ? 0 : -20,
                  backgroundColor: isHovered ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.7)"
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <span className="text-xs sm:text-sm font-medium uppercase tracking-wider sm:tracking-widest">Explorer</span>
                <motion.div
                  animate={{ x: isHovered ? [0, 8, 0] : 0 }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: isHovered ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowRight size={16} className="text-red-500 sm:w-[18px] sm:h-[18px]" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Effet de lumière au hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(239, 68, 68, 0.05) 0%, transparent 50%)",
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default function DesignsSection() {
  const categories = [
    {
      title: "LOGOS",
      slug: "logos",
      image: "/images/logos.jpg",
      description: "Identités visuelles uniques",
      count: 12,
    },
    {
      title: "PRINTS",
      slug: "prints",
      image: "/images/prints.jpg",
      description: "Créations imprimées",
      count: 8,
    },
    {
      title: "VIDÉOS",
      slug: "videos",
      image: "/images/videos.jpg",
      description: "Narratives visuelles",
      count: 6,
    },
  ];

  return (
    <section id="designs" className="min-h-screen bg-black relative overflow-x-hidden pt-20 sm:pt-24 md:pt-28">
      {/* Background gradient animé */}
      <motion.div
        className="absolute inset-0 opacity-20 sm:opacity-30"
        style={{
          background: "radial-gradient(circle at 30% 50%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)",
        }}
        animate={{
          background: [
            "radial-gradient(circle at 30% 50%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 70% 50%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 30% 50%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12">
        {/* Titre avec étoiles et glow */}
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-4">
            <Image
              src="/logo/star.svg"
              alt="Star"
              width={24}
              height={24}
              className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block"
              style={{ 
                filter: "brightness(0) invert(1) drop-shadow(0 0 4px rgba(255, 255, 255, 0.6))",
              }}
            />
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-red-500 text-center tracking-tight uppercase"
              style={{ 
                fontFamily: "serif",
                textShadow: "0 0 10px rgba(239, 68, 68, 0.5), 0 0 20px rgba(239, 68, 68, 0.3)"
              }}
            >
              DESIGNS
            </h2>
            <Image
              src="/logo/star.svg"
              alt="Star"
              width={24}
              height={24}
              className="w-5 h-5 sm:w-6 sm:h-6 hidden sm:block"
              style={{ 
                filter: "brightness(0) invert(1) drop-shadow(0 0 4px rgba(255, 255, 255, 0.6))",
              }}
            />
          </div>
        </motion.div>

        {/* Grille asymétrique moderne */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 md:gap-4 lg:gap-5 w-full">
          {categories.map((category, index) => (
            <div key={category.slug} className="min-h-[200px] sm:min-h-[240px] md:min-h-[280px] lg:min-h-[320px]">
              <CategoryCard {...category} index={index} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
