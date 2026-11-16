import { createPageRouteHandlers } from "@/lib/page-route-factory";

const { GET, PUT } = createPageRouteHandlers("school-franchise", "Start a School (Associate)");
export { GET, PUT };
