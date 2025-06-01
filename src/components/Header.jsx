import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LinkIcon, LogOut } from 'lucide-react'

const Header = () => {

  const navigate = useNavigate();
  const user = false;

  return (
    <nav className='py-4 flex justify-between items-center'>
      <Link to = "/">
        <img
          src="https://www.logologo.com/logos/abstract-isometric-logo-design-free-logo.jpg"
          className="h-16"
          alt="Logo"
        />
      </Link>

      <div>
      {!user ? 
        <Button onClick={() => navigate("/auth")}>Login</Button>
        : (
          <DropdownMenu>
            <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>UR</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Uttkarsh Ruparel</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LinkIcon className="mr-2 h-4 w-4" />
                <span>My Links</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  )
}

export default Header
