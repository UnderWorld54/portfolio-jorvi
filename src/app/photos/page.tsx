"use client";

import LoadingScreen from "@/components/LoadingScreen";
import PageContainer from "@/components/ui/PageContainer";
import PageTitle from "@/components/ui/PageTitle";
import MasonryGrid from "@/components/ui/MasonryGrid";
import type { ImageCardData } from "@/components/ui/ImageCard";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import { useImageLoader } from "@/hooks/useImageLoader";

interface Photo extends ImageCardData {
  artist: string;
  projectName: string;
  date: string;
  description: string;
}

const photos: Photo[] = [
  {
    id: "1",
    image: "/images/cover6.jpg",
    artist: "Artiste 1",
    projectName: "Projet Alpha",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "2",
    image: "/images/cover2.jpg",
    artist: "Artiste 2",
    projectName: "Projet Beta",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "3",
    image: "/images/cover3.jpg",
    artist: "Artiste 3",
    projectName: "Projet Gamma",
    date: "2023",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "4",
    image: "/images/cover1.jpg",
    artist: "Artiste 4",
    projectName: "Projet Delta",
    date: "2023",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "5",
    image: "/images/cover5.jpg",
    artist: "Artiste 5",
    projectName: "Projet Epsilon",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "6",
    image: "/images/cover6.jpg",
    artist: "Artiste 6",
    projectName: "Projet Zeta",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "7",
    image: "/images/cover1.jpg",
    artist: "Artiste 1",
    projectName: "Projet Alpha",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "8",
    image: "/images/cover3.jpg",
    artist: "Artiste 2",
    projectName: "Projet Beta",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "9",
    image: "/images/cover2.jpg",
    artist: "Artiste 2",
    projectName: "Projet Gamma",
    date: "2023",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "10",
    image: "/images/cover4.jpg",
    artist: "Artiste 4",
    projectName: "Projet Delta",
    date: "2023",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "11",
    image: "/images/cover6.jpg",
    artist: "Artiste 5",
    projectName: "Projet Epsilon",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
  {
    id: "12",
    image: "/images/cover4.jpg",
    artist: "Artiste 6",
    projectName: "Projet Zeta",
    date: "2024",
    description: "Description du projet et de l'artiste",
  },
];

export default function PhotosPage() {
  const { isLoading } = useImageLoader({ imageSelector: '.photo-image' });

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <PageContainer isLoading={isLoading}>
        <PageTitle title="PHOTOS" />
        <MasonryGrid 
          items={photos} 
          imageClassName="photo-image"
          showInfo={false}
        />
      </PageContainer>
      <ScrollToTopButton />
    </>
  );
}

