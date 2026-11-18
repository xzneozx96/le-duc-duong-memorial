import { labGuard } from "@/components/lab/lab-guard";
import { DirectionA } from "../_lab/direction-a";

export default function Page() {
  labGuard();
  return <DirectionA />;
}
