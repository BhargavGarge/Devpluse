import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function test() {
    const reportId = '82464514-a877-4012-9428-0bc3320f9a9b'

    // 1. Get the report
    const { data: report, error: reportError } = await supabase
        .from('reports')
        .select('id, user_id, repository_id')
        .eq('id', reportId)
        .single()

    console.log("Report ownership:", report)

    if (report) {
        // 2. Get the repository
        const { data: repo, error: repoError } = await supabase
            .from('repositories')
            .select('id, user_id, name')
            .eq('id', report.repository_id)
            .single()

        console.log("Repository ownership:", repo)

        if (report.user_id !== repo?.user_id) {
            console.log("MISMATCH in ownership! RLS might be filtering out the joined repository, which might fail the report query if the join is considered inner or required by postgrest?")
        } else {
            console.log("Ownership matches:", report.user_id)
        }
    }
}

test()
