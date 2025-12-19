import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";  // ← ADD THIS LINE

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("x-webhook-secret");
    if (secret !== process.env.GHL_WEBHOOK_SECRET) {
      console.log("Invalid webhook secret");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    console.log("📨 Webhook received:", payload.type);

    const supabaseAdmin = getSupabaseAdmin(); // ← Now this will work!

    if (
      payload.type === "opportunity.stage_change" &&
      (payload.opportunity.stage === "Under Contract" ||
        payload.opportunity.status === "under_contract")
    ) {
      const opp = payload.opportunity;

      const { data: existing } = await supabaseAdmin
        .from("transactions")
        .select("id")
        .eq("ghl_opportunity_id", opp.id)
        .maybeSingle();

      if (!existing) {
        const { data: newTransaction, error } = await supabaseAdmin
          .from("transactions")
          .insert({
            ghl_opportunity_id: opp.id,
            ghl_location_id: payload.location_id,
            ghl_user_id: opp.assigned_to || payload.user_id,
            ghl_contact_id: opp.contact?.id,
            property_address: opp.name,
            deal_value: opp.monetary_value,
            contract_date:
              opp.customField?.contract_date ||
              new Date().toISOString().split("T")[0],
            closing_date: opp.customField?.closing_date,
            status: "under_contract",
          })
          .select()
          .single();

        if (error) {
          console.error("❌ Error creating transaction:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log("✅ Transaction auto-created:", newTransaction.id);
      } else {
        console.log("ℹ️  Transaction already exists");
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}