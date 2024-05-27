import { Terminal } from 'lucide-react';
import Link from 'next/link';
import PageTitle from '~/components/PageTitle';
import SevenSlotsSearchForm from '~/components/SevenSlotsSearchForm';
import TableLoading from '~/components/TableLoading';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { api } from '~/utils/api';

const LandingPage = () => {
    const {
        data: weekDetails,
        isLoading: weekDetailsLoading,
        error: weekDetailsError
    } = api.timetableController.getSuitableTimetables.useQuery();

    if (weekDetailsLoading) return <TableLoading />;
    if (weekDetailsError) return <>Something Went Wrong</>;

    return (
        <>
            {/* <Alert variant="destructive" className="text-center"> */}
            {/*     <AlertTitle> */}
            {/*         <Terminal className="absolute" /> */}
            {/*         此乃開發中網頁 */}
            {/*     </AlertTitle> */}
            {/*     <AlertDescription>尚未正式上線，請勿使用。</AlertDescription> */}
            {/*     <Link */}
            {/*         href="https://shuddy.one" */}
            {/*         className="text-2xl font-bold text-foreground" */}
            {/*     > */}
            {/*         點擊返回主頁 */}
            {/*     </Link> */}
            {/* </Alert> */}
            <PageTitle>出更易</PageTitle>
            <SevenSlotsSearchForm defaultData={weekDetails} />
        </>
    );
};

export default LandingPage;
