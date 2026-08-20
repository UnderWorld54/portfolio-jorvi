import { defineField, defineType } from "sanity";
import { sharedFields } from "./fields";

export default defineType({
  name: "video",
  title: "Videos",
  type: "document",
  icon: () => "🎬",
  fields: [
    defineField({
      name: "link",
      title: "Lien YouTube",
      type: "url",
      description:
        "Sert aussi de vignette de secours si aucune image n'est fournie",
    }),
    defineField({
      name: "image",
      title: "Vignette",
      type: "image",
      options: { hotspot: true },
      description: "Optionnel — à défaut, la miniature YouTube est utilisée",
    }),
    ...sharedFields,
  ],
  orderings: [
    {
      title: "Date de publication (récent → ancien)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "projectName", subtitle: "artist", media: "image" },
  },
});
