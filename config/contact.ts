export const contact = {
  email: "gmun@gitam.in",
  /**
   * `photo` is a path under /public (e.g. "/team/saketh-jasthi.jpg"), ideally
   * a portrait at least 800×1000. Leave it null to show the placeholder.
   */
  team: [
    { name: "Saketh Jasthi", role: "President, GMUN", phone: "8885649766", photo: null as string | null },
    { name: "Akshaya Tadi", role: "Vice President, GMUN", phone: "8885649766", photo: null as string | null },
  ],
  social: {
    instagram: null as string | null,
    linkedin: null as string | null,
  },
  partner: {
    heading: "Partner With Us",
    body: "We invite brands, organisations, institutions, and individuals to partner with GMUN 5.0 as sponsors and collaborators. Join us in creating a platform that brings together young minds through diplomacy, leadership, dialogue, and meaningful engagement. Partner with us to connect, collaborate, and make an impact.",
  },
} as const;
