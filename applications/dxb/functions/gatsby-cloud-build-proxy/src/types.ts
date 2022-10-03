export interface sys {
  id: string;
  type: string;
  linkType: string;
}

export interface tag {
  sys: sys;
}

export interface metadata {
  tags?: tag[];
}
export interface ContentfulWebhook {
  metadata?: metadata;
  sys?: unknown;
  fields?: unknown;
}
