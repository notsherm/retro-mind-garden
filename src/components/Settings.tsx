import React from 'react';
import { Settings as SettingsIcon, LogOut, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch";

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
  const [isHelpOpen, setIsHelpOpen] = React.useState(false);
  const [currentTheme, setCurrentTheme] = React.useState<Theme>('classic-terminal');
  const [blurMode, setBlurMode] = React.useState(false);

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

  const handleBlurModeChange = (checked: boolean) => {
    setBlurMode(checked);
    document.documentElement.setAttribute('data-blur-mode', checked ? 'enabled' : 'disabled');
    toast({
      title: checked ? "Privacy Mode Enabled" : "Privacy Mode Disabled",
      description: checked ? "Your entries are now blurred" : "Your entries are now visible",
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

            <div className="space-y-4 border-t border-terminal-green pt-4">
              <h3 className="text-terminal-green font-semibold">Privacy Mode</h3>
              <Switch
                checked={blurMode}
                onCheckedChange={handleBlurModeChange}
                className="bg-terminal-green/50 data-[state=checked]:bg-terminal-green border-2 border-terminal-green ring-2 ring-terminal-green/30"
              />
            </div>

            <div className="pt-4 border-t border-terminal-green space-y-4">
              <Button
                onClick={() => setIsHelpOpen(true)}
                className="retro-button w-full flex items-center justify-center gap-2"
              >
                <HelpCircle className="h-4 w-4" />
                Help & Features
              </Button>
              
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

      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="terminal-window max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-terminal-green text-xl font-bold mb-4">Help & Features</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 text-terminal-green">
            <section className="space-y-2">
              <h3 className="text-terminal-gray font-bold uppercase text-sm tracking-wider border-b border-terminal-gray/30 pb-1">Journal Entries</h3>
              <p>• Create new entries by typing in the left panel</p>
              <p>• Entries are automatically saved as you type</p>
              <p>• View and edit past entries from the right panel</p>
            </section>

            <section className="space-y-2">
              <h3 className="text-terminal-gray font-bold uppercase text-sm tracking-wider border-b border-terminal-gray/30 pb-1">Navigation</h3>
              <p>• Use the calendar icon to view entries from different dates</p>
              <p>• Search through your entries using the search icon</p>
              <p>• New entries are always added to today's date</p>
            </section>

            <section className="space-y-2">
              <h3 className="text-terminal-gray font-bold uppercase text-sm tracking-wider border-b border-terminal-gray/30 pb-1">AI Analysis</h3>
              <p>• Get AI-powered insights about your journal entries</p>
              <p>• Analysis results are saved for each date</p>
              <p>• View analysis by clicking the "Analyze" button</p>
            </section>

            <section className="space-y-2">
              <h3 className="text-terminal-gray font-bold uppercase text-sm tracking-wider border-b border-terminal-gray/30 pb-1">Theme Customization</h3>
              <p>• Choose from multiple retro-themed styles</p>
              <p>• Themes can be changed at any time from settings</p>
              <p>• Your theme preference is saved automatically</p>
            </section>

            <section className="space-y-2">
              <h3 className="text-terminal-gray font-bold uppercase text-sm tracking-wider border-b border-terminal-gray/30 pb-1">Tips</h3>
              <p>• Your entries are private and secure</p>
              <p>• Use the search function to find specific content</p>
              <p>• The app works best when used daily</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};