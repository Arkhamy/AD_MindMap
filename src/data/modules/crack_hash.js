export const CRACK_HASH_DATA = [
  {
    name: 'LM & NTLM (SAM/NTDS)',
    nodes: [
      { 
        label: 'Crack LM (John)', 
        cmd: 'john --format=lm hash.txt --wordlist=<rockyou.txt>', 
        leadsTo: 'Cracked Password',
        description: 'Casse les hashs LM (anciens, max 14 chars, insensible à la casse). Très rapide.'
      },
      { 
        label: 'Crack LM (Hashcat)', 
        cmd: 'hashcat -m 3000 -a 0 hash.txt <rockyou.txt>', 
        leadsTo: 'Cracked Password',
        description: 'Mode Hashcat 3000 pour les hashs LM.'
      },
      { 
        label: 'Crack NT/NTLM (John)', 
        cmd: 'john --format=nt hash.txt --wordlist=<rockyou.txt>', 
        leadsTo: 'Cracked Password',
        description: 'Casse les hashs NT standards (dumpés de la SAM ou du NTDS.dit).'
      },
      { 
        label: 'Crack NT/NTLM (Hashcat)', 
        cmd: 'hashcat -m 1000 -a 0 hash.txt <rockyou.txt>', 
        leadsTo: 'Cracked Password',
        description: 'Mode Hashcat 1000 pour les hashs NTLM classiques.'
      }
    ]
  },
  {
    name: 'NetNTLM (Network Capture)',
    nodes: [
      { 
        label: 'Crack NTLMv1 (John)', 
        cmd: 'john --format=netntlm hash.txt --wordlist=<rockyou.txt>', 
        leadsTo: 'Cracked Password',
        description: 'Casse les hashs NetNTLMv1 capturés sur le réseau (ex: Responder).'
      },
      { 
        label: 'Crack NTLMv1 (Online)', 
        cmd: 'crack.sh', 
        leadsTo: 'Cracked Password',
        description: 'Utilise un service en ligne avec des rainbow tables pour casser NTLMv1 quasi-instantanément.'
      },
      { 
        label: 'Crack NTLMv2 (John)', 
        cmd: 'john --format=netntlmv2 hash.txt --wordlist=<rockyou.txt>', 
        leadsTo: 'Cracked Password',
        description: 'Casse les hashs NetNTLMv2 (plus robustes) capturés via Responder.'
      },
      { 
        label: 'Crack NTLMv2 (Hashcat)', 
        cmd: 'hashcat -m 5600 -a 0 hash.txt <rockyou.txt>', 
        leadsTo: 'Cracked Password',
        description: 'Mode Hashcat 5600 pour NetNTLMv2. Le standard actuel pour le cassage réseau.'
      }
    ]
  },
  {
    name: 'Kerberos Tickets',
    nodes: [
      { 
        label: 'Kerberoast TGS (John)', 
        cmd: 'john --format=krb5tgs hash.txt --wordlist=<rockyou.txt>', 
        leadsTo: 'Cracked Password',
        description: 'Casse les tickets de service (TGS) récupérés via Kerberoasting.'
      },
      { 
        label: 'Kerberoast TGS (Hashcat)', 
        cmd: 'hashcat -m 13100 -a 0 hash.txt <rockyou.txt>', 
        leadsTo: 'Cracked Password',
        description: 'Mode Hashcat 13100 pour les TGS Kerberos 5 (type 23).'
      },
      { 
        label: 'Kerberoast AES128', 
        cmd: 'hashcat -m 19600 -a 0 hash.txt <rockyou.txt>', 
        leadsTo: 'Cracked Password',
        description: 'Mode Hashcat 19600 pour les tickets Kerberos chiffrés en AES128.'
      },
      { 
        label: 'ASREPRoast (Hashcat)', 
        cmd: 'hashcat -m 18200 -a 0 hash.txt <rockyou.txt>', 
        leadsTo: 'Cracked Password',
        description: 'Mode Hashcat 18200 pour les hashs AS-REP (comptes sans pré-authentification).'
      }
    ]
  },
  {
    name: 'Misc Hashes',
    nodes: [
      { 
        label: 'DCC2 / MSCache2', 
        cmd: 'hashcat -m 2100 -a 0 hash.txt <rockyou.txt>', 
        leadsTo: 'Cracked Password',
        description: 'Casse les "Domain Cached Credentials" stockés localement sur les machines (très lent).'
      },
      { 
        label: 'TimeRoast (NTP)', 
        cmd: 'hashcat -m 31300 -a 3 hash.txt', 
        leadsTo: 'Cracked Password',
        description: 'Casse les hashs issus de l\'attaque TimeRoast (SNTP-MS MD5).'
      },
      { 
        label: 'PXE / SCCM Hash', 
        cmd: 'hashcat -m 19850 -a 0 hash.txt <rockyou.txt>', 
        leadsTo: 'Cracked Password',
        description: 'Casse les mots de passe de variables de démarrage PXE/SCCM (AES128).'
      }
    ]
  }
];