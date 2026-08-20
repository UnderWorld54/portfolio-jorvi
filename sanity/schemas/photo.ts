import { defineField, defineType } from "sanity";
import { sharedFields } from "./fields";

export default defineType({
  name: "photo",
  title: "Photos",
  type: "document",
  icon: () => "📷",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
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
