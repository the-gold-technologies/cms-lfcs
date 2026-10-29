import { createPageRouteHandlers } from "@/lib/page-route-factory";

const { GET, PUT } = createPageRouteHandlers("news-and-events", "News & Events");
export { GET, PUT };
