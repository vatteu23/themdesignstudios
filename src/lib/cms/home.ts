import { HomeContent } from "@/types/cms";
import { getRecord, updateRecord } from "./utils";
import { logAuditAction } from "./audit";

const PATH = "home";

export const DEFAULT_HOME_CONTENT: HomeContent = {
  hero_quote: "Simple is hard",
  hero_author: "Martin Charles Scorsese",
  hero_gallery: [
    {
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/bythem-f0fdb.appspot.com/o/images%2F14a76468-760f-4fd3-8211-4973f72db80a.jpg?alt=media&token=f8e6436f-818e-4455-b236-80c244f037f1",
      alt: "Interior space",
      order: 0,
    },
    {
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/bythem-f0fdb.appspot.com/o/images%2Ff294141a-6963-4de7-94e8-f2cd21ed267c.jpg?alt=media&token=2d6b306d-c106-4e1d-b363-5965c9faf640",
      alt: "Interior design",
      order: 1,
    },
    {
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/bythem-f0fdb.appspot.com/o/images%2F2a98a1a0-1799-404b-b474-23c3f73e7024.jpg?alt=media&token=b5b2ccb8-4ded-4e59-a317-2cf0d5daebf8",
      alt: "Architecture",
      order: 2,
    },
  ],
  philosophy_title: "Our Design Philosophy",
  philosophy_body:
    "At theM, we believe that great design emerges from understanding the unique needs of each client and space. Our approach combines aesthetic excellence with practical functionality, creating environments that inspire and endure.",
  services_display: "featured",
  featured_service_ids: [],
};

export async function getHomeContent(): Promise<HomeContent> {
  const content = await getRecord<HomeContent>(PATH);
  return content ? { ...DEFAULT_HOME_CONTENT, ...content } : DEFAULT_HOME_CONTENT;
}

export async function updateHomeContent(
  data: Partial<HomeContent>
): Promise<void> {
  await updateRecord(PATH, data);
  await logAuditAction("update", "home", "content");
}
