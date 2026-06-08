import { PageMetadata, SiteSettings } from "@/types/cms";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_name: "Them design studios",
  tagline: "Architecture & Spatial Design Services",
  site_url: "",
  og_image_url: "/them-studios.png",
  contact_email: "maneesh@themdesignstudios.com",
  contact_phone: "+917702277247",
  contact_address:
    "11-13-981, Road No. 2, Green Hills Colony, L. B. Nagar, Hyderabad, Telangana 500035, India",
  map_embed_url:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3808.0778366494734!2d78.54965387466983!3d17.356500583736324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb980e9d0325c1%3A0x9ffc55fb55db5ddc!2s11-13-981%2C%20Road%20No.%202%2C%20Green%20Hills%20Colony%2C%20Haripuri%20Colony%2C%20Vasavi%20Colony%2C%20L.%20B.%20Nagar%2C%20Hyderabad%2C%20Telangana%20500035%2C%20India!5e0!3m2!1sen!2sus!4v1718792351244!5m2!1sen!2sus",
  social_instagram: "https://www.instagram.com/themhyd/",
  social_linkedin: "https://www.linkedin.com/company/them-studios/",
  footer_copyright: "Them design studios. All rights reserved.",
};

export const DEFAULT_PAGE_METADATA: Record<string, PageMetadata> = {
  home: {
    title: "Them design studios",
    description:
      "Architecture & Spatial Design Services in India. Hyderabad | Bangalore | Bombay",
    og_image: "/them-studios.png",
  },
  about: {
    title: "About | Them design studios",
    description: "Learn about Them design studios and our team.",
    og_image: "/them-studios.png",
  },
  services: {
    title: "Services | Them design studios",
    description: "Architecture, interior design, and spatial design services.",
    og_image: "/them-studios.png",
  },
  portfolio: {
    title: "Portfolio | Them design studios",
    description: "Explore our portfolio of architecture and design projects.",
    og_image: "/them-studios.png",
  },
  contact: {
    title: "Contact | Them design studios",
    description: "Get in touch with Them design studios.",
    og_image: "/them-studios.png",
  },
};
