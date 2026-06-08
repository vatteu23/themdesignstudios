export type {
  Service,
  Project,
  ProjectImage,
  PageContent,
  SiteSettings,
  HomeContent,
  HeroGalleryItem,
  TeamMember,
  NavItem,
  PageMetadata,
  EmailSubmission,
  AuditLogEntry,
} from "./cms";

export { PAGE_CONTENT_KEYS, LEGACY_PAGE_CONTENT_IDS, SERVICE_ICONS } from "./cms";

// Legacy aliases kept for backward compatibility
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role?: string;
}

export interface Email {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  service?: string;
  timestamp: string;
  status: "new" | "read" | "replied";
}

export interface Feedback {
  id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  projectId?: string;
  timestamp: string;
}
