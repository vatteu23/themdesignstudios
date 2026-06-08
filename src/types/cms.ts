export interface Service {
  id: string;
  service_name: string;
  service_description: string;
  service_image?: string;
  service_pagename?: string;
  service_created_at?: number;
  service_projects?: string[];
  service_order?: number;
  service_active?: boolean;
  service_icon?: string;
}

export interface Project {
  id: string;
  project_name: string;
  project_description?: string;
  project_image?: string;
  project_pagename?: string;
  project_service?: string;
  project_location?: string;
  project_type?: string;
  project_date?: string;
  project_client?: string;
  project_budget?: string;
  project_duration?: string;
  project_content?: string;
  project_created_at?: number;
  project_active?: boolean;
}

export interface ProjectImage {
  id: string;
  image_projectid: string;
  image_projectimage: string;
  image_caption?: string;
  image_order?: number;
}

export interface PageContent {
  content_id?: string;
  content_key?: string;
  content_title: string;
  content_description: string;
  content_active: string;
}

export interface SiteSettings {
  site_name: string;
  tagline: string;
  site_url?: string;
  og_image_url: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  map_embed_url: string;
  social_instagram: string;
  social_linkedin: string;
  footer_copyright: string;
}

export interface HeroGalleryItem {
  image_url: string;
  alt: string;
  order: number;
}

export interface HomeContent {
  hero_quote: string;
  hero_author: string;
  hero_gallery: HeroGalleryItem[];
  philosophy_title: string;
  philosophy_body: string;
  services_display: "featured" | "all";
  featured_service_ids: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url?: string;
  order: number;
  active: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  order: number;
  active: boolean;
}

export interface PageMetadata {
  title: string;
  description: string;
  og_image?: string;
}

export interface EmailSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface AuditLogEntry {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  entity: string;
  entity_id: string;
  timestamp: number;
}

export const PAGE_CONTENT_KEYS = {
  WHAT_WE_DO: "what-we-do",
  WHO_WE_ARE: "who-we-are",
} as const;

export const LEGACY_PAGE_CONTENT_IDS: Record<string, string> = {
  "what-we-do": "-MDGRuhFTBixRVFspb4V",
  "who-we-are": "-MDIt4KlYbfKpBOh36ua",
};

export const SERVICE_ICONS = [
  "HomeModernIcon",
  "CubeIcon",
  "SwatchIcon",
  "GlobeAltIcon",
  "ClipboardDocumentListIcon",
  "PaintBrushIcon",
] as const;
