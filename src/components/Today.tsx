import { type CustomUserPrivateMetadata } from '~/utils/customTypes';

interface TodayProps {
    userData: CustomUserPrivateMetadata;
}

const Today = ({ userData }: TodayProps) => {
    return <div className="h-screen w-screen">{userData.staffId}</div>;
};

export default Today;
