export const modules = [
  "Overview",
  "Deal pipeline",
  "Properties",
  "Contacts",
  "Site visits",
  "Reports",
];
export const stages = ["Qualified", "Site visit", "Negotiation", "Closed"];
export const db = {
  deals: [
    {
      id: 1,
      name: "Arjun Mehta",
      property: "3 BHK · Lucknow",
      segment: "Residential",
      stage: "Qualified",
      value: 9500000,
    },
    {
      id: 2,
      name: "Neha Sharma",
      property: "Villa · Bengaluru",
      segment: "Residential",
      stage: "Qualified",
      value: 18000000,
    },
    {
      id: 3,
      name: "Vertex Studio",
      property: "Office · Gurugram",
      segment: "Commercial",
      stage: "Site visit",
      value: 2400000,
    },
    {
      id: 4,
      name: "Riya Kapoor",
      property: "2 BHK · Noida",
      segment: "Residential",
      stage: "Negotiation",
      value: 7200000,
    },
  ],
  properties: [
    {
      id: 1,
      name: "Orchard Residences · A-304",
      city: "Lucknow",
      segment: "Residential",
      size: "3 BHK · 1,650 sq.ft",
      price: 9500000,
      status: "Available",
    },
    {
      id: 2,
      name: "Skyline Business Park · 602",
      city: "Gurugram",
      segment: "Commercial",
      size: "Office · 3,000 sq.ft",
      price: 2400000,
      status: "Available",
    },
    {
      id: 3,
      name: "Cedar Villa · 12",
      city: "Bengaluru",
      segment: "Residential",
      size: "Villa · 2,400 sq.ft",
      price: 18000000,
      status: "Reserved",
    },
  ],
  contacts: [
    {
      id: 1,
      name: "Arjun Mehta",
      company: "Individual buyer",
      email: "arjun@example.com",
      segment: "Residential",
    },
    {
      id: 2,
      name: "Vertex Studio",
      company: "Vertex Studio",
      email: "team@example.com",
      segment: "Commercial",
    },
  ],
  visits: [
    {
      id: 1,
      name: "Vertex Studio",
      property: "Skyline Business Park · 602",
      date: "2027-01-05T11:00",
      status: "Scheduled",
    },
  ],
};
