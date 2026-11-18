import { labGuard } from "@/components/lab/lab-guard";
import { DirectionB } from "../_lab/direction-b";

export default function Page() {
  labGuard();
  return <DirectionB />;
}
