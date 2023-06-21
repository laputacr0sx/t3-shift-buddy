import { type NextPage } from "next";
import { Separator } from "~/components/ui/separator";
import ShiftCodeForm from "~/components/shiftCodeForm";

const Home: NextPage = () => (
  <div className={" h-screen w-screen overflow-hidden px-14 py-20"}>
    <h1 className="justify-center py-5 text-center font-mono text-4xl font-semibold">
      查詢更份
    </h1>
    <p
      className={"item-center justify-center text-center text-muted-foreground"}
    ></p>
    <Separator className={"my-4"} />
    <ShiftCodeForm />
  </div>
);

export default Home;
