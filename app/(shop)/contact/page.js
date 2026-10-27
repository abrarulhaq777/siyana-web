import ContactView from "./ContactView";
import { getKey } from "@/lib/content";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Siyana Daily Modesty for help with sizing, fabrics, orders and delivery. Message us on Instagram @siyana_dailymodesty.",
};

export default async function ContactPage() {
  const [settings, faq] = await Promise.all([getKey("settings"), getKey("faq")]);
  return <ContactView email={settings.supportEmail} phone={settings.supportPhone} faq={faq.items} />;
}
