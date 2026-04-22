import cron from "node-cron";
import checkVehicleServiceStatus from "../../middleware/checkVehicleForService.js";

export const startServiceReminderCron = () => {

  cron.schedule("0 * * * *", async () => {
    console.log(`🚗 Automatically checking vehicles at ${new Date().toLocaleString()}`);
    
    try {
      await checkVehicleServiceStatus();
      console.log(`✅ Auto-check completed`);
    } catch (error) {
      console.error("❌ Auto-check failed:", error);
    }
  });

  console.log("⏰ Auto service reminder started - runs every hour");
};