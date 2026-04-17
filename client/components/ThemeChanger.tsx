"use client"

import React from 'react'
import { Button } from './ui/button'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

function ThemeChanger({className} : {className?: string}) {
    const {resolvedTheme, setTheme} = useTheme();
  return (
    <Button className={cn(className, "relative")} variant={"outline"}  id="ThemeChangeButton"
    onClick={()=> 
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }>
        {resolvedTheme === "light" ? <Moon /> : <Sun /> }
    </Button>
  )
}

export default ThemeChanger