import { createPageRouteHandlers } from "@/lib/page-route-factory";

const { GET, PUT } = createPageRouteHandlers("experience", "Experience / Campus Life");
export { GET, PUT };
