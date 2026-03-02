// Client-side safe Supabase client that uses our server-side proxy

interface ProxyResponse<T> {
  data?: T;
  error?: {
    message: string;
    details?: string;
    code?: string;
  };
}

class SupabaseProxyClient {
  private baseUrl: string;

  constructor() {
    // Use relative URL for API routes
    this.baseUrl = '/api/supabase-proxy';
  }

  // Generic query method
  private async query<T>(path: string, method: string, payload?: any): Promise<ProxyResponse<T>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path,
          method,
          payload,
        }),
      });

      if (!response.ok) {
        console.error(`Proxy request failed: ${response.status} ${response.statusText}`);
        return {
          error: {
            message: `Request failed with status ${response.status}`,
            details: response.statusText,
          },
        };
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error making proxy request:', error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  // Supabase-like interface for querying tables
  from(tableName: string) {
    return {
      select: (columns: string = '*') => {
        return {
          eq: async (column: string, value: any) => {
            const path = `/rest/v1/${tableName}?select=${columns}&${column}=eq.${value}`;
            return this.query(path, 'GET');
          },
          order: (column: string, { ascending = true } = {}) => {
            return {
              eq: async (filterColumn: string, value: any) => {
                const path = `/rest/v1/${tableName}?select=${columns}&${filterColumn}=eq.${value}&order=${column}.${ascending ? 'asc' : 'desc'}`;
                return this.query(path, 'GET');
              },
            };
          },
        };
      },
      insert: async (data: any) => {
        const path = `/rest/v1/${tableName}`;
        return this.query(path, 'POST', data);
      },
      update: (data: any) => {
        return {
          eq: async (column: string, value: any) => {
            const path = `/rest/v1/${tableName}?${column}=eq.${value}`;
            return this.query(path, 'PATCH', data);
          },
        };
      },
    };
  }

  // Check connection
  async checkConnection() {
    try {
      const response = await fetch(`${this.baseUrl}?test=1`);
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

// Create singleton instance
export const supabaseProxy = new SupabaseProxyClient(); 