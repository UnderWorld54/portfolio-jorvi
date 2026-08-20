import { defineField, defineType } from "sanity";
import { sharedFields } from "./fields";

export default defineType({
  name: "cover",
  title: "Covers",
  type: "document",
  icon: () => "🎨",
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (rule) => rule.min(1).error("Au moins une image est requise"),
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
    select: { title: "projectName", subtitle: "artist", media: "images.0" },
  },
});
