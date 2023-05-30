import { NextPage } from "next";
import RosterTable from "~/pages/component/RosterTable";

import { allRoster } from "~/data/allRoster";

const Home: NextPage = () => {
  return <div>
    <RosterTable data={allRoster} />
  </div>;
};

export default Home;
