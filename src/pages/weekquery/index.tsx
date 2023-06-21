import { type NextPage } from "next";
import { Separator } from "~/components/ui/separator";

import ShiftRowForm from "~/components/ShiftDoubleForm";

const Home: NextPage = () => (
  <div className={"h-screen w-screen px-14 py-20"}>
    <h1 className="justify-center py-5 text-center font-mono text-4xl font-semibold">
      更份
    </h1>

    <Separator className={"my-4"} />
    <ShiftRowForm />
  </div>
);

export default Home;
