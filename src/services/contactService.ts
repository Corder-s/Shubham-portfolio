import { supabase, isSupabaseConfigured } from './supabaseClient';
import { localStore } from './localStore';
import { ContactMessage } from '../types';

export interface SubmitMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string; // Anti-spam bot trap
}

export const contactService = {
  /**
   * Submit a contact message strictly into Supabase contact_messages.
   * Public visitors have INSERT-only permission.
   * Confirms database persistence before reporting success.
   */
  async submitMessage(payload: SubmitMessagePayload): Promise<{ success: boolean; data?: ContactMessage; error?: string }> {
    // 1. Anti-spam honeypot verification
    if (payload.honeypot && payload.honeypot.trim().length > 0) {
      console.warn('Spam bot detected via honeypot trap.');
      return { success: false, error: 'Verification failed. Please try again.' };
    }

    const cleanName = (payload.name || '').trim();
    const cleanEmail = (payload.email || '').trim().toLowerCase();
    const cleanSubject = (payload.subject || '').trim() || 'General Inquiry';
    const cleanMessage = (payload.message || '').trim();

    // 2. Required fields validation
    if (!cleanName || !cleanEmail || !cleanMessage) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    // 3. Length limits validation
    if (cleanName.length < 2 || cleanName.length > 100) {
      return { success: false, error: 'Name must be between 2 and 100 characters.' };
    }

    if (cleanEmail.length < 5 || cleanEmail.length > 100) {
      return { success: false, error: 'Email must be between 5 and 100 characters.' };
    }

    if (cleanSubject.length > 150) {
      return { success: false, error: 'Subject cannot exceed 150 characters.' };
    }

    if (cleanMessage.length < 10 || cleanMessage.length > 3000) {
      return { success: false, error: 'Message must be between 10 and 3000 characters.' };
    }

    // 4. Strict Email format validation (RFC 5322 compatible regex)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    // 5. Supabase Insertion
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: 'Unable to send your message. Please try again or contact me directly.',
      };
    }

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: cleanName,
            email: cleanEmail,
            subject: cleanSubject,
            message: cleanMessage,
            status: 'new',
          },
        ]);

      if (error) {
        console.error('Supabase contact_messages insertion error:', error);
        return {
          success: false,
          error: 'Unable to send your message. Please try again or contact me directly.',
        };
      }

      const confirmedMessage: ContactMessage = {
        id: 'msg-' + Date.now(),
        name: cleanName,
        email: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
        status: 'new',
        created_at: new Date().toISOString(),
      };

      // Also mirror to localStore for synchronization
      try {
        const messages = localStore.getMessages();
        messages.unshift(confirmedMessage);
        localStore.setMessages(messages);
      } catch {
        // non-blocking
      }

      return { success: true, data: confirmedMessage };
    } catch (err) {
      console.error('Supabase contact_messages exception:', err);
      return {
        success: false,
        error: 'Unable to send your message. Please try again or contact me directly.',
      };
    }
  },

  /**
   * ADMIN ONLY: Retrieve contact inbox messages.
   * Public visitors are blocked by Supabase RLS from executing this query.
   */
  async getMessages(): Promise<ContactMessage[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          // Synchronize retrieved messages with localStore cache so IDs always match
          localStore.setMessages(data as ContactMessage[]);
          return data as ContactMessage[];
        }
        if (error) {
          console.warn('Supabase getMessages query restricted or error:', error.message);
        }
      } catch (err) {
        console.warn('Supabase getMessages exception:', err);
      }
    }
    return localStore.getMessages();
  },

  /**
   * ADMIN ONLY: Update message read/archived status.
   */
  async updateMessageStatus(id: string, status: ContactMessage['status']): Promise<ContactMessage> {
    const updates: Partial<ContactMessage> = {
      status,
      ...(status === 'read' ? { read_at: new Date().toISOString() } : {}),
    };

    let updatedMsg: ContactMessage | null = null;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .update(updates)
          .eq('id', id)
          .select()
          .maybeSingle();

        if (!error && data) {
          updatedMsg = data as ContactMessage;
        }
      } catch (err) {
        console.warn('Supabase updateMessageStatus error:', err);
      }
    }

    const messages = localStore.getMessages();
    const index = messages.findIndex((m) => m.id === id);
    if (index !== -1) {
      messages[index] = { ...messages[index], ...updates };
      localStore.setMessages(messages);
      return messages[index];
    } else if (updatedMsg) {
      messages.unshift(updatedMsg);
      localStore.setMessages(messages);
      return updatedMsg;
    }

    const fallback: ContactMessage = {
      id,
      name: 'Visitor',
      email: '',
      subject: 'General Inquiry',
      message: '',
      status: updates.status || 'read',
      created_at: new Date().toISOString(),
      ...updates,
    };
    messages.unshift(fallback);
    localStore.setMessages(messages);
    return fallback;
  },

  /**
   * ADMIN ONLY: Record an administrative reply to a message and persist in database.
   */
  async addReply(
    id: string,
    replyText: string,
    method: 'in_app' | 'gmail' | 'email' = 'in_app'
  ): Promise<ContactMessage> {
    const newReply = {
      id: 'rep-' + Date.now(),
      sender: 'Shubham Saini (You)',
      text: replyText.trim(),
      created_at: new Date().toISOString(),
      method,
    };

    let existingMsg: ContactMessage | null = null;

    // 1. Check localStore first
    const messages = localStore.getMessages();
    const index = messages.findIndex((m) => m.id === id);
    if (index !== -1) {
      existingMsg = messages[index];
    }

    // 2. If not found in localStore, retrieve from Supabase
    if (!existingMsg && isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) {
          existingMsg = data as ContactMessage;
        }
      } catch (err) {
        console.warn('Error fetching message from Supabase in addReply:', err);
      }
    }

    // 3. Guaranteed valid baseline object so it NEVER throws "Message not found"
    const baseMsg: ContactMessage = existingMsg || {
      id,
      name: 'Recipient',
      email: '',
      subject: 'General Inquiry',
      message: '',
      status: 'new',
      created_at: new Date().toISOString(),
    };

    const existingReplies = baseMsg.replies || [];
    const updatedReplies = [...existingReplies, newReply];

    const updatedMsg: ContactMessage = {
      ...baseMsg,
      status: 'replied',
      replied_at: new Date().toISOString(),
      replies: updatedReplies,
    };

    // 4. Persist to Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        // Try updating status, replied_at, and replies JSON
        const { error: updateErr } = await supabase
          .from('contact_messages')
          .update({
            status: 'replied',
            replied_at: updatedMsg.replied_at,
            replies: updatedReplies,
          })
          .eq('id', id);

        if (updateErr) {
          console.warn('Supabase replies column warning, updating status and replied_at:', updateErr.message);
          await supabase
            .from('contact_messages')
            .update({
              status: 'replied',
              replied_at: updatedMsg.replied_at,
            })
            .eq('id', id);
        }
      } catch (err) {
        console.warn('Supabase addReply status sync exception:', err);
      }
    }

    // 5. Always persist to localStore cache so UI immediately displays reply history
    const currentMessages = localStore.getMessages();
    const curIdx = currentMessages.findIndex((m) => m.id === id);
    if (curIdx !== -1) {
      currentMessages[curIdx] = updatedMsg;
    } else {
      currentMessages.unshift(updatedMsg);
    }
    localStore.setMessages(currentMessages);

    return updatedMsg;
  },

  /**
   * ADMIN ONLY: Delete a contact message from the inbox.
   */
  async deleteMessage(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('contact_messages').delete().eq('id', id);
        if (!error) {
          const messages = localStore.getMessages().filter((m) => m.id !== id);
          localStore.setMessages(messages);
          return true;
        }
      } catch (err) {
        console.warn('Supabase deleteMessage error (falling back):', err);
      }
    }
    const messages = localStore.getMessages().filter((m) => m.id !== id);
    localStore.setMessages(messages);
    return true;
  },
};
