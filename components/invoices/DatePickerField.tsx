"use client";

import { useField, useFormikContext } from "formik";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export default function DatePickerField({
    name,
    onChange,
}: {
    name: string;
    onChange?: (date: Date | undefined) => void;
}) {
    const [field] = useField(name);
    const { setFieldValue, setFieldTouched } = useFormikContext();

    const selectedDate = field.value ? new Date(field.value) : undefined;

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full flex flex-0.75 flex-row-reverse justify-between text-left font-bold text-xs bg-white dark:bg-[#252945] dark:text-[#7c5dfa] rounded-sm border h-10 border-[#dfe3fa] dark:border-[#252945] px-4 py-3 transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]"
                        onBlur={() => setFieldTouched(name, true)}
                    >
                        <CalendarIcon className="flex-0.25 h-4 w-4 text-[#888eb0]" />
                        {selectedDate ? format(selectedDate, "dd MMM yyyy") : "Pick a date"}
                    </Button>
                }
            />
            <PopoverContent className="mt-6 h-[271px] w-[216px] p-0">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    className="h-full w-full p-3 text-xs font-bold [&_button]:text-xs [&_button]:font-bold"
                    onSelect={(date) => {
                        if (date) {
                            setFieldValue(name, format(date, "yyyy-MM-dd"));
                        }
                        setFieldTouched(name, true);
                        onChange?.(date);
                    }}
                    autoFocus
                />
            </PopoverContent>
        </Popover>
    );
}
