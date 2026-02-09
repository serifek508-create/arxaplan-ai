import { supabase } from './supabase';

// --- Processing History ---
export const addToHistory = async (
  userId: string,
  filename: string,
  sizeBytes: number,
  isHd: boolean,
  processingTimeMs: number
) => {
  const { error } = await supabase.from('arxa_plan_history').insert({
    user_id: userId,
    original_filename: filename,
    original_size_bytes: sizeBytes,
    is_hd: isHd,
    processing_time_ms: processingTimeMs,
    status: 'completed',
  });
  return { error };
};

export const getHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from('arxa_plan_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  return { data, error };
};

// --- Stats ---
export const getStats = async () => {
  const { data, error } = await supabase
    .from('arxa_plan_stats')
    .select('*')
    .eq('id', 1)
    .single();
  return { data, error };
};

export const incrementStat = async (field: 'total_images_processed' | 'total_hd_processed' | 'total_users') => {
  // Fetch current, increment, update
  const { data } = await supabase.from('arxa_plan_stats').select(field).eq('id', 1).single();
  if (data) {
    const current = (data as any)[field] || 0;
    await supabase.from('arxa_plan_stats').update({ [field]: current + 1, updated_at: new Date().toISOString() }).eq('id', 1);
  }
};

// --- Feedback ---
export const submitFeedback = async (
  email: string,
  message: string,
  name?: string,
  rating?: number,
  userId?: string
) => {
  const { error } = await supabase.from('arxa_plan_feedback').insert({
    user_id: userId || null,
    name: name || '',
    email,
    message,
    rating: rating || 5,
  });
  return { error };
};

// --- User Profile ---
export const incrementUserProcessed = async (userId: string) => {
  const { data } = await supabase
    .from('arxa_plan_users')
    .select('images_processed')
    .eq('id', userId)
    .single();
  
  if (data) {
    await supabase
      .from('arxa_plan_users')
      .update({ images_processed: (data.images_processed || 0) + 1, updated_at: new Date().toISOString() })
      .eq('id', userId);
  }
};
