import { getAuth, clerkClient } from '@clerk/nextjs/server';
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType
} from 'next';

// eslint-disable-next-line @typescript-eslint/require-await
export async function getServerSideProps(
    context: GetServerSidePropsContext<{ username: string; uName: string }>
) {
    const auth = getAuth(context.req);
    const userId = auth.userId;
    const user = await clerkClient.users.getUser(userId || '');

    const uName = user.username;

    const username = context.params?.username as string;
    return {
        props: {
            username,
            uName
        }
    };
}

type UserProps = InferGetServerSidePropsType<typeof getServerSideProps>;

function User(props: UserProps) {
    const { username, uName } = props;
    return (
        <div>
            Hello {username} {uName}, this is your home page dashboard.
        </div>
    );
}

export default User;
