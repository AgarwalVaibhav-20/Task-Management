
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aosbnurzzoydxkpyygxu.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvc2JudXJ6em95ZHhrcHl5Z3h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2Mjk1ODIsImV4cCI6MjA2OTIwNTU4Mn0.1O5ie3nqTLrEb18lyLwFAF0ZHRyaNrO9bd1W47f6rVA"
export const supabase = createClient(supabaseUrl!, supabaseKey!)
