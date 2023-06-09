import { type NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col ">
      <div>
        <h1>查更</h1>
        <p>用法：url */[更號]</p>
        <p />
        <pre>*/159</pre>會得到所有159更資料
        <pre>*/D15159</pre>只會得到D15159更資料
      </div>
    </div>
  );
};

export default Home;
