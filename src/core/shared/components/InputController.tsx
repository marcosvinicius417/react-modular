
import { Controller, type Control } from "react-hook-form";
import React from "react";

interface InputControllerProps {
    name: string;
    control: Control<any>;
    children: React.ReactElement;
}

const InputController: React.FC<InputControllerProps> = ({ name, control, children }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                React.cloneElement(children, { ...field })
            )}
        />
    );
};

export default InputController;