export type ObjectStorageOption = {
  value: string;
  label: string;
};

export type ObjectStorageProvider = {
  id: string;
  providerName: string;
  serviceName: string;
  shortLabel: string;
  regions: ObjectStorageOption[];
  resilienceOptions: ObjectStorageOption[];
  hotClasses: ObjectStorageOption[];
  coolClasses: ObjectStorageOption[];
  archiveClasses: ObjectStorageOption[];
  defaults: {
    regionId: string;
    resilienceId: string;
    hotClassId: string;
    coolClassId: string;
    archiveClassId: string;
  };
};

const NOT_USED: ObjectStorageOption = {
  value: "not-used",
  label: "Not used",
};

export const objectStorageProviders: ObjectStorageProvider[] = [
  {
    id: "aws",
    providerName: "Amazon Web Services",
    serviceName: "Amazon S3",
    shortLabel: "Amazon S3",
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
    resilienceOptions: [
      {
        value: "regional-multi-az",
        label: "Regional multi-AZ storage",
      },
      {
        value: "one-zone",
        label: "Single Availability Zone storage",
      },
      {
        value: "same-region-replication",
        label: "Same-Region Replication",
      },
      {
        value: "cross-region-replication",
        label: "Cross-Region Replication",
      },
    ],
    hotClasses: [
      { value: "s3-standard", label: "S3 Standard" },
      {
        value: "s3-intelligent-tiering-frequent",
        label: "S3 Intelligent-Tiering — Frequent Access",
      },
      {
        value: "s3-express-one-zone",
        label: "S3 Express One Zone",
      },
    ],
    coolClasses: [
      NOT_USED,
      { value: "s3-standard-ia", label: "S3 Standard-IA" },
      { value: "s3-one-zone-ia", label: "S3 One Zone-IA" },
      {
        value: "s3-intelligent-tiering-infrequent",
        label: "S3 Intelligent-Tiering — Infrequent Access",
      },
    ],
    archiveClasses: [
      NOT_USED,
      {
        value: "s3-glacier-instant",
        label: "S3 Glacier Instant Retrieval",
      },
      {
        value: "s3-glacier-flexible",
        label: "S3 Glacier Flexible Retrieval",
      },
      {
        value: "s3-glacier-deep-archive",
        label: "S3 Glacier Deep Archive",
      },
      {
        value: "s3-intelligent-tiering-archive",
        label: "S3 Intelligent-Tiering — Archive Access",
      },
      {
        value: "s3-intelligent-tiering-deep-archive",
        label: "S3 Intelligent-Tiering — Deep Archive Access",
      },
    ],
    defaults: {
      regionId: "ap-south-1",
      resilienceId: "regional-multi-az",
      hotClassId: "s3-standard",
      coolClassId: "s3-standard-ia",
      archiveClassId: "s3-glacier-flexible",
    },
  },
  {
    id: "azure",
    providerName: "Microsoft Azure",
    serviceName: "Azure Blob Storage",
    shortLabel: "Azure Blob Storage",
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
    resilienceOptions: [
      { value: "lrs", label: "Locally redundant storage (LRS)" },
      { value: "zrs", label: "Zone-redundant storage (ZRS)" },
      { value: "grs", label: "Geo-redundant storage (GRS)" },
      {
        value: "ra-grs",
        label: "Read-access geo-redundant storage (RA-GRS)",
      },
      {
        value: "gzrs",
        label: "Geo-zone-redundant storage (GZRS)",
      },
      {
        value: "ra-gzrs",
        label: "Read-access geo-zone-redundant storage (RA-GZRS)",
      },
    ],
    hotClasses: [
      { value: "hot", label: "Hot tier" },
    ],
    coolClasses: [
      NOT_USED,
      { value: "cool", label: "Cool tier" },
      { value: "cold", label: "Cold tier" },
    ],
    archiveClasses: [
      NOT_USED,
      { value: "archive", label: "Archive tier" },
    ],
    defaults: {
      regionId: "central-india",
      resilienceId: "lrs",
      hotClassId: "hot",
      coolClassId: "cool",
      archiveClassId: "archive",
    },
  },
  {
    id: "gcp",
    providerName: "Google Cloud",
    serviceName: "Cloud Storage",
    shortLabel: "Google Cloud Storage",
    regions: [
      { value: "us", label: "US multi-region" },
      { value: "eu", label: "EU multi-region" },
      { value: "asia", label: "ASIA multi-region" },
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
      { value: "other", label: "Other Google Cloud location" },
    ],
    resilienceOptions: [
      { value: "region", label: "Region" },
      { value: "dual-region", label: "Dual-region" },
      { value: "multi-region", label: "Multi-region" },
    ],
    hotClasses: [
      { value: "standard", label: "Standard storage" },
    ],
    coolClasses: [
      NOT_USED,
      { value: "nearline", label: "Nearline storage" },
      { value: "coldline", label: "Coldline storage" },
    ],
    archiveClasses: [
      NOT_USED,
      { value: "archive", label: "Archive storage" },
    ],
    defaults: {
      regionId: "asia-south1",
      resilienceId: "region",
      hotClassId: "standard",
      coolClassId: "nearline",
      archiveClassId: "archive",
    },
  },
];

export function getObjectStorageProvider(providerId: string) {
  return (
    objectStorageProviders.find((provider) => provider.id === providerId) ??
    objectStorageProviders[0]
  );
}

export function getObjectStorageOptionLabel(
  options: ObjectStorageOption[],
  value: string,
) {
  return options.find((option) => option.value === value)?.label ?? value;
}
