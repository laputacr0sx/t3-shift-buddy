import { type NextPage } from "next";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const allShifts = api.getShifts.getAll.useQuery();

  return (
    <div>
      <div>
        <h1>Hello World</h1>
      </div>
      <p>
        {allShifts.data ? JSON.stringify(allShifts.data) : "Loading tRPC..."}
      </p>
    </div>
  );
};

export default Home;
