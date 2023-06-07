import { type NextPage } from "next";

import { api } from "~/utils/api";
import SearchBox from "./component/SearchBox";

const Home: NextPage = () => {
  const testPrefix = api.getShifts.getPrefix.useQuery();
  const prefixes = testPrefix.data
    ? testPrefix.data.map((shifts) => shifts.dutyNumber.slice(0, 3))
    : [];

  const tryFindShift = api.getShifts.findShift.useQuery({ duty: "D15611" });

  return (
    <div className="bg-slate-800">
      <div>
        <h1>Hello World</h1>
      </div>
      <p>{JSON.stringify(prefixes)}</p>
      <p className={"text-blue-300"}>
        {tryFindShift.data
          ? JSON.stringify(tryFindShift.data[0])
          : "Loading your query..."}
      </p>
      <SearchBox />
    </div>
  );
};

export default Home;
