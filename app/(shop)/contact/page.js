import ContactView from "./ContactView";
import { getKey } from "@/lib/content";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Siyana Daily Modesty for help with sizing, fabrics, orders and delivery. Message us on Instagram @siyana_dailymodesty.",
};

export default async function ContactPage() {
  const settings = await getKey("settings");
  return <ContactView email={settings.supportEmail} phone={settings.supportPhone} />;
}
