import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Creating LemonSqueezy checkout...');
    
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    console.log('User authenticated:', user.email);

    const { planType = 'monthly' } = await req.json();
    
    // LemonSqueezy product variant IDs (you'll need to update these with your actual IDs)
    const variantIds = {
      monthly: '123456', // Replace with your actual monthly variant ID
      yearly: '123457'   // Replace with your actual yearly variant ID
    };

    const checkoutData = {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_options: {
            embed: false,
            media: false,
            logo: true,
          },
          checkout_data: {
            email: user.email,
            name: user.user_metadata?.full_name || '',
          },
          expires_at: null,
          preview: false,
          test_mode: false,
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: Deno.env.get('LEMONSQUEEZY_STORE_ID') || '1',
            },
          },
          variant: {
            data: {
              type: 'variants',
              id: variantIds[planType as keyof typeof variantIds] || variantIds.monthly,
            },
          },
        },
      },
    };

    // Create checkout session with LemonSqueezy
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${Deno.env.get('LEMONSQUEEZY_API_KEY')}`,
      },
      body: JSON.stringify(checkoutData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('LemonSqueezy API error:', response.status, errorData);
      throw new Error(`LemonSqueezy API error: ${response.status}`);
    }

    const checkoutResponse = await response.json();
    const checkoutUrl = checkoutResponse.data.attributes.url;

    console.log('Checkout created successfully:', checkoutUrl);

    return new Response(JSON.stringify({ url: checkoutUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Error creating checkout:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});