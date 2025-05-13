export interface MessageOptions {
  title?: string;
  /** @deprecated Use message instead */
  text?: string;
  message?: string;
  severity?: 'info' | 'success' | 'warning' | 'error';
  timeout?: number;
  cancellable?: boolean;
}

export interface Message extends Required<Omit<MessageOptions, 'text'>> {
  id: number;
  text: string;
  progress: number;
  cancelled: boolean;
  startTime: number;
  isPaused: boolean;
  pauseTime: number | null;
  interval: number | null;
  isExpanded: boolean;
}

export interface MessageHistoryEntry {
  id: number;
  original: {
    title: string;
    text: string;
    severity: string;
    timestamp: number;
  };
  updates: Array<{
    title: string;
    text: string;
    severity: string;
    timestamp: number;
  }>;
}

export interface ProgressStatusService {
  push(options: MessageOptions): number;
  update(id: number, options: MessageOptions): void;
  cancel(id: number): void;
  cancelAll(): void;
  getMessages(): Message[];
  getMessageHistory(): MessageHistoryEntry[];
  clearHistory(): void;
} 