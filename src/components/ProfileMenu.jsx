import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { cn } from "@/lib/utils";

const ProfileMenu = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0"
        >
          <Avatar>
            <AvatarImage src="/profile-default.svg" alt="Profile" />
            <AvatarFallback className="bg-background">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal"
            onClick={handleProfile}
          >
            <span className="mr-2">👤</span>
            Profile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal"
            onClick={handleLogout}
          >
            <span className="mr-2">🚪</span>
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProfileMenu; 