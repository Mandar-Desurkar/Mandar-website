import { kissanScreens } from "./KissanScreens";
import { cropGuideScreens } from "./CropGuideScreens";
import { farmMonitoringScreens } from "./FarmMonitoringScreens";
import { homeWeatherScreens } from "./HomeWeatherScreens";
import { cropDoctorScreens } from "./CropDoctorScreens";
import { subscriptionScreens } from "./SubscriptionScreens";

// Crop Doctor (prod branch design) + Home, Weather, Crop Guide and Farm Monitoring (dev branch design)
export const kissanScreenMap = {
  ...homeWeatherScreens,
  ...kissanScreens,
  ...cropDoctorScreens,
  ...cropGuideScreens,
  ...farmMonitoringScreens,
  ...subscriptionScreens,
};
