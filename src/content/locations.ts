export type Location = {
  slug: string;
  region: string;
  city: string;
  places: string[];
  image: string;
  metaTitle: string;
  metaDescription: string;
  headline: string[];
  lead: string;
  intro: string[];
  faq: { q: string; a: string }[];
};

/** Local landing pages — one per service region. Geography only, no invented claims. */
export const locations: Location[] = [
  {
    slug: "managed-it-services-toronto",
    region: "Greater Toronto Area",
    city: "Toronto",
    places: ["Toronto", "Mississauga", "Brampton", "Vaughan", "Markham", "Richmond Hill", "Oakville", "Pickering"],
    image: "company",
    metaTitle: "Managed IT Services & IT Support in Toronto and the GTA",
    metaDescription:
      "Managed IT services and IT support for Toronto and GTA businesses: network management, cybersecurity, cloud, backup and IT consulting. Book a free consultation.",
    headline: ["Managed IT services", "for Toronto businesses"],
    lead: "Monitoring, support, security and cloud for companies across Toronto and the Greater Toronto Area, from a team that knows your systems.",
    intro: [
      "Toronto businesses move fast, and their IT has to keep up. Techfahm takes care of the networks, devices, cloud tools and security that your team relies on every day, so problems get fixed before they slow anyone down.",
      "We work with small and medium-sized businesses across the GTA, from single offices to companies with several locations, and shape every plan around your goals and budget.",
    ],
    faq: [
      {
        q: "Do you offer IT support across the whole GTA?",
        a: "Yes. We work with businesses throughout the Greater Toronto Area, including Toronto, Mississauga, Brampton, Vaughan, Markham and surrounding cities.",
      },
      {
        q: "Can you take over from our current IT provider?",
        a: "Yes. We start with an assessment of your current setup, document what's in place, and plan the handover so your team isn't interrupted.",
      },
      {
        q: "Do you work with Toronto healthcare clinics?",
        a: "Yes. We support compliance with PHIPA and PIPEDA and help maintain EMR and EHR systems for healthcare providers.",
      },
    ],
  },
  {
    slug: "managed-it-services-hamilton",
    region: "Hamilton & Niagara",
    city: "Hamilton",
    places: ["Hamilton", "Stoney Creek", "Ancaster", "Dundas", "Grimsby", "St. Catharines", "Niagara Falls", "Welland"],
    image: "manufacturing",
    metaTitle: "Managed IT Services & IT Support in Hamilton and Niagara",
    metaDescription:
      "IT support and managed IT services for Hamilton and Niagara businesses: networks, cybersecurity, cloud, backup and IT consulting from Techfahm. Free consultation.",
    headline: ["Managed IT services", "for Hamilton & Niagara"],
    lead: "Reliable IT support, security and cloud for businesses in Hamilton, St. Catharines, Niagara Falls and the rest of the region.",
    intro: [
      "From manufacturers and distributors to clinics and professional offices, businesses in Hamilton and Niagara need IT that simply works. Techfahm designs, runs and maintains it for you.",
      "We monitor your network, keep systems patched and secure, protect your data with tested backups, and give your staff someone to call when something goes wrong.",
    ],
    faq: [
      {
        q: "Which areas in Hamilton and Niagara do you cover?",
        a: "We work with businesses across Hamilton and the Niagara Region, including Stoney Creek, Ancaster, Grimsby, St. Catharines, Niagara Falls and Welland.",
      },
      {
        q: "Do you support manufacturing and distribution companies?",
        a: "Yes. We design, install and maintain IT for manufacturers and distributors, including platforms like Microsoft Dynamics 365, Salesforce and SAP.",
      },
      {
        q: "How do we get started?",
        a: "Book a free consultation. We'll learn about your business, assess your current setup and send a clear proposal before any work begins.",
      },
    ],
  },
  {
    slug: "managed-it-services-waterloo",
    region: "Waterloo Region",
    city: "Waterloo",
    places: ["Waterloo", "Kitchener", "Cambridge", "Woolwich", "Wilmot", "Wellesley", "North Dumfries"],
    image: "team",
    metaTitle: "Managed IT Services & IT Support in Kitchener-Waterloo",
    metaDescription:
      "Managed IT services for Kitchener, Waterloo and Cambridge businesses: IT support, cybersecurity, cloud computing, backup and consulting. Book a free consultation.",
    headline: ["Managed IT services", "for Waterloo Region"],
    lead: "IT support, security and cloud for growing businesses in Kitchener, Waterloo, Cambridge and the surrounding townships.",
    intro: [
      "Waterloo Region is full of fast-growing companies, and growth is exactly when IT tends to fall behind. Techfahm helps you build systems that scale with the business instead of holding it back.",
      "We handle networks, devices, cloud tools, security and backups, and give you practical advice on what to invest in next.",
    ],
    faq: [
      {
        q: "Do you work with businesses in Kitchener and Cambridge?",
        a: "Yes. We serve the whole Waterloo Region, including Kitchener, Waterloo, Cambridge and the surrounding townships.",
      },
      {
        q: "Can you help a growing company plan its IT?",
        a: "Yes. Our IT consulting service looks at where your business is going and plans the technology to match each stage of growth.",
      },
      {
        q: "Do you offer cybersecurity for small businesses?",
        a: "Yes. We assess your current setup, control who can access sensitive data, and keep protections current as new threats appear.",
      },
    ],
  },
];

/** "the Greater Toronto Area", "the Waterloo Region", "Hamilton & Niagara" */
export const regionName = (l: Location) => (l.region === "Hamilton & Niagara" ? l.region : `the ${l.region}`);

export const getLocation = (slug: string) => locations.find((l) => l.slug === slug);
