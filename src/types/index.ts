export interface Service {
  id: string;
  service_name: string;
  service_description: string;
  service_image?: string;
  service_pagename?: string;
  service_created_at?: number;
  service_projects?: string[];

  // Keep these for backward compatibility
  title?: string;
  description?: string;
  imageUrl?: string;
  content?: string;
  active?: boolean;
  longDescription?: string;
  features?: string[];
  category?: string;
  duration?: string;
  technologies?: string[];
  pricing?: {
    type: "fixed" | "hourly" | "starting";
    value: number;
    description?: string;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  content?: string;
  serviceId?: string;
  client?: string;
  completionDate?: string;
  tags?: string[];
  project_pagename?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
}

export interface PageContent {
  content_id: string;
  content_title: string;
  content_description: string;
  content_active: string;
}

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
