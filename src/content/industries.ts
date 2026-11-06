export type Industry = {
  slug: string;
  title: string;
  short: string;
  image: string;
  imageAlt: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  intro: string[];
  sections: { title: string; body: string; points?: string[] }[];
  platforms: string[];
  related: string[];
};

export const industries: Industry[] = [
  {
    slug: "health",
    title: "Health",
    short: "Compliant, secure IT for clinics and healthcare providers, so staff can focus on patients.",
    image: "health",
    imageAlt: "Doctor using a laptop with a patient",
    metaTitle: "Healthcare IT Services in Toronto (PHIPA, PIPEDA)",
    metaDescription:
      "Managed IT for Ontario healthcare providers. Compliance support for PHIPA, PIPEDA and HIPAA, EMR/EHR maintenance and secure systems for clinics in the GTA.",
    headline: "IT that keeps care running and data protected",
    intro: [
      "Healthcare depends on technology for patient services and internal operations alike. A strong IT system protects sensitive data, supports secure communication and makes it easier to adopt new ways of delivering care.",
      "We build compliance into your IT system and maintain it for you, so your staff can spend their time on patient care.",
    ],
    sections: [
      {
        title: "Compliance, built in",
        body: "A robust IT infrastructure is essential for implementing, maintaining and improving compliance standards. We support compliance with:",
        points: ["PHIPA", "PIPEDA", "HIPAA"],
      },
      {
        title: "The problem we solve",
        body: "Providers want to improve patient service, but technology often gets in the way.",
        points: [
          "Staff rarely have time to maintain and improve IT",
          "Specialised IT expertise is hard to find in-house",
          "Systems need constant updates to stay secure and fast",
        ],
      },
      {
        title: "How we work",
        body: "We have experience delivering integrated IT for private and public healthcare providers. There is no one-size-fits-all package: we study your needs, goals and constraints, then use analytics, automation and software to help you run at your best, improving efficiency, data accuracy, decision-making and patient service.",
      },
    ],
    platforms: ["PS Suite", "Xolomon", "NextGen Healthcare", "Kareo Clinical"],
    related: ["managed-it-support", "cybersecurity", "backup-and-disaster-recovery"],
  },
  {
    slug: "manufacturing-and-distribution",
    title: "Manufacturing & Distribution",
    short: "IT that streamlines production, logistics and the supply chain from end to end.",
    image: "manufacturing",
    imageAlt: "Large modern factory floor",
    metaTitle: "IT Services for Manufacturing & Distribution in Ontario",
    metaDescription:
      "IT for Ontario manufacturers and distributors: supply chain efficiency, automation, Salesforce, Microsoft Dynamics 365 and SAP, designed, installed and maintained by Techfahm.",
    headline: "IT that makes the supply chain faster and sharper",
    intro: [
      "Digitisation is changing how companies produce, sell, deliver and manage their supply chains. Used well, technology improves efficiency, oversight, security and results.",
      "The right IT infrastructure matches your operational and supply chain goals and streamlines every step of the distribution network.",
    ],
    sections: [
      {
        title: "Why IT feels like a burden",
        body: "Many manufacturers and distributors struggle to adopt the technology they need. It usually comes down to three things:",
        points: [
          "Time: leaders can't commit hours to building and optimising IT",
          "Expertise: running an optimal IT system takes specialised skills",
          "Resources: the budget or staff to support it isn't there",
        ],
      },
      {
        title: "Our approach",
        body: "We take a holistic approach to designing, installing and maintaining IT systems. First we learn your goals and constraints, then we deliver a fully customised set of solutions.",
      },
      {
        title: "What changes",
        body: "The effects show up across the business:",
        points: [
          "For the business: a more flexible, efficient and robust supply chain",
          "For your teams: automation, faster operations and better accuracy",
          "For your clients: faster delivery and better insight",
        ],
      },
    ],
    platforms: ["Salesforce", "Microsoft Dynamics 365", "SAP"],
    related: ["cloud-computing", "it-consulting", "network-management"],
  },
];

export const getIndustry = (slug: string) => industries.find((s) => s.slug === slug);
