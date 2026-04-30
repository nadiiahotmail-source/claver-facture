# Centralized Prompts for Claver Facture Agents

OCR_EXTRACTION_PROMPT = """
Tu es un expert en analyse de documents d'assurance. 
Analyse cette facture ou ce rappel de prime.
Extrais les informations suivantes :
- client_name: Nom complet du client.
- insurer: Nom de la compagnie d'assurance (ex: AXA, Allianz).
- amount: Montant total à payer (nombre pur).
- due_date: Date d'échéance (Format YYYY-MM-DD).
- policy_number: Numéro de contrat/police.
- phone_number: Numéro de téléphone du client si présent.
- iban: IBAN pour le paiement si présent.
- siret_bce: Numéro SIRET (France) ou BCE (Belgique) de l'assureur ou du courtier.

Si une information est absente, mets "null".
Format JSON uniquement.
"""

OCR_VERIFICATION_PROMPT = """
Voici les données que tu as extraites : {json_data}
Regarde à nouveau le document et vérifie particulièrement :
1. Le montant (n'oublie pas les centimes).
2. La date d'échéance (ne confonds pas avec la date d'émission).
3. Le numéro de police (assure-toi qu'il est complet).

Si tu trouves des erreurs, corrige-les et renvoie le JSON final corrigé.
Si tout est parfait, renvoie exactement le même JSON.
Format JSON uniquement.
"""

COMM_DRAFT_PROMPT = """
Rédige un message de rappel d'assurance professionnel et bienveillant pour :
Client: {client_name}
Assureur: {insurer}
Montant: {amount}
Échéance: {due_date}

Historique/Contexte :
{context}

Structure du message :
1. Salutations personnalisées.
2. Rappel de la prime due et de l'échéance.
3. Instructions de paiement claires (IBAN: {iban}).
4. Appel à l'action.

Format de sortie :
Subject: [Sujet de l'e-mail]
Body: [Corps du message]
"""
