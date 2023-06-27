import { type NextPage } from "next";
import { Separator } from "~/components/ui/separator";
import ShiftDoubleForm from "~/components/ShiftDoubleForm";

const Home: NextPage = () => (
  <div className={"h-screen w-screen px-14 py-12"}>
    <h1 className="justify-center py-2 text-center font-mono text-4xl font-semibold">
      查更易
    </h1>
    <p></p>
    <Separator className={"my-4"} />
    <ShiftDoubleForm />
  </div>
);

export default Home;
