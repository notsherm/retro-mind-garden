import React from 'react';
import { Settings as SettingsIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type Theme = 'classic-terminal' | 'light-terminal' | 'purple-dream' | 'ocean-breeze';

const themes: { id: Theme; name: string }[] = [
  { id: 'classic-terminal', name: 'Classic Terminal' },
  { id: 'light-terminal', name: 'Light Terminal' },
  { id: 'purple-dream', name: 'Purple Dream' },
  { id: 'ocean-breeze', name: 'Ocean Breeze' },
];

export const Settings = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentTheme, setCurrentTheme] = React.useState<Theme>('classic-terminal');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
  };

  const handleThemeChange = (newTheme: Theme) => {
    setCurrentTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    toast({
      title: "Theme Updated",
      description: `Switched to ${newTheme.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`,
      duration: 2000,
    });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="retro-button">
        <SettingsIcon className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="terminal-window">
          <DialogHeader>
            <DialogTitle className="text-terminal-green text-xl font-bold mb-4">Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-terminal-green font-semibold">Themes</h3>
              <div className="grid grid-cols-2 gap-4">
                {themes.map((theme) => (
                  <Button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`retro-button h-20 flex flex-col items-center justify-center ${
                      currentTheme === theme.id ? 'ring-2 ring-terminal-green' : ''
                    }`}
                  >
                    <span className="text-sm">{theme.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-terminal-green">
              <Button
                onClick={handleSignOut}
                className="retro-button w-full flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};