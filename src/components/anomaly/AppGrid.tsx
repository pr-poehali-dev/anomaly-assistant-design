import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface AppGridProps {
  setActiveWindow: (window: string) => void;
}

export const AppGrid = ({ setActiveWindow }: AppGridProps) => {
  const apps = [
    { id: 'tasks', icon: 'ListTodo', name: 'ЗАДАЧИ', color: 'primary' },
    { id: 'notes', icon: 'StickyNote', name: 'ЗАМЕТКИ', color: 'secondary' },
    { id: 'timer', icon: 'Timer', name: 'ТАЙМЕР', color: 'accent' },
    { id: 'smart-home', icon: 'Home', name: 'УМНЫЙ ДОМ', color: 'primary' },
    { id: 'calculator', icon: 'Calculator', name: 'КАЛЬКУЛЯТОР', color: 'secondary' },
    { id: 'weather', icon: 'CloudSun', name: 'ПОГОДА', color: 'accent' },
    { id: 'news', icon: 'Newspaper', name: 'НОВОСТИ', color: 'primary' },
    { id: 'translate', icon: 'Languages', name: 'ПЕРЕВОДЧИК', color: 'secondary' },
    { id: 'music', icon: 'Music', name: 'МУЗЫКА', color: 'accent' },
    { id: 'gaming', icon: 'Gamepad2', name: 'GAMING', color: 'primary' },
  ];

  return (
    <div className="grid grid-cols-5 gap-6">
      {apps.map((app) => (
        <Card 
          key={app.id}
          onClick={() => setActiveWindow(app.id)}
          className={`bg-card/80 border-2 border-${app.color}/40 neon-box p-8 hover:scale-105 hover:border-${app.color} transition-all cursor-pointer group`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className={`w-16 h-16 rounded-xl border-2 border-${app.color}/60 bg-${app.color}/10 flex items-center justify-center group-hover:bg-${app.color}/20 transition-all`}>
              <Icon name={app.icon as any} size={32} className={`text-${app.color}`} />
            </div>
            <span className={`text-sm font-bold text-${app.color} tracking-wider`}>{app.name}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};
