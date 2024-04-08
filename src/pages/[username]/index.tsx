import {
    type GetServerSidePropsContext,
    type InferGetServerSidePropsType
} from 'next';

// eslint-disable-next-line @typescript-eslint/require-await
export async function getServerSideProps(
    context: GetServerSidePropsContext<{ username: string }>
) {
    const username = context.params?.username as string;
    return {
        props: {
            username
        }
    };
}

type UserProps = InferGetServerSidePropsType<typeof getServerSideProps>;

function User(props: UserProps) {
    const { username } = props;
    return <div>Hello {username}, this is your home page dashboard.</div>;
}

export default User;
