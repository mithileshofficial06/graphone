import { NextAuthOptions } from 'next-auth';
import { NextRequest } from 'next/server';
import GitHubProvider from 'next-auth/providers/github';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Utility function to get client IP address
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

// Utility function to validate API key for write operations
export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  return apiKey === process.env.API_KEY;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'github') {
        // Upsert user in Supabase
        const { error } = await supabase
          .from('users')
          .upsert({
            email: user.email!,
            name: user.name || null,
            avatar_url: user.image || null,
            github_id: account.providerAccountId,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'email'
          });

        if (error) {
          console.error('Error upserting user:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        // Get user ID from Supabase
        const { data } = await supabase
          .from('users')
          .select('id')
          .eq('email', session.user.email!)
          .single();

        if (data) {
          session.user.id = data.id;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
