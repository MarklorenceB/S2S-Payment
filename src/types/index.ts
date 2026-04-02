export interface Profile {
  id: string;
  account_number: string;
  full_name: string;
  contact_number: string;
  email: string | null;
  role: "user" | "admin";
  session_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface TopupRequest {
  id: string;
  user_id: string;
  account_number: string;
  contact_number: string;
  gcash_reference: string | null;
  screenshot_url: string;
  amount: number | null;
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface IssueReport {
  id: string;
  user_id: string;
  description: string;
  modem_status: "online" | "offline";
  status: "open" | "in_progress" | "resolved";
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}
