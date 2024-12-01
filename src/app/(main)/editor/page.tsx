import { Metadata } from "next";
import ResumeEditor from "./ResumeEditor";

export const metadata: Metadata = {
  title: "Design your ...",
};

export default function Page() {
  return <ResumeEditor />;
}
