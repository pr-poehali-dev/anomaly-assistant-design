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
    { id: 'calendar', icon: 'Calendar', name: 'КАЛЕНДАРЬ', color: 'secondary' },
    { id: 'calculator', icon: 'Calculator', name: 'КАЛЬКУЛЯТОР', color: 'accent' },
    { id: 'weather', icon: 'CloudSun', name: 'ПОГОДА', color: 'primary' },
    { id: 'news', icon: 'Newspaper', name: 'НОВОСТИ', color: 'secondary' },
    { id: 'translate', icon: 'Languages', name: 'ПЕРЕВОДЧИК', color: 'accent' },
    { id: 'music', icon: 'Music', name: 'МУЗЫКА', color: 'primary' },
    { id: 'files', icon: 'FolderOpen', name: 'ФАЙЛЫ', color: 'secondary' },
    { id: 'chat', icon: 'MessageSquare', name: 'ЧАТ', color: 'accent' },
    { id: 'email', icon: 'Mail', name: 'ПОЧТА', color: 'primary' },
    { id: 'maps', icon: 'Map', name: 'КАРТЫ', color: 'secondary' },
    { id: 'settings', icon: 'Settings', name: 'НАСТРОЙКИ', color: 'accent' },
    { id: 'camera', icon: 'Camera', name: 'КАМЕРА', color: 'primary' },
    { id: 'terminal', icon: 'Terminal', name: 'ТЕРМИНАЛ', color: 'secondary' },
    { id: 'code', icon: 'Code', name: 'РЕДАКТОР', color: 'accent' },
    { id: 'health', icon: 'Heart', name: 'ЗДОРОВЬЕ', color: 'primary' },
    { id: 'gaming', icon: 'Gamepad2', name: 'GAMING', color: 'secondary' },
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