import { createPageRouteHandlers } from "@/lib/page-route-factory";

const { GET, PUT } = createPageRouteHandlers("gallery", "Photo Gallery");
export { GET, PUT };

