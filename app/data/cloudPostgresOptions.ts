export type CloudPostgresOption = {
  value: string;
  label: string;
};

export type AvailabilityOption = CloudPostgresOption & {
  nodeMultiplier: number;
  description: string;
};

export type CloudPostgresProvider = {
  id: string;
  providerName: string;
  serviceName: string;
  shortLabel: string;
  regions: CloudPostgresOption[];
  availabilityOptions: AvailabilityOption[];
  computeTiers: CloudPostgresOption[];
  storageTypes: CloudPostgresOption[];
  pricingModes: CloudPostgresOption[];
  defaults: {
    regionId: string;
    availabilityId: string;
    computeTierId: string;
    storageTypeId: string;
    pricingModeId: string;
  };
};

export const cloudPostgresProviders: CloudPostgresProvider[] = [
  {
    id: "aws",
    providerName: "Amazon Web Services",
    serviceName: "Amazon RDS for PostgreSQL",
    shortLabel: "Amazon RDS",
    regions: [
      { value: "us-east-1", label: "US East (N. Virginia) — us-east-1" },
      { value: "us-east-2", label: "US East (Ohio) — us-east-2" },
      { value: "us-west-1", label: "US West (N. California) — us-west-1" },
      { value: "us-west-2", label: "US West (Oregon) — us-west-2" },
      { value: "ap-south-1", label: "Asia Pacific (Mumbai) — ap-south-1" },
      { value: "ap-south-2", label: "Asia Pacific (Hyderabad) — ap-south-2" },
      { value: "ap-southeast-1", label: "Asia Pacific (Singapore) — ap-southeast-1" },
      { value: "ap-southeast-2", label: "Asia Pacific (Sydney) — ap-southeast-2" },
      { value: "ap-northeast-1", label: "Asia Pacific (Tokyo) — ap-northeast-1" },
      { value: "eu-west-1", label: "Europe (Ireland) — eu-west-1" },
      { value: "eu-central-1", label: "Europe (Frankfurt) — eu-central-1" },
      { value: "me-central-1", label: "Middle East (UAE) — me-central-1" },
      { value: "ca-central-1", label: "Canada (Central) — ca-central-1" },
      { value: "sa-east-1", label: "South America (São Paulo) — sa-east-1" },
      { value: "other", label: "Other AWS Region" },
    ],
    availabilityOptions: [
      {
        value: "single-az",
        label: "Single-AZ deployment",
        nodeMultiplier: 1,
        description: "One primary database instance.",
      },
      {
        value: "multi-az-one-standby",
        label: "Multi-AZ deployment — one standby",
        nodeMultiplier: 2,
        description: "One primary and one standby database instance.",
      },
      {
        value: "multi-az-two-readable",
        label: "Multi-AZ DB cluster — two readable standbys",
        nodeMultiplier: 3,
        description: "One writer and two readable standby instances.",
      },
    ],
    computeTiers: [
      { value: "burstable", label: "Burstable instance family" },
      { value: "general-purpose", label: "General-purpose instance family" },
      { value: "memory-optimized", label: "Memory-optimized instance family" },
      { value: "other", label: "Other RDS instance family" },
    ],
    storageTypes: [
      { value: "gp3", label: "General Purpose SSD — gp3" },
      { value: "gp2", label: "General Purpose SSD — gp2" },
      { value: "io2", label: "Provisioned IOPS SSD — io2" },
      { value: "io1", label: "Provisioned IOPS SSD — io1" },
      { value: "magnetic", label: "Magnetic storage" },
      { value: "other", label: "Other RDS storage type" },
    ],
    pricingModes: [
      { value: "combined", label: "Combined database instance hourly rate" },
      { value: "split", label: "Separate vCPU and memory hourly rates" },
    ],
    defaults: {
      regionId: "ap-south-1",
      availabilityId: "single-az",
      computeTierId: "general-purpose",
      storageTypeId: "gp3",
      pricingModeId: "combined",
    },
  },
  {
    id: "azure",
    providerName: "Microsoft Azure",
    serviceName: "Azure Database for PostgreSQL Flexible Server",
    shortLabel: "Azure PostgreSQL",
    regions: [
      { value: "east-us", label: "East US" },
      { value: "east-us-2", label: "East US 2" },
      { value: "west-us-2", label: "West US 2" },
      { value: "west-us-3", label: "West US 3" },
      { value: "central-us", label: "Central US" },
      { value: "north-europe", label: "North Europe" },
      { value: "west-europe", label: "West Europe" },
      { value: "uk-south", label: "UK South" },
      { value: "germany-west-central", label: "Germany West Central" },
      { value: "central-india", label: "Central India" },
      { value: "south-india", label: "South India" },
      { value: "southeast-asia", label: "Southeast Asia" },
      { value: "east-asia", label: "East Asia" },
      { value: "japan-east", label: "Japan East" },
      { value: "australia-east", label: "Australia East" },
      { value: "uae-north", label: "UAE North" },
      { value: "brazil-south", label: "Brazil South" },
      { value: "canada-central", label: "Canada Central" },
      { value: "other", label: "Other Azure Region" },
    ],
    availabilityOptions: [
      {
        value: "no-ha",
        label: "No high availability",
        nodeMultiplier: 1,
        description: "One primary flexible server.",
      },
      {
        value: "same-zone-ha",
        label: "Same-zone high availability",
        nodeMultiplier: 2,
        description: "One primary and one standby in the same zone.",
      },
      {
        value: "zone-redundant-ha",
        label: "Zone-redundant high availability",
        nodeMultiplier: 2,
        description: "One primary and one standby in different zones.",
      },
    ],
    computeTiers: [
      { value: "burstable", label: "Burstable" },
      { value: "general-purpose", label: "General Purpose" },
      { value: "memory-optimized", label: "Memory Optimized" },
    ],
    storageTypes: [
      { value: "premium-ssd", label: "Premium SSD" },
      { value: "premium-ssd-v2", label: "Premium SSD v2" },
      { value: "other", label: "Other Azure storage option" },
    ],
    pricingModes: [
      { value: "split", label: "Separate vCore and memory hourly rates" },
      { value: "combined", label: "Combined server hourly rate" },
    ],
    defaults: {
      regionId: "central-india",
      availabilityId: "no-ha",
      computeTierId: "general-purpose",
      storageTypeId: "premium-ssd",
      pricingModeId: "split",
    },
  },
  {
    id: "gcp",
    providerName: "Google Cloud",
    serviceName: "Cloud SQL for PostgreSQL",
    shortLabel: "Cloud SQL",
    regions: [
      { value: "us-central1", label: "Iowa — us-central1" },
      { value: "us-east1", label: "South Carolina — us-east1" },
      { value: "us-east4", label: "Northern Virginia — us-east4" },
      { value: "us-west1", label: "Oregon — us-west1" },
      { value: "us-west2", label: "Los Angeles — us-west2" },
      { value: "europe-west1", label: "Belgium — europe-west1" },
      { value: "europe-west2", label: "London — europe-west2" },
      { value: "europe-west3", label: "Frankfurt — europe-west3" },
      { value: "asia-south1", label: "Mumbai — asia-south1" },
      { value: "asia-south2", label: "Delhi — asia-south2" },
      { value: "asia-southeast1", label: "Singapore — asia-southeast1" },
      { value: "asia-east1", label: "Taiwan — asia-east1" },
      { value: "asia-northeast1", label: "Tokyo — asia-northeast1" },
      { value: "australia-southeast1", label: "Sydney — australia-southeast1" },
      { value: "me-central1", label: "Doha — me-central1" },
      { value: "southamerica-east1", label: "São Paulo — southamerica-east1" },
      { value: "other", label: "Other Google Cloud Region" },
    ],
    availabilityOptions: [
      {
        value: "zonal",
        label: "Zonal availability",
        nodeMultiplier: 1,
        description: "One standalone Cloud SQL instance.",
      },
      {
        value: "regional-ha",
        label: "Regional high availability",
        nodeMultiplier: 2,
        description: "One primary and one standby in separate zones.",
      },
    ],
    computeTiers: [
      { value: "enterprise", label: "Cloud SQL Enterprise" },
      { value: "enterprise-plus", label: "Cloud SQL Enterprise Plus" },
    ],
    storageTypes: [
      { value: "ssd", label: "SSD storage" },
      { value: "hdd", label: "HDD storage" },
      { value: "other", label: "Other Cloud SQL storage option" },
    ],
    pricingModes: [
      { value: "split", label: "Separate vCPU and memory hourly rates" },
      { value: "combined", label: "Combined instance hourly rate" },
    ],
    defaults: {
      regionId: "asia-south1",
      availabilityId: "zonal",
      computeTierId: "enterprise",
      storageTypeId: "ssd",
      pricingModeId: "split",
    },
  },
];

export function getCloudPostgresProvider(providerId: string) {
  return (
    cloudPostgresProviders.find((provider) => provider.id === providerId) ??
    cloudPostgresProviders[0]
  );
}

export function getCloudPostgresOptionLabel(
  options: CloudPostgresOption[],
  value: string,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function getAvailabilityOption(
  provider: CloudPostgresProvider,
  value: string,
) {
  return (
    provider.availabilityOptions.find((option) => option.value === value) ??
    provider.availabilityOptions[0]
  );
}
