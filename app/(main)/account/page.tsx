import { redirect } from "next/navigation";

export default async function AccountPage() {
  redirect("/account/personal-info");
}
