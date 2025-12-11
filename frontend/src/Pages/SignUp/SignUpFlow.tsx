import { useQueryState } from "nuqs";
import { Signup } from "./SignUp";
import ClinicInformation from "./ClinicInformation";
import TeamContacts from "./TeamContacts";

const SignUpFlow = () => {
  const [step] = useQueryState("step", {
    defaultValue: "1",
    parse: (value) => value || "1",
    serialize: (value) => value || "1",
  });

  const stepNumber = parseInt(step, 10) || 1;

  // Single source of truth for routing
  switch (stepNumber) {
    case 1:
      return <Signup key={`step-${stepNumber}`} />;
    case 2:
      return <ClinicInformation key={`step-${stepNumber}`} />;
    case 3:
      return <TeamContacts key={`step-${stepNumber}`} />;
    default:
      return <Signup key={`step-1`} />;
  }
};

export default SignUpFlow;

