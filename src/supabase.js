import { createClient } from "@supabase/supabase-js";

const supabaseurl = import.meta.env.supabaseurl;
const supabasekey = import.meta.env.supabaseanonkey;

export const supabase = createClient(supabaseurl, supabasekey);