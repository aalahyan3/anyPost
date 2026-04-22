import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { ArrowRight, Code2, Heart } from 'lucide-react'
import Logo from './Logo'
import ServerAvailabilityNotice from './ServerAvailabilityNotice'

function Header() {
    return (
        <header className='sticky top-0 md:top-4 z-30 w-full border-b border-border/60 md:border px-4 py-3 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/70 md:rounded-xl'>
            <div className='mx-auto flex w-full items-center justify-between gap-3'>
                <Link href='/' className='text-lg font-semibold tracking-tight transition-colors sm:text-xl'>
                    <Logo className="mb-2 text-lg" />
                </Link>
                <div className='flex items-center gap-2 sm:gap-3'>

                    <a href={"https://github.com/aalahyan3/anyPost"} target="_blank" rel="noopener noreferrer" className='block h-12 w-12 '>
                        <img src={"https://img.icons8.com/?size=100&id=efFfwotdkiU5&format=png&color=000000"} alt="github" className="h-full w-full object-center" />
                    </a>


                    <Button className="h-10 gap-2 rounded-xl  p-6 text-sm" asChild>
                        <Link href={"/dashboard"}>

                            Get started
                            <ArrowRight className="h-6 w-6" />
                        </Link>
                    </Button>
                </div>
            </div>
            <ServerAvailabilityNotice />
        </header>
    )
}

export default Header