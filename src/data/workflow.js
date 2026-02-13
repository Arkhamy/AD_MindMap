import { 
  Network, 
  Zap, 
  Key, 
  Repeat, 
  Cpu, 
  ShieldCheck, 
  ArrowUpCircle, 
  ShieldAlert, 
  Unlock, 
  GitMerge, 
  FileBadge, 
  ServerCog, 
  Crown, 
  Move,
  Trophy,
  Share2,
  Infinity,
  Info
} from 'lucide-react';

import { NO_CREDENTIALS_DATA } from './modules/no_credentials';
import { QUICK_COMPROMISE_DATA } from './modules/quick_compromise';
import { VALID_USER_DATA } from './modules/valid_user';
import { MITM_RELAY_DATA } from './modules/mitm_relay';
import { CRACK_HASH_DATA } from './modules/crack_hash';
import { VALID_CREDENTIALS_DATA } from './modules/valid_credentials';
import { LOW_ACCESS_DATA } from './modules/low_access';
import { KNOWN_VULNS_DATA } from './modules/known_vulns';
import { ACLS_DATA } from './modules/acls';
import { KERBEROS_DELEGATION_DATA } from './modules/kerberos_delegation';
import { ADCS_DATA } from './modules/adcs';
import { SCCM_DATA } from './modules/sccm';
import { ADMIN_ACCESS_DATA } from './modules/admin_access';
import { LATERAL_MOVE_DATA } from './modules/lateral_move';
import { DOMAIN_ADMIN_DATA } from './modules/domain_admin';
import { TRUSTS_DATA } from './modules/trusts';
import { PERSISTENCE_DATA } from './modules/persistence';
import { AUTHORS_DATA } from './modules/authors';

export const WORKFLOW_DATA = [
  {
    id: 'recon',
    title: 'No Credentials',
    icon: Network,
    sections: NO_CREDENTIALS_DATA
  },
  {
    id: 'quick',
    title: 'Quick Compromise',
    icon: Zap,
    sections: QUICK_COMPROMISE_DATA
  },
  {
    id: 'valid_user',
    title: 'Valid User (No Pwd)',
    icon: Key,
    sections: VALID_USER_DATA
  },
  {
    id: 'valid_creds',
    title: 'Valid Creds',
    icon: ShieldCheck,
    sections: VALID_CREDENTIALS_DATA
  },
  {
    id: 'known_vulns',
    title: 'Known Vulns (Auth)',
    icon: ShieldAlert,
    sections: KNOWN_VULNS_DATA
  },
  {
    id: 'acls',
    title: 'ACLs & Abuses',
    icon: Unlock,
    sections: ACLS_DATA
  },
  {
    id: 'kerberos_delegation',
    title: 'Kerberos Delegation',
    icon: GitMerge,
    sections: KERBEROS_DELEGATION_DATA
  },
  {
    id: 'adcs',
    title: 'ADCS (PKI)',
    icon: FileBadge,
    sections: ADCS_DATA
  },
  {
    id: 'sccm',
    title: 'SCCM / MECM',
    icon: ServerCog,
    sections: SCCM_DATA
  },
  {
    id: 'low_access',
    title: 'Privilege Escalation',
    icon: ArrowUpCircle,
    sections: LOW_ACCESS_DATA
  },
  {
    id: 'lateral',
    title: 'Lateral Move',
    icon: Move,
    sections: LATERAL_MOVE_DATA
  },
  {
    id: 'admin_access',
    title: 'Admin Access',
    icon: Crown,
    sections: ADMIN_ACCESS_DATA
  },
  {
    id: 'domain_admin',
    title: 'Domain Admin',
    icon: Trophy,
    sections: DOMAIN_ADMIN_DATA
  },
  {
    id: 'trusts',
    title: 'Trusts Relationships',
    icon: Share2,
    sections: TRUSTS_DATA
  },
  {
    id: 'persistence',
    title: 'Persistence',
    icon: Infinity,
    sections: PERSISTENCE_DATA
  },
  {
    id: 'relay',
    title: 'MITM & Relay',
    icon: Repeat,
    sections: MITM_RELAY_DATA
  },
  {
    id: 'crack',
    title: 'Crack Hash',
    icon: Cpu,
    sections: CRACK_HASH_DATA
  },
  {
    id: 'authors',
    title: 'Authors / Infos',
    icon: Info,
    sections: AUTHORS_DATA
  }
];