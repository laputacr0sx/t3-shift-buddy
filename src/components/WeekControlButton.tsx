import { Button } from './ui/button';

type WeekControlButtonProps = {
    setWeekDifference: React.Dispatch<React.SetStateAction<number>>;
};

export const WeekControlButton = ({
    setWeekDifference
}: WeekControlButtonProps) => {
    return (
        <div className="flex items-center justify-center gap-4 align-middle">
            <Button
                variant={'outline'}
                size={'sm'}
                onClick={() => {
                    setWeekDifference((prev) => prev - 1);
                }}
            >
                上週
            </Button>
            <Button
                className=""
                variant={'secondary'}
                size={'sm'}
                onClick={() => {
                    setWeekDifference(0);
                }}
            >
                本週
            </Button>
            <Button
                variant={'outline'}
                size={'sm'}
                onClick={() => {
                    setWeekDifference((prev) => prev + 1);
                }}
            >
                下週
            </Button>
        </div>
    );
};
