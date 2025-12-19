import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This endpoint triggers the n8n workflow for content generation
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Handle error
            }
          },
        },
      }
    );

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, project_id } = body;

    // Validate required fields
    if (!action || !project_id) {
      return NextResponse.json(
        { error: 'Missing required fields: action, project_id' },
        { status: 400 }
      );
    }

    // Verify user owns the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', project_id)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      );
    }

    // Get briefing data if exists
    const { data: briefing } = await supabase
      .from('briefings')
      .select('*')
      .eq('project_id', project_id)
      .single();

    // Create generation record
    const { data: generation, error: genError } = await supabase
      .from('generations')
      .insert({
        project_id,
        agent_name: action,
        status: 'pending',
        input: {
          action,
          project: project,
          briefing: briefing,
          user_id: user.id,
        }
      })
      .select()
      .single();

    if (genError) {
      return NextResponse.json(
        { error: 'Failed to create generation record' },
        { status: 500 }
      );
    }

    // Update project status
    await supabase
      .from('projects')
      .update({ status: 'generating' })
      .eq('id', project_id);

    // Trigger n8n webhook (if configured)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      try {
        await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            project_id,
            generation_id: generation.id,
            project,
            briefing,
            callback_url: `${process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin}/api/webhook/n8n`,
          }),
        });
      } catch (webhookError) {
        console.error('Failed to trigger n8n webhook:', webhookError);
        // Continue anyway, the webhook might not be configured
      }
    }

    return NextResponse.json({
      success: true,
      generation_id: generation.id,
      message: 'Generation started',
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
