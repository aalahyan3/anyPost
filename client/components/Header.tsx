import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { ArrowRight, Code2, Heart } from 'lucide-react'
import Logo from './Logo'

function Header() {
    return (
        <header className='sticky top-4 z-30 w-full border border-border/60   px-4 py-3 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/70 rounded-xl '>
            <div className='mx-auto flex w-full items-center justify-between gap-3'>
                <Link href='/' className='text-lg font-semibold tracking-tight transition-colors sm:text-xl'>
                    <Logo className="mb-2 text-lg" />
                </Link>
                <div className='flex items-center gap-2 sm:gap-3'>
                    <Button variant={"outline"} asChild className='h-8 w-8 border-border/70 bg-background/70 px-0 hover:border-yellow-300 hover:bg-yellow-100 hover:text-yellow-900 sm:w-auto sm:px-3 dark:hover:border-yellow-700 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-100'>
                        <a href="/"><Code2 className='size-4' /> <span className='sr-only sm:not-sr-only sm:inline'>Contribute</span></a>
                    </Button>
                    <Button variant={"outline"} asChild className='h-8 w-8 border-border/70 bg-background/70 px-0 hover:border-rose-300 hover:bg-rose-100 hover:text-rose-900 sm:w-auto sm:px-3 dark:hover:border-rose-700 dark:hover:bg-rose-900/30 dark:hover:text-rose-100'>
                        <a href="/"><Heart className='size-4' /> <span className='sr-only sm:not-sr-only sm:inline'>Support</span></a>
                    </Button>
                    <Button asChild className='h-8 w-8 px-0 shadow-sm sm:w-auto sm:px-3'>
                        <Link href="/"><ArrowRight className='size-4' /> <span className='sr-only sm:not-sr-only sm:inline'>Get Started</span></Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default Header