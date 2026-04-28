import Image from "next/image";

export default function LoadingSkeleton() {
  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      <div className="relative">
        <Image
          src="/logo/star.svg"
          alt="Chargement"
          width={64}
          height={64}
          className="w-16 h-16 animate-pulse"
          priority
          unoptimized
          style={{ filter: "brightness(0) invert(1)" }}
        />
        <div
          className="absolute inset-0 -z-10 animate-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 70%)",
          }}
        />
      </div>
    </div>
  );
}
