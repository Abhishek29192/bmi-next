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

export interface Link<T extends string> {
  sys: {
    type: "Link";
    linkType: T;
    id: string;
  };
}

export interface MetaLinkProps {
  type: string;
  linkType: string;
  id: string;
}
export interface SysLink {
  sys: MetaLinkProps;
}

export interface BasicMetaSysProps {
  type: string;
  id: string;
  version: number;
  createdBy?: SysLink;
  createdAt: string;
  updatedBy?: SysLink;
  updatedAt: string;
}
export interface MetaSysProps extends BasicMetaSysProps {
  space?: SysLink;
  status?: SysLink;
  publishedVersion?: number;
  archivedVersion?: number;
  archivedBy?: SysLink;
  archivedAt?: string;
  deletedVersion?: number;
  deletedBy?: SysLink;
  deletedAt?: string;
}
export interface EntityMetaSysProps extends MetaSysProps {
  space: SysLink;
  contentType: SysLink;
  environment: SysLink;
  publishedBy?: Link<"User"> | Link<"AppDefinition">;
  publishedAt?: string;
  firstPublishedAt?: string;
  publishedCounter?: number;
  locale?: string;
}

export interface ContentfulWebhook {
  metadata?: metadata;
  sys?: EntityMetaSysProps;
  fields?: unknown;
}
