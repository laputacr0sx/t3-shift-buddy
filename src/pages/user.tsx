import React from 'react';
import { getAuth, buildClerkProps, clerkClient } from '@clerk/nextjs/server';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '~/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage
} from '~/components/ui/form';
import { api } from '~/utils/api';
import { userPrivateMetadataSchema } from '~/utils/zodSchemas';
import { Input } from '~/components/ui/input';
import toast from 'react-hot-toast';
import PageTitle from '~/components/PageTitle';
import moment from 'moment';
import { type UserPrivateMetadata } from '~/utils/customTypes';
import type { GetServerSideProps, InferGetStaticPropsType } from 'next';

function UserMetadataForm({
    userMetadata
}: {
    userMetadata?: UserPrivateMetadata;
}) {
    const { mutate } = api.userController.setUserMetadata.useMutation({
        onSuccess: () =>
            toast.success('保存成功', { position: 'bottom-center' }),
        onError: () => toast.error('保存失敗', { position: 'bottom-center' })
    });

    const userPrivateMetadataForm = useForm<UserPrivateMetadata>({
        resolver: zodResolver(userPrivateMetadataSchema),
        defaultValues: {
            row: '',
            staffId: '',
            weekNumber: 0,
            updatedAt: new Date().toISOString()
        },
        values: userMetadata ?? {
            row: '',
            staffId: '',
            weekNumber: 0,
            updatedAt: new Date().toISOString()
        }
    });

    function metadataHandler(values: UserPrivateMetadata) {
        console.log(values);
        return mutate({ ...values, updatedAt: new Date().toISOString() });
    }

    return (
        <>
            <Form {...userPrivateMetadataForm}>
                <form
                    onSubmit={userPrivateMetadataForm.handleSubmit(
                        metadataHandler
                    )}
                    className="space-y-8"
                >
                    <FormField
                        control={userPrivateMetadataForm.control}
                        name="staffId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>職員號碼</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    職員號碼一經輸入，不可更改。
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={userPrivateMetadataForm.control}
                        name="row"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>行序編號</FormLabel>
                                <FormDescription>
                                    {moment(userMetadata?.updatedAt).format(
                                        '更新於YYYY-MM-DDTHH:mm:ss'
                                    )}
                                </FormDescription>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={userPrivateMetadataForm.control}
                        name="weekNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>週份</FormLabel>
                                <FormDescription></FormDescription>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col gap-2">
                        <Button
                            type="submit"
                            variant={'outline'}
                            // disabled={!!userData}
                        >
                            更改
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}

const User = ({
    userData
}: InferGetStaticPropsType<typeof getServerSideProps>) => (
    <React.Fragment>
        <PageTitle>用戶資料</PageTitle>
        <UserMetadataForm userMetadata={userData} />
    </React.Fragment>
);

export const getServerSideProps = (async (ctx) => {
    let { userId } = getAuth(ctx.req);
    if (!userId) {
        userId = '';
    }
    const metadata = await clerkClient.users
        .getUser(userId)
        .then((user) => user.privateMetadata as UserPrivateMetadata);

    const parseResult = userPrivateMetadataSchema.safeParse(metadata);

    if (!parseResult.success) {
        return {
            props: {
                userData: {
                    row: '',
                    staffId: '',
                    weekNumber: 0,
                    updatedAt: new Date().toISOString()
                } as UserPrivateMetadata
            }
        };
    }

    return {
        props: { userData: metadata }
    };
}) satisfies GetServerSideProps<{ userData: UserPrivateMetadata }>;

export default User;
