"use client"

import { FormType } from "@/app/lib/types";
import { createContext, useContext, useState } from "react";


export const FormContext = createContext<{ 
    form: FormType | null;
    setForm: React.Dispatch<React.SetStateAction<FormType | null>>;
    refreshCounter: number;
    refreshForms: () => void;
} | null>(null);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
    const [form, setForm] = useState<FormType | null>(null);
    const [refreshCounter, setRefreshCounter] = useState(0);

    const refreshForms = () => setRefreshCounter(c => c + 1);

    return (
        <FormContext.Provider value={{ form, setForm, refreshCounter, refreshForms }}>
            {children}
        </FormContext.Provider>
    )
}

export const useForm = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error("useForm must be used within a FormProvider");
    }
    return context;
}
