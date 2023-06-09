import { type NextPage } from "next";

import { api } from "~/utils/api";

import ShiftCard from "./component/ShiftCard";

const Home: NextPage = () => {
  const { data: shiftData } = api.getShifts.findShift.useQuery({
    duty: "D15611",
  });

  return (
    <div className="flex flex-col ">
      <div>
        <h1>查更</h1>
      </div>

      <div className="m-4 flex h-auto w-auto flex-row justify-center px-5 align-middle">
        {shiftData?.map((shiftDetail) => {
          return <ShiftCard key={shiftDetail.id} shift={shiftDetail} />;
        })}
      </div>
    </div>
  );
};

export default Home;
