import { supabase } from "../../services/supabase";

import { AnalysisDashboard } from "./analysis.types";

export async function getAnalysisDashboard(
    userId: string,
    period: "week" | "month"
): Promise<AnalysisDashboard> {

    const { data, error } = await supabase.rpc(
        "get_analysis_dashboard",
        {
            p_user_id: userId,
            p_period: period,
        }
    );

    if (error) {
        throw error;
    }

    return data as AnalysisDashboard;
}