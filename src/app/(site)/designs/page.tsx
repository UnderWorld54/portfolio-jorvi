import { getLogos, getPrints, getVideos } from "@/lib/sanity";
import DesignsSection from "@/components/DesignsSection";

export const revalidate = 3600;

export default async function DesignsPage() {
  const [logos, prints, videos] = await Promise.all([
    getLogos().catch(() => []),
    getPrints().catch(() => []),
    getVideos().catch(() => []),
  ]);

  return (
    <div className="min-h-screen bg-black">
      <DesignsSection
        categoryCounts={{
          logos: logos.length,
          prints: prints.length,
          videos: videos.length,
        }}
      />
    </div>
  );
}
