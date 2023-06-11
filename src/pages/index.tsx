import { type NextPage } from "next";

const Home: NextPage = () => (
  <div className="flex flex-col">
    <div>
      <h1>使用方法</h1>
      <pre>用法：url */[更號]</pre>
      <pre>*/159</pre>會得到所有159更資料
      <pre>*/D15159</pre>只會得到D15159更資料
    </div>
  </div>
);

export default Home;
