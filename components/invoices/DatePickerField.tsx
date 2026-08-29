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
                        className="w-full flex flex-0.75 flex-row-reverse justify-between text-left font-bold text-xs bg-white text-foreground dark:bg-card dark:text-card-foreground rounded-sm border h-10 border-[#dfe3fa] px-4 py-3 transition placeholder:text-muted-foreground focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/10"
                        onBlur={() => setFieldTouched(name, true)}
                    >
                        <CalendarIcon className="flex-0.25 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "dd MMM yyyy") : "Pick a date"}
                    </Button>
                }
            />
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={selectedDate}
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
