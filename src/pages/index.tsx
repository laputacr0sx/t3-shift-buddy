import { type NextPage } from "next";

import { api } from "~/utils/api";
import PrefixButton from "./component/PrefixButton";

const Home: NextPage = () => {
  const testPrefix = api.getShifts.getPrefix.useQuery();
  const prefixes = testPrefix.data
    ? testPrefix.data.map((shifts) => shifts.dutyNumber.slice(0, 3))
    : [];

  const tryFindShift = api.getShifts.findShift.useQuery({ duty: "D15611" });

  return (
    <div>
      <div>
        <h1>Hello World</h1>
      </div>
      <p>{JSON.stringify(prefixes)}</p>
      <p>
        {tryFindShift.data
          ? JSON.stringify(tryFindShift.data)
          : "Loading your query..."}
      </p>

      {prefixes.map((prefix) => {
        return <PrefixButton name={prefix} key={prefix} />;
      })}
    </div>
  );
};

export default Home;
