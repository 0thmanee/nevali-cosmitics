/**
 * Display types for contracts/RFQ UI (mapped from API rows).
 */

export type RfqDisplay = {
  id: string;
  buyer: string;
  buyerInitials: string;
  buyerColor: string;
  location: string;
  product: string;
  quantity: string;
  deadline: string;
  received: string;
  status: string;
  value: string;
  message: string;
  /** Short line for NEGOTIATING turn-taking (depends on viewer role). */
  negotiationHint: string;
};

export type ContractDisplay = {
  id: string;
  buyer: string;
  buyerInitials: string;
  buyerColor: string;
  location: string;
  product: string;
  quantity: string;
  value: string;
  started: string;
  expires: string;
  status: string;
  progress: number;
  deliveries: string;
};

export type ContractHistoryRowDisplay = {
  id: string;
  buyer: string;
  buyerInitials: string;
  buyerColor: string;
  product: string;
  value: string;
  period: string;
  status: string;
  deliveries: string;
};

export type ContractsCounts = {
  RFQs: number;
  Contracts: number;
  History: number;
};
