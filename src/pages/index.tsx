import { type NextPage } from "next";
import ShiftCodeInput from "~/pages/component/ShiftCodeInput";

const Home: NextPage = () => (
  <div className={" px-4 py-8"}>
    <h1 className="justify-center pb-5 text-center font-mono text-6xl font-bold">
      使用方法
    </h1>
    <pre>用法：url */[更號]</pre>
    <pre>*/159</pre>會得到所有159更資料
    <pre>*/D15159</pre>只會得到D15159更資料

    <ShiftCodeInput/>
  </div>
);

export default Home;
