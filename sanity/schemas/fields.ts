import { defineField } from "sanity";

export const sharedFields = [
  defineField({
    name: "projectName",
    title: "Nom du projet",
    type: "string",
  }),
  defineField({
    name: "artist",
    title: "Artiste",
    type: "string",
  }),
  defineField({
    name: "date",
    title: "Date",
    type: "string",
    description: "Texte libre affiché tel quel (ex. 03/06/2024)",
  }),
  defineField({
    name: "description",
    title: "Description",
    type: "text",
    rows: 4,
  }),
  defineField({
    name: "publishedAt",
    title: "Date de publication",
    type: "datetime",
    description: "Détermine l'ordre d'affichage (du plus récent au plus ancien)",
    initialValue: () => new Date().toISOString(),
    validation: (rule) => rule.required(),
  }),
];
