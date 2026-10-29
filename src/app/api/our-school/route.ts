import { createPageRouteHandlers } from "@/lib/page-route-factory";

const { GET, PUT } = createPageRouteHandlers("our-school", "Our Schools");
export { GET, PUT };

