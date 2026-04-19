/**
 * Page Content Definitions
 *
 * Defines fixed page structures with predefined sections and fields.
 * Each page specifies what sections it contains and what data they need.
 * This replaces the dynamic section builder with a structured approach.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "json"
  | "media"
  | "number"
  | "boolean";

export interface FieldDefinition {
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
}

export interface SectionDefinition {
  sectionKey: string;
  label: string;
  description?: string;
  fields: Record<string, FieldDefinition>;
}

export interface PageDefinition {
  pageKey: string;
  label: string;
  sections: SectionDefinition[];
}

/**
 * All page definitions
 * Maps page keys to their section structures
 */
export const PAGE_DEFINITIONS: Record<string, PageDefinition> = {
  home: {
    pageKey: "home",
    label: "Home Page",
    sections: [
      {
        sectionKey: "hero",
        label: "Hero Section",
        description: "Main hero banner with headline and CTA",
        fields: {
          title: {
            type: "text",
            label: "Main Title",
            placeholder: "Trusted, Healthy",
            required: true,
          },
          subtitle: {
            type: "text",
            label: "Subtitle",
            placeholder: "Transforming Healthcare in Syria",
          },
          buttonText: {
            type: "text",
            label: "Button Text",
            placeholder: "Learn More",
          },
          buttonLink: {
            type: "text",
            label: "Button Link",
            placeholder: "/about",
          },
          imageId: {
            type: "media",
            label: "Hero Image",
          },
        },
      },
      {
        sectionKey: "trustMetrics",
        label: "Trust Metrics",
        description: "Display key metrics that build trust",
        fields: {
          title: {
            type: "text",
            label: "Section Title",
            placeholder: "Why Trust Damira",
          },
          items: {
            type: "json",
            label: "Metrics (JSON array)",
            description:
              "Array of metric objects with label, value, description",
            required: true,
          },
        },
      },
      {
        sectionKey: "capabilities",
        label: "Capabilities",
        description: "Core capabilities and strengths",
        fields: {
          title: {
            type: "text",
            label: "Section Title",
            placeholder: "Our Capabilities",
            required: true,
          },
          description: {
            type: "textarea",
            label: "Section Description",
          },
          cards: {
            type: "json",
            label: "Capability Cards (JSON array)",
            description: "Array of card objects with icon, title, description",
            required: true,
          },
        },
      },
      {
        sectionKey: "featuredProducts",
        label: "Featured Products",
        description: "Showcase featured products",
        fields: {
          title: {
            type: "text",
            label: "Section Title",
            placeholder: "Featured Products",
          },
          productIds: {
            type: "json",
            label: "Product IDs (JSON array)",
            description: "Array of product IDs to display",
            required: true,
          },
        },
      },
      {
        sectionKey: "cta",
        label: "Call to Action",
        description: "Final CTA section",
        fields: {
          title: {
            type: "text",
            label: "CTA Title",
            placeholder: "Ready to Partner?",
            required: true,
          },
          description: {
            type: "textarea",
            label: "CTA Description",
          },
          buttonText: {
            type: "text",
            label: "Button Text",
            placeholder: "Contact Us",
          },
          buttonLink: {
            type: "text",
            label: "Button Link",
            placeholder: "/contact",
          },
        },
      },
    ],
  },

  about: {
    pageKey: "about",
    label: "About Page",
    sections: [
      {
        sectionKey: "hero",
        label: "Hero Section",
        description: "Page header with title and background",
        fields: {
          title: {
            type: "text",
            label: "Page Title",
            placeholder: "About Damira Pharma",
            required: true,
          },
          subtitle: {
            type: "text",
            label: "Subtitle",
          },
          imageId: {
            type: "media",
            label: "Hero Image",
          },
        },
      },
      {
        sectionKey: "story",
        label: "Company Story",
        description: "Our journey and history",
        fields: {
          title: {
            type: "text",
            label: "Section Title",
            placeholder: "Our Story",
          },
          content: {
            type: "textarea",
            label: "Story Content",
            required: true,
          },
        },
      },
      {
        sectionKey: "missionVision",
        label: "Mission & Vision",
        description: "Company mission and vision statements",
        fields: {
          missionTitle: {
            type: "text",
            label: "Mission Title",
            placeholder: "Our Mission",
          },
          missionContent: {
            type: "textarea",
            label: "Mission Statement",
          },
          visionTitle: {
            type: "text",
            label: "Vision Title",
            placeholder: "Our Vision",
          },
          visionContent: {
            type: "textarea",
            label: "Vision Statement",
          },
        },
      },
      {
        sectionKey: "values",
        label: "Core Values",
        description: "Display company values",
        fields: {
          title: {
            type: "text",
            label: "Section Title",
            placeholder: "Our Values",
          },
          values: {
            type: "json",
            label: "Values (JSON array)",
            description: "Array of value objects with icon, title, description",
            required: true,
          },
        },
      },
    ],
  },

  services: {
    pageKey: "services",
    label: "Services Page",
    sections: [
      {
        sectionKey: "hero",
        label: "Hero Section",
        description: "Page header",
        fields: {
          title: {
            type: "text",
            label: "Page Title",
            placeholder: "Our Services",
            required: true,
          },
          subtitle: {
            type: "text",
            label: "Subtitle",
          },
          imageId: {
            type: "media",
            label: "Hero Image",
          },
        },
      },
      {
        sectionKey: "serviceBlocks",
        label: "Service Blocks",
        description: "Main service offerings",
        fields: {
          title: {
            type: "text",
            label: "Section Title",
            placeholder: "What We Offer",
          },
          services: {
            type: "json",
            label: "Services (JSON array)",
            description:
              "Array of service objects with icon, title, description",
            required: true,
          },
        },
      },
      {
        sectionKey: "infrastructure",
        label: "Infrastructure Highlights",
        description: "Infrastructure and capabilities",
        fields: {
          title: {
            type: "text",
            label: "Section Title",
            placeholder: "Our Infrastructure",
          },
          highlights: {
            type: "json",
            label: "Highlights (JSON)",
            description: "Array of highlight objects",
            required: true,
          },
        },
      },
    ],
  },

  products: {
    pageKey: "products",
    label: "Products Page",
    sections: [
      {
        sectionKey: "hero",
        label: "Hero Section",
        fields: {
          title: {
            type: "text",
            label: "Page Title",
            placeholder: "Our Products",
            required: true,
          },
          subtitle: {
            type: "text",
            label: "Subtitle",
          },
          imageId: {
            type: "media",
            label: "Hero Image",
          },
        },
      },
      {
        sectionKey: "introduction",
        label: "Introduction",
        fields: {
          content: {
            type: "textarea",
            label: "Introduction Text",
          },
        },
      },
    ],
  },

  contact: {
    pageKey: "contact",
    label: "Contact Page",
    sections: [
      {
        sectionKey: "hero",
        label: "Hero Section",
        fields: {
          title: {
            type: "text",
            label: "Page Title",
            placeholder: "Contact Us",
            required: true,
          },
          subtitle: {
            type: "text",
            label: "Subtitle",
          },
        },
      },
      {
        sectionKey: "contactInfo",
        label: "Contact Information",
        fields: {
          email: {
            type: "text",
            label: "Email Address",
          },
          phone: {
            type: "text",
            label: "Phone Number",
          },
          address: {
            type: "text",
            label: "Address",
          },
        },
      },
    ],
  },
};

/**
 * Get page definition by key
 */
export function getPageDefinition(pageKey: string): PageDefinition | undefined {
  return PAGE_DEFINITIONS[pageKey];
}

/**
 * Get all available page keys
 */
export function getAllPageKeys(): string[] {
  return Object.keys(PAGE_DEFINITIONS);
}

/**
 * Get section definition within a page
 */
export function getSectionDefinition(
  pageKey: string,
  sectionKey: string,
): SectionDefinition | undefined {
  const page = getPageDefinition(pageKey);
  if (!page) return undefined;
  return page.sections.find((s) => s.sectionKey === sectionKey);
}

/**
 * Validate that a page structure is valid
 */
export function validatePageStructure(
  pageKey: string,
  structure: Record<string, unknown>,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const page = getPageDefinition(pageKey);

  if (!page) {
    errors.push(`Page '${pageKey}' not found`);
    return { valid: false, errors };
  }

  // Check that all required sections exist
  for (const section of page.sections) {
    if (!structure[section.sectionKey]) {
      // Note: sections can be optional, this is just a check
      // You can customize this logic
    }
  }

  return { valid: errors.length === 0, errors };
}
