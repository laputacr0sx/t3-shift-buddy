import { Button } from './ui/button';

type WeekControlButtonProps = {
    setWeekDifference: React.Dispatch<React.SetStateAction<number>>;
};

export const WeekControlButton = ({
    setWeekDifference
}: WeekControlButtonProps) => {
    return (
        <div className="flex items-center justify-between align-middle">
            <Button
                variant={'outline'}
                size={'lg'}
                onClick={() => {
                    setWeekDifference((prev) => prev - 1);
                }}
            >
                上週
            </Button>
            <Button
                className=""
                variant={'secondary'}
                size={'lg'}
                onClick={() => {
                    setWeekDifference(0);
                }}
            >
                本週
            </Button>
            <Button
                variant={'outline'}
                size={'lg'}
                onClick={() => {
                    setWeekDifference((prev) => prev + 1);
                }}
            >
                下週
            </Button>
        </div>
    );
};
