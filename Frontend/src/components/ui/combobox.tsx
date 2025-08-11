import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";

import { DialogProps } from "@radix-ui/react-dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[] | string[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Combobox = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
}: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const normalizedOptions = React.useMemo(() => {
    return options.map((option) =>
      typeof option === "string" ? { value: option, label: option } : option
    );
  }, [options]);

  const filteredOptions = React.useMemo(() => {
    if (!inputValue) return normalizedOptions;
    return normalizedOptions.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, normalizedOptions]);

  return (
    <Command className={cn("overflow-visible bg-transparent", className)}>
      <CommandInput
        value={inputValue}
        onValueChange={setInputValue}
        placeholder={placeholder}
        className="w-full"
      />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup className="mt-1 max-h-60 overflow-y-auto">
        {filteredOptions.map((option) => (
          <CommandItem
            key={option.value}
            value={option.value}
            onSelect={() => {
              onChange?.(option.value);
              setOpen(false);
              setInputValue("");
            }}
            className="cursor-pointer"
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                value === option.value ? "opacity-100" : "opacity-0"
              )}
            />
            {option.label}
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
};