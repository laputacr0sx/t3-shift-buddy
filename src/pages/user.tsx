import React from 'react';
import { getAuth, clerkClient } from '@clerk/nextjs/server';

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
import { type CustomUserPrivateMetadata } from '~/utils/customTypes';
import type { GetServerSideProps, InferGetStaticPropsType } from 'next';

function UserMetadataForm({
    userMetadata
}: {
    userMetadata?: CustomUserPrivateMetadata;
}) {
    const { mutate } = api.userController.setUserMetadata.useMutation({
        onSuccess: () => {
            toast.success('保存成功', { position: 'bottom-center' });
        },
        onError: (e) => {
            console.error(e);
            toast.error('保存失敗', { position: 'bottom-center' });
        }
    });

    const userPrivateMetadataForm = useForm<CustomUserPrivateMetadata>({
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

    function metadataHandler(values: CustomUserPrivateMetadata) {
        const currentDate = new Date();
        return mutate({
            ...values,
            updatedAt: currentDate.toISOString(),
            weekNumber: +moment(currentDate).format('WW')
        });
    }

    return (
        <>
            <Form {...userPrivateMetadataForm}>
                <form
                    onSubmit={userPrivateMetadataForm.handleSubmit(
                        metadataHandler
                    )}
                    className="flex flex-col space-y-8 px-8"
                >
                    <FormField
                        control={userPrivateMetadataForm.control}
                        name="staffId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>職員號碼</FormLabel>
                                <FormControl>
                                    <Input {...field} size={6} />
                                </FormControl>
                                <FormDescription>
                                    職員號碼一經輸入，不可更改。
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-8 ">
                            <FormField
                                control={userPrivateMetadataForm.control}
                                name="row"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>行序編號</FormLabel>
                                        <FormControl>
                                            <Input {...field} size={8} />
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
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled
                                                size={6}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormDescription>
                            {moment(userMetadata?.updatedAt).format(
                                '更新於YYYY年WW週M月DD日HH時mm分ss秒'
                            )}
                        </FormDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button
                            className="bg-emerald-800"
                            type="submit"
                            variant={'outline'}
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
    const userData = await clerkClient.users
        .getUser(userId)
        .then((user) => user.privateMetadata as CustomUserPrivateMetadata);

    const parseResult = userPrivateMetadataSchema.safeParse(userData);

    if (!parseResult.success) {
        return {
            props: {
                userData: {
                    row: '',
                    staffId: '',
                    weekNumber: 0,
                    updatedAt: new Date().toISOString()
                } as CustomUserPrivateMetadata
            }
        };
    }

    return {
        props: { userData }
    };
}) satisfies GetServerSideProps<{ userData: CustomUserPrivateMetadata }>;

export default User;
