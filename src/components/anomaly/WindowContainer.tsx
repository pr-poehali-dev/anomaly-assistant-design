import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface WindowContainerProps {
  id: string;
  title: string;
  icon: string;
  children: React.ReactNode;
  width?: string;
  activeWindow: string | null;
  setActiveWindow: (window: string | null) => void;
}

export const WindowContainer = ({ 
  id, 
  title, 
  icon, 
  children, 
  width = 'w-[600px]',
  activeWindow,
  setActiveWindow,
}: WindowContainerProps) => {
  if (activeWindow !== id) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <Card className={`${width} max-h-[80vh] overflow-auto bg-card/95 border-2 border-primary/60 neon-box`}>
        <div className="sticky top-0 z-10 bg-card/95 border-b border-primary/30 p-4 flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Icon name={icon as any} size={24} className="text-primary" />
            <h2 className="text-xl font-bold text-primary">{title}</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveWindow(null)}
            className="text-secondary hover:text-secondary hover:bg-secondary/10"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </Card>
    </div>
  );
};
