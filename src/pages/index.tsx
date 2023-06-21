import { type NextPage } from "next";
import { Separator } from "~/components/ui/separator";
import ShiftCodeForm from "~/components/shiftCodeForm";

const Home: NextPage = () => (
  <div className={"h-screen w-screen px-14 py-20"}>
    <h1 className="justify-center py-5 text-center font-mono text-4xl font-bold">
      使用方法
    </h1>
    <pre>用法：url */[更號]</pre>
    <pre>*/159</pre>會得到所有159更資料
    <pre>*/D15159</pre>只會得到D15159更資料
    <Separator className={"my-4"} />
    <ShiftCodeForm />
  </div>
);

export default Home;
