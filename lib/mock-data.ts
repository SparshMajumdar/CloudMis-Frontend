export interface Misconfiguration {
  id: string;
  resourceId: string;
  resourceType: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Remediated' | 'Ignored';
  detectedAt: string;
  remediatedAt?: string;
  region: string;
  complianceFrameworks: string[];
}

export interface Playbook {
  id: string;
  name: string;
  description: string;
  category: string;
  severityTrigger: string;
  automated: boolean;
  actions: Array<{
    step: number;
    action: string;
    command: string;
  }>;
  isActive: boolean;
}

export interface PlaybookExecution {
  id: string;
  playbookId: string;
  playbookName: string;
  misconfigurationId: string;
  status: 'Pending' | 'Running' | 'Success' | 'Failed';
  startedAt: string;
  completedAt?: string;
  results: Record<string, unknown>;
}

export const mockMisconfigurations: Misconfiguration[] = [
  {
    id: '1',
    resourceId: 's3://customer-data-bucket',
    resourceType: 'S3 Bucket',
    severity: 'Critical',
    title: 'Public S3 Bucket Detected',
    description: 'S3 bucket "customer-data-bucket" has public read access enabled, exposing sensitive data.',
    status: 'Open',
    detectedAt: '2025-10-06T14:23:00Z',
    region: 'us-east-1',
    complianceFrameworks: ['CIS', 'NIST', 'HIPAA'],
  },
  {
    id: '2',
    resourceId: 'sg-0123456789abcdef0',
    resourceType: 'Security Group',
    severity: 'Critical',
    title: 'Security Group Open to Internet',
    description: 'Security group allows SSH (port 22) from 0.0.0.0/0, creating a potential entry point for attackers.',
    status: 'In Progress',
    detectedAt: '2025-10-06T10:15:00Z',
    region: 'us-west-2',
    complianceFrameworks: ['CIS', 'PCI-DSS'],
  },
  {
    id: '3',
    resourceId: 'iam-user-admin-123',
    resourceType: 'IAM User',
    severity: 'High',
    title: 'IAM User with Admin Access',
    description: 'IAM user has full administrator access without MFA enabled.',
    status: 'Open',
    detectedAt: '2025-10-05T16:45:00Z',
    region: 'global',
    complianceFrameworks: ['CIS', 'SOC2'],
  },
  {
    id: '4',
    resourceId: 'vol-0987654321fedcba',
    resourceType: 'EBS Volume',
    severity: 'Medium',
    title: 'Unencrypted EBS Volume',
    description: 'EBS volume is not encrypted at rest, failing compliance requirements.',
    status: 'Remediated',
    detectedAt: '2025-10-04T09:30:00Z',
    remediatedAt: '2025-10-05T11:20:00Z',
    region: 'eu-west-1',
    complianceFrameworks: ['GDPR', 'HIPAA'],
  },
  {
    id: '5',
    resourceId: 'rds-prod-db-01',
    resourceType: 'RDS Instance',
    severity: 'High',
    title: 'RDS Instance Not Encrypted',
    description: 'Production RDS instance does not have encryption enabled.',
    status: 'Open',
    detectedAt: '2025-10-06T08:00:00Z',
    region: 'us-east-1',
    complianceFrameworks: ['HIPAA', 'PCI-DSS'],
  },
  {
    id: '6',
    resourceId: 'cloudtrail-disabled',
    resourceType: 'CloudTrail',
    severity: 'Critical',
    title: 'CloudTrail Logging Disabled',
    description: 'CloudTrail is not enabled in us-west-1 region, preventing audit logging.',
    status: 'Open',
    detectedAt: '2025-10-06T07:00:00Z',
    region: 'us-west-1',
    complianceFrameworks: ['CIS', 'SOC2', 'PCI-DSS'],
  },
  {
    id: '7',
    resourceId: 'lambda-func-public',
    resourceType: 'Lambda Function',
    severity: 'Medium',
    title: 'Lambda Function Publicly Accessible',
    description: 'Lambda function has a resource-based policy allowing public invocation.',
    status: 'Open',
    detectedAt: '2025-10-03T12:30:00Z',
    region: 'ap-southeast-1',
    complianceFrameworks: ['CIS'],
  },
  {
    id: '8',
    resourceId: 'ec2-i-0abcd1234efgh5678',
    resourceType: 'EC2 Instance',
    severity: 'Low',
    title: 'EC2 Instance Without Backup',
    description: 'Production EC2 instance does not have automated snapshots configured.',
    status: 'Ignored',
    detectedAt: '2025-10-01T14:00:00Z',
    region: 'us-east-2',
    complianceFrameworks: ['SOC2'],
  },
];

export const mockPlaybooks: Playbook[] = [
  {
    id: '1',
    name: 'Auto-Remediate S3 Public Access',
    description: 'Automatically blocks public access to S3 buckets when detected',
    category: 'S3',
    severityTrigger: 'High',
    automated: true,
    actions: [
      { step: 1, action: 'Block public ACLs', command: 's3:PutPublicAccessBlock' },
      { step: 2, action: 'Remove public bucket policy', command: 's3:DeleteBucketPolicy' },
      { step: 3, action: 'Send notification', command: 'sns:Publish' },
    ],
    isActive: true,
  },
  {
    id: '2',
    name: 'Restrict Open Security Groups',
    description: 'Automatically removes 0.0.0.0/0 rules from security groups',
    category: 'Security Groups',
    severityTrigger: 'Critical',
    automated: true,
    actions: [
      { step: 1, action: 'Identify open rules', command: 'ec2:DescribeSecurityGroups' },
      { step: 2, action: 'Revoke ingress rule', command: 'ec2:RevokeSecurityGroupIngress' },
      { step: 3, action: 'Log remediation', command: 'logs:PutLogEvents' },
    ],
    isActive: true,
  },
  {
    id: '3',
    name: 'Alert on IAM Policy Changes',
    description: 'Sends alert when IAM policies are modified',
    category: 'IAM',
    severityTrigger: 'Medium',
    automated: true,
    actions: [
      { step: 1, action: 'Capture policy change', command: 'cloudtrail:LookupEvents' },
      { step: 2, action: 'Analyze impact', command: 'iam:SimulatePrincipalPolicy' },
      { step: 3, action: 'Send alert', command: 'sns:Publish' },
    ],
    isActive: true,
  },
  {
    id: '4',
    name: 'Enforce Encryption on EBS Volumes',
    description: 'Ensures all EBS volumes are encrypted',
    category: 'EBS',
    severityTrigger: 'High',
    automated: false,
    actions: [
      { step: 1, action: 'Create encrypted snapshot', command: 'ec2:CreateSnapshot' },
      { step: 2, action: 'Copy with encryption', command: 'ec2:CopySnapshot' },
      { step: 3, action: 'Replace volume', command: 'ec2:CreateVolume' },
    ],
    isActive: true,
  },
  {
    id: '5',
    name: 'Enable CloudTrail Logging',
    description: 'Ensures CloudTrail is enabled in all regions',
    category: 'CloudTrail',
    severityTrigger: 'Critical',
    automated: false,
    actions: [
      { step: 1, action: 'Check trail status', command: 'cloudtrail:GetTrailStatus' },
      { step: 2, action: 'Create trail', command: 'cloudtrail:CreateTrail' },
      { step: 3, action: 'Start logging', command: 'cloudtrail:StartLogging' },
    ],
    isActive: true,
  },
  {
    id: '6',
    name: 'Remediate Unencrypted RDS',
    description: 'Identifies and alerts on unencrypted RDS instances',
    category: 'RDS',
    severityTrigger: 'High',
    automated: true,
    actions: [
      { step: 1, action: 'Create encrypted snapshot', command: 'rds:CreateDBSnapshot' },
      { step: 2, action: 'Copy with encryption', command: 'rds:CopyDBSnapshot' },
      { step: 3, action: 'Send remediation guide', command: 'sns:Publish' },
    ],
    isActive: true,
  },
];

export const mockExecutions: PlaybookExecution[] = [
  {
    id: '1',
    playbookId: '1',
    playbookName: 'Auto-Remediate S3 Public Access',
    misconfigurationId: '1',
    status: 'Running',
    startedAt: '2025-10-06T14:30:00Z',
    results: { progress: '66%', currentStep: 'Remove public bucket policy' },
  },
  {
    id: '2',
    playbookId: '2',
    playbookName: 'Restrict Open Security Groups',
    misconfigurationId: '2',
    status: 'Success',
    startedAt: '2025-10-06T10:20:00Z',
    completedAt: '2025-10-06T10:22:00Z',
    results: { message: 'Security group rule successfully revoked', rulesRemoved: 1 },
  },
  {
    id: '3',
    playbookId: '4',
    playbookName: 'Enforce Encryption on EBS Volumes',
    misconfigurationId: '4',
    status: 'Success',
    startedAt: '2025-10-05T11:00:00Z',
    completedAt: '2025-10-05T11:20:00Z',
    results: { message: 'EBS volume encrypted successfully', snapshotId: 'snap-0123abc' },
  },
];
