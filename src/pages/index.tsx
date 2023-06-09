import { type NextPage } from "next";

import { api } from "~/utils/api";
import PrefixButton from "./component/PrefixButton";
import ShiftCard from "./component/ShiftCard";

const Home: NextPage = () => {
  const { data: prefixData } = api.getShifts.getPrefix.useQuery();
  const prefixes = prefixData
    ? prefixData.map((shifts) => shifts.dutyNumber.slice(0, 3))
    : [];

  const { data: shiftData } = api.getShifts.findShift.useQuery({
    duty: "D15611",
  });

  return (
    <div className="flex flex-col ">
      <div>
        <h1>Hello World</h1>
      </div>

      <div className="m-4 flex h-auto w-auto flex-row justify-center px-5 align-middle">
        {prefixes?.map((prefix) => {
          return <PrefixButton name={prefix} key={prefix} />;
        })}
      </div>
      <div className="m-4 flex h-auto w-auto flex-row justify-center px-5 align-middle">
        {shiftData?.map((shiftDetail) => {
          return <ShiftCard key={shiftDetail.dutyNumber} />;
        })}
      </div>
    </div>
  );
};

export default Home;
