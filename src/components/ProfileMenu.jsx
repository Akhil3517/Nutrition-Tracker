import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from '../contexts/AuthContext';

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0"
          >
            <Avatar>
              <AvatarImage src="/profile-default.svg" alt="Profile" />
              <AvatarFallback className="bg-background">
                {currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
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
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ProfileMenu; 