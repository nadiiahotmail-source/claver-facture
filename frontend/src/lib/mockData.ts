export interface MockReminder {
  id: string;
  client_name: string;
  insurer: string;
  amount: number;
  due_date: string;
  policy_number?: string;
  phone_number?: string;
  status: 'pending' | 'drafted' | 'validated' | 'sent' | 'resolved';
  phase?: 1 | 2 | 3;
  client_type?: 'B2B' | 'B2C';
  is_unresponsive?: boolean;
  email_subject?: string;
  email_body?: string;
  created_at?: string;
}

export const MOCK_REMINDERS: MockReminder[] = [
  {
    id: "1",
    client_name: "Jean Dupont",
    insurer: "AXA Belgium",
    amount: 450.25,
    due_date: "2026-05-10",
    policy_number: "AX-882910",
    status: "pending",
    phase: 1,
    client_type: "B2C",
    created_at: "2026-04-25T10:00:00Z"
  },
  {
    id: "2",
    client_name: "Marie Lefebvre",
    insurer: "Allianz",
    amount: 1200.00,
    due_date: "2026-04-20",
    policy_number: "AL-992011",
    status: "drafted",
    phase: 2,
    client_type: "B2C",
    email_subject: "Rappel : Votre prime Allianz est arrivée à échéance",
    email_body: "Chère Madame Lefebvre,\n\nSauf erreur de notre part, le paiement de votre prime Allianz de 1200€ pour le contrat AL-992011 n'est pas encore parvenu.\n\nNous restons à votre disposition pour toute question.\n\nCordialement,\nVotre Courtier.",
    created_at: "2026-04-26T11:30:00Z"
  },
  {
    id: "3",
    client_name: "Marc Peters",
    insurer: "Ethias",
    amount: 85.50,
    due_date: "2026-05-15",
    policy_number: "ET-112233",
    status: "validated",
    email_subject: "Rappel urgent : Prime d'assurance Ethias",
    email_body: "Monsieur Peters,\n\nNous vous rappelons que votre prime Ethias de 85.50€ arrive à échéance le 15 mai.\n\nMerci de régulariser au plus vite.\n\nBien à vous.",
    created_at: "2026-04-27T09:15:00Z"
  },
  {
    id: "4",
    client_name: "Sarah Janssens",
    insurer: "AG Insurance",
    amount: 670.00,
    due_date: "2026-04-01",
    policy_number: "AG-445566",
    status: "sent",
    created_at: "2026-04-01T14:20:00Z"
  },
  {
    id: "5",
    client_name: "Robert Martin",
    insurer: "Baloise",
    amount: 320.10,
    due_date: "2026-05-02",
    policy_number: "BA-778899",
    status: "pending",
    created_at: "2026-04-28T08:00:00Z"
  },
  {
    id: "6",
    client_name: "Julie Dubois",
    insurer: "Axa Belgium",
    amount: 2150.00,
    due_date: "2026-04-15",
    policy_number: "AX-112233",
    status: "drafted",
    phase: 3,
    client_type: "B2B",
    is_unresponsive: true,
    email_subject: "Prime d'assurance AXA - Dossier en retard",
    email_body: "Madame Dubois,\n\nVotre prime annuelle de 2150€ est en attente de paiement depuis le 15 avril.\n\nCordialement.",
    created_at: "2026-04-28T09:45:00Z"
  },
  {
    id: "7",
    client_name: "TechnoPlus SA",
    insurer: "Generali",
    amount: 5400.00,
    due_date: "2026-03-15",
    policy_number: "GEN-5544",
    status: "resolved",
    client_type: "B2B",
    created_at: "2026-03-20T10:00:00Z"
  },
  {
    id: "8",
    client_name: "Garage Vroom",
    insurer: "AIG",
    amount: 890.50,
    due_date: "2026-03-20",
    policy_number: "AIG-9988",
    status: "sent",
    created_at: "2026-03-25T11:00:00Z"
  },
  {
    id: "9",
    client_name: "Boulangerie Pain Doré",
    insurer: "DKV",
    amount: 125.00,
    due_date: "2026-04-10",
    policy_number: "DKV-7766",
    status: "sent",
    created_at: "2026-04-12T09:00:00Z"
  },
  {
    id: "10",
    client_name: "Immo Lux",
    insurer: "Arces",
    amount: 340.00,
    due_date: "2026-05-01",
    policy_number: "ARC-1234",
    status: "pending",
    created_at: "2026-04-28T10:00:00Z"
  },
  { id: "11", client_name: "Shop Vite", insurer: "AXA", amount: 150.00, status: "sent", due_date: "2026-03-01" },
  { id: "12", client_name: "Resto Delice", insurer: "Allianz", amount: 450.00, status: "sent", due_date: "2026-03-05" },
  { id: "13", client_name: "Coiffeur Zen", insurer: "Ethias", amount: 80.00, status: "sent", due_date: "2026-03-10" },
  { id: "14", client_name: "Fleuriste Rose", insurer: "Baloise", amount: 120.00, status: "sent", due_date: "2026-03-12" },
  { id: "15", client_name: "Boucherie Jean", insurer: "Generali", amount: 300.00, status: "sent", due_date: "2026-03-15" },
  { id: "16", client_name: "Opticien Vue", insurer: "Axa", amount: 600.00, status: "sent", due_date: "2026-03-18" },
  { id: "17", client_name: "Librairie Page", insurer: "Allianz", amount: 200.00, status: "sent", due_date: "2026-03-20" },
  { id: "18", client_name: "Pharma Santé", insurer: "Ethias", amount: 450.00, status: "sent", due_date: "2026-03-22" },
  { id: "19", client_name: "Garage Auto", insurer: "AG", amount: 1200.00, status: "sent", due_date: "2026-03-25" },
  { id: "20", client_name: "Club Sport", insurer: "Baloise", amount: 500.00, status: "sent", due_date: "2026-03-28" }
];

export const MOCK_LOGS = [
  { time: "12:42:01", msg: "Scan IMAP 'relances@claver.be' terminé. 2 nouveaux dossiers détectés." },
  { time: "12:35:12", msg: "WhatsApp Bridge: Message envoyé avec succès à Jean Dupont." },
  { time: "11:20:45", msg: "OCR Agent: Extraction terminée pour 'Facture_TechnoPlus.pdf'." },
  { time: "10:19:30", msg: "Système: Synchronisation Supabase réussie." }
];
