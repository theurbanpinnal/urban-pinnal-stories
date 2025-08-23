declare module '@vercel/node' {
  import { IncomingMessage, ServerResponse } from 'http';

  export interface VercelRequest extends IncomingMessage {
    body: any;
    query: Record<string, string | string[]>;
    cookies: Record<string, string>;
  }

  export interface VercelResponse extends ServerResponse {
    json: (body: unknown) => void;
    status: (code: number) => VercelResponse;
  }
}
