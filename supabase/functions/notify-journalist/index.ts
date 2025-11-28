import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  caseId: string;
  journalistId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { caseId, journalistId }: NotificationRequest = await req.json();

    console.log(`Processing notification for case ${caseId} to journalist ${journalistId}`);

    // Fetch case details
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('title, category, region, municipality, short_description')
      .eq('id', caseId)
      .single();

    if (caseError) {
      console.error('Error fetching case:', caseError);
      throw caseError;
    }

    // Fetch journalist details
    const { data: journalist, error: journalistError } = await supabase
      .from('journalists')
      .select('full_name, phone_number')
      .eq('id', journalistId)
      .single();

    if (journalistError) {
      console.error('Error fetching journalist:', journalistError);
      throw journalistError;
    }

    // Clean phone number
    const cleanPhone = journalist.phone_number.replace(/\D/g, '');

    // Build WhatsApp message
    const message = `🚨 قضية جديدة - سقط القناع

📋 العنوان: ${caseData.title}
📂 الفئة: ${caseData.category}
📍 الموقع: ${caseData.region}${caseData.municipality ? ' - ' + caseData.municipality : ''}
📝 الوصف: ${caseData.short_description}

🔗 رابط القضية: ${supabaseUrl.replace('supabase.co', 'lovable.app')}/case/${caseId}

يرجى مراجعة القضية والبدء بالتحقيق.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    console.log(`WhatsApp notification prepared for ${journalist.full_name}`);

    return new Response(
      JSON.stringify({
        success: true,
        whatsappLink,
        message: 'تم إرسال الإشعار بنجاح',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in notify-journalist function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
