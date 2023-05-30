import {NextPage} from "next";
import {TableSort} from "~/pages/component/RosterTable";

import {allRoster} from '~/data/allRoster'

const Home: NextPage = () => {
    return <div>
        <TableSort data={allRoster}/>
    </div>
}

export default Home;
