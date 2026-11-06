export type Service = {
  slug: string;
  title: string;
  short: string;
  image: string;
  imageAlt: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  includes: string[];
  benefits: { title: string; body: string }[];
  related: string[];
};

export const services: Service[] = [
  {
    slug: "network-management",
    title: "Network Management",
    short: "We watch uptime, traffic and network health so problems get fixed before your team notices them.",
    image: "network",
    imageAlt: "Network cables connected to a switch",
    metaTitle: "Network Management Services in Toronto",
    metaDescription:
      "Proactive network management for Toronto and GTA businesses. Techfahm monitors uptime, traffic and security across your network and fixes issues fast.",
    intro: [
      "Your network is the part of IT everyone depends on and nobody thinks about until it slows down. We take over its administration, maintenance and control so it keeps running at its best.",
      "We monitor accessibility, uptime, traffic and overall health around the clock, catch issues early and resolve them quickly. Every setup is planned around your own infrastructure and the challenges your business actually has.",
    ],
    includes: [
      "Continuous monitoring of uptime, traffic and device health",
      "Network administration, maintenance and configuration",
      "Vulnerability checks with clear, actionable fixes",
      "Reporting that turns network data into decisions",
    ],
    benefits: [
      {
        title: "Better insight",
        body: "A data analytics approach pulls the key signals out of your network activity, so you can make smarter decisions about IT and the business.",
      },
      {
        title: "Faster, steadier performance",
        body: "We track the metrics that matter, reinforce what works and fix what doesn't, so the network keeps pace with your team.",
      },
      {
        title: "Stronger security",
        body: "We find weak points and recommend fixes that harden your defences against cyberattacks and unauthorised access.",
      },
    ],
    related: ["cybersecurity", "managed-it-support"],
  },
  {
    slug: "managed-it-support",
    title: "Managed IT Support",
    short: "One team designs, runs and maintains your critical systems, so your staff can get back to their own work.",
    image: "support",
    imageAlt: "IT support specialist helping a client",
    metaTitle: "Managed IT Support for Toronto Businesses",
    metaDescription:
      "Managed IT support in Toronto, Hamilton and Waterloo. Techfahm designs, runs and maintains your IT systems to cut costs and keep your team productive.",
    intro: [
      "When IT lands on people who already have a full-time job, things slip. We take on the design, operation and maintenance of your critical IT systems so your internal team isn't stretched thin.",
      "Support is shaped around your goals, not a generic checklist. The result is an IT setup that is optimised, efficient and cost-effective, with one partner accountable for it.",
    ],
    includes: [
      "Help desk support for your staff",
      "Hardware and software reviews aligned to your goals",
      "Patching, updates and routine maintenance",
      "Planning for new hires, devices and locations",
    ],
    benefits: [
      {
        title: "IT that fits the business",
        body: "We review your setup, hardware and software so every piece supports what the company is trying to do.",
      },
      {
        title: "Lower operating costs",
        body: "Outsourcing IT trims spending. The time and resources saved by a more efficient, secure system help offset the cost of the service.",
      },
      {
        title: "A more productive team",
        body: "When systems run smoothly, people work at full speed instead of waiting on fixes.",
      },
    ],
    related: ["network-management", "it-consulting"],
  },
  {
    slug: "cloud-computing",
    title: "Cloud Computing",
    short: "Databases, storage, analytics, software and networking in the cloud, set up around how your team works.",
    image: "cloud",
    imageAlt: "Cloud computing concept",
    metaTitle: "Cloud Computing Services in Toronto",
    metaDescription:
      "Cloud computing solutions for Toronto and Ontario businesses: storage, databases, analytics, software and networking that scale with you. Book a free consultation.",
    intro: [
      "Cloud tools make it easier for teams to work together, share data and move faster. We deliver a suite of cloud services for databases, storage, analytics, software and networking.",
      "Each solution is fitted to your business, so collaboration improves, workflows get smoother and your data becomes useful for real decisions.",
    ],
    includes: [
      "Cloud storage and database setup",
      "Migration of files, apps and email",
      "Collaboration and communication tools",
      "Cloud security and access control",
    ],
    benefits: [
      {
        title: "Flexibility on demand",
        body: "Cloud tools are there when you need them, so you don't have to replace systems every time your needs change.",
      },
      {
        title: "Room to grow",
        body: "Flexible, customisable solutions give you the right resources at every stage of growth.",
      },
      {
        title: "Security built in",
        body: "Cloud security measures protect business data and customer information from cyber threats.",
      },
    ],
    related: ["backup-and-disaster-recovery", "cybersecurity"],
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity",
    short: "Protection for your data, your customers and your reputation, sized for small and mid-sized businesses.",
    image: "cyber",
    imageAlt: "Digital security key over data",
    metaTitle: "Cybersecurity Services for Small Businesses in Toronto",
    metaDescription:
      "Cybersecurity for Toronto SMBs. Techfahm protects your data, customers and intellectual property from external and internal threats. Get a free consultation.",
    intro: [
      "Many owners assume attackers only go after large corporations. In reality, small and medium-sized businesses are a major target, and an attack can put your data, reputation and revenue at risk.",
      "We help businesses build resilience against sophisticated threats with a security strategy that stays current as new risks appear.",
    ],
    includes: [
      "Security assessment of your current setup",
      "Multi-tier access control for sensitive data",
      "Protection against internal and external threats",
      "Ongoing updates as new threats emerge",
    ],
    benefits: [
      {
        title: "Customer confidence",
        body: "Customers care about how you handle their data. Strong data security gives them peace of mind.",
      },
      {
        title: "No unauthorised access",
        body: "Multi-tier confidentiality makes sure only the right people can reach sensitive data, from outside or inside the business.",
      },
      {
        title: "Protected intellectual property",
        body: "We safeguard your IP from cyber threats so operations keep running smoothly.",
      },
    ],
    related: ["backup-and-disaster-recovery", "network-management"],
  },
  {
    slug: "backup-and-disaster-recovery",
    title: "Backup & Disaster Recovery",
    short: "Strategic copies of the data you can't lose, and a tested plan to get you running again fast.",
    image: "backup",
    imageAlt: "Data backup and recovery",
    metaTitle: "Backup and Disaster Recovery Services in Ontario",
    metaDescription:
      "Backup and disaster recovery for Ontario businesses. Techfahm protects essential data and builds a recovery plan to restore operations quickly after any incident.",
    intro: [
      "No business can prevent every emergency. Without a backup and recovery plan, one incident can erase months or years of work.",
      "We create strategic copies of your essential data and build an action plan to recover it and restore normal operations, whatever happens.",
    ],
    includes: [
      "Automated backups of essential systems and files",
      "A written disaster recovery action plan",
      "Recovery testing so the plan actually works",
      "Fast restore when something goes wrong",
    ],
    benefits: [
      {
        title: "Data protection",
        body: "Your data is one of your most valuable assets. A solid backup plan reduces risk and protects business information.",
      },
      {
        title: "Quick recovery",
        body: "Even the best security can't stop every emergency. Our plans focus on getting you back to work quickly.",
      },
      {
        title: "Peace of mind",
        body: "Knowing recovery is handled lets you focus on running the business proactively.",
      },
    ],
    related: ["cybersecurity", "cloud-computing"],
  },
  {
    slug: "it-consulting",
    title: "IT Consulting",
    short: "Independent advice that lines your technology back up with where the business is going.",
    image: "consulting",
    imageAlt: "Co-workers planning an IT strategy",
    metaTitle: "IT Consulting Services in Toronto",
    metaDescription:
      "IT consulting for growing Toronto businesses. Techfahm studies your setup and goals and gives personalised, scalable advice without the cost of an in-house IT team.",
    intro: [
      "As businesses grow, they add tools one at a time, and the gap between technology and goals quietly widens. We help close it.",
      "Our team studies your setup, technical challenges and short- and long-term goals before giving advice, so every recommendation fits your business.",
    ],
    includes: [
      "IT assessment and roadmap",
      "Vendor and software selection",
      "Planning for growth and new locations",
      "Budgeting for IT projects",
    ],
    benefits: [
      {
        title: "Personalised advice",
        body: "Guidance built around your specific goals and obstacles, not a template.",
      },
      {
        title: "Scales with you",
        body: "Strategies that suit each phase of growth, from first office to multiple sites.",
      },
      {
        title: "Saved resources",
        body: "Expert advice without the cost and time of hiring a full in-house IT team.",
      },
    ],
    related: ["managed-it-support", "cloud-computing"],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
