import { labGuard } from "@/components/lab/lab-guard";
import { DirectionC } from "../_lab/direction-c";

export default function Page() {
  labGuard();
  return <DirectionC />;
}
