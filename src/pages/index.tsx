import { type NextPage } from "next";

import { api } from "~/utils/api";
import PrefixButton from "./component/PrefixButton";

const Home: NextPage = () => {
  const {
    data: prefixData,
    isLoading,
    error,
  } = api.getShifts.getPrefix.useQuery();
  const prefixes = prefixData
    ? prefixData.map((shifts) => shifts.dutyNumber.slice(0, 3))
    : [];

  const tryFindShift = api.getShifts.findShift.useQuery({ duty: "D15611" });

  return (
    <div className="flex flex-col ">
      <div>
        <h1>Hello World</h1>
      </div>

      <p>
        {tryFindShift.data
          ? JSON.stringify(tryFindShift.data)
          : "Loading your query..."}
      </p>

      <div className="m-4 flex h-auto w-auto flex-row justify-center px-5 align-middle">
        {prefixes.map((prefix) => {
          return <PrefixButton name={prefix} key={prefix} />;
        })}
      </div>
    </div>
  );
};

export default Home;
