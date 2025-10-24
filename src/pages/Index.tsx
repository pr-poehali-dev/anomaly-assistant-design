import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface Reminder {
  id: string;
  text: string;
  time: string;
}

interface Note {
  id: string;
  text: string;
  timestamp: string;
}

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newNote, setNewNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            toast({
              title: "⏰ ТАЙМЕР ЗАВЕРШЁН",
              description: "Время истекло!",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, toast]);

  const handleActivate = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "АНОМАЛИЯ ДЕАКТИВИРОВАНА" : "АНОМАЛИЯ АКТИВИРОВАНА",
      description: isActive ? "Система переведена в режим ожидания" : "Все системы онлайн. Готова к работе.",
    });
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }]);
      setNewTask('');
      toast({
        title: "✅ Задача добавлена",
        description: newTask,
      });
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { 
        id: Date.now().toString(), 
        text: newNote, 
        timestamp: new Date().toLocaleString('ru-RU') 
      }]);
      setNewNote('');
      toast({
        title: "📝 Заметка сохранена",
        description: "Заметка добавлена в базу данных",
      });
    }
  };

  const startTimer = (minutes: number) => {
    setTimerSeconds(minutes * 60);
    setIsTimerRunning(true);
    toast({
      title: "⏱️ ТАЙМЕР ЗАПУЩЕН",
      description: `${minutes} минут на счётчике`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0E] via-[#1a1a2e] to-[#0A0A0E] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="scan-line"></div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-primary neon-box flex items-center justify-center animate-pulse">
              <Icon name="Cpu" size={32} className="text-primary" />
            </div>
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent neon-glow tracking-wider">
              АНОМАЛИЯ
            </h1>
          </div>
          <p className="text-lg text-muted-foreground font-light tracking-wide">
            ГОЛОСОВОЙ АССИСТЕНТ НОВОГО ПОКОЛЕНИЯ
          </p>
          
          <Button
            onClick={handleActivate}
            size="lg"
            className={`mt-8 px-12 py-6 text-xl font-bold rounded-full border-2 transition-all duration-300 ${
              isActive 
                ? 'bg-primary text-black border-primary neon-box shadow-[0_0_30px_rgba(0,255,240,0.6)] hover:shadow-[0_0_50px_rgba(0,255,240,0.8)]' 
                : 'bg-transparent text-primary border-primary/50 hover:border-primary hover:bg-primary/10'
            }`}
          >
            {isActive ? (
              <>
                <Icon name="Zap" size={24} className="mr-2" />
                СИСТЕМА АКТИВНА
              </>
            ) : (
              <>
                <Icon name="Power" size={24} className="mr-2" />
                АКТИВИРОВАТЬ
              </>
            )}
          </Button>
        </header>

        {isActive && (
          <div className="animate-fade-in">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-5 bg-card/50 border border-primary/30 neon-box mb-8 p-1 rounded-lg">
                <TabsTrigger 
                  value="home" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-black data-[state=active]:shadow-[0_0_20px_rgba(0,255,240,0.5)] font-semibold"
                >
                  <Icon name="Home" size={18} className="mr-2" />
                  Главная
                </TabsTrigger>
                <TabsTrigger 
                  value="tasks"
                  className="data-[state=active]:bg-primary data-[state=active]:text-black data-[state=active]:shadow-[0_0_20px_rgba(0,255,240,0.5)] font-semibold"
                >
                  <Icon name="CheckSquare" size={18} className="mr-2" />
                  Задачи
                </TabsTrigger>
                <TabsTrigger 
                  value="timer"
                  className="data-[state=active]:bg-primary data-[state=active]:text-black data-[state=active]:shadow-[0_0_20px_rgba(0,255,240,0.5)] font-semibold"
                >
                  <Icon name="Timer" size={18} className="mr-2" />
                  Таймеры
                </TabsTrigger>
                <TabsTrigger 
                  value="notes"
                  className="data-[state=active]:bg-primary data-[state=active]:text-black data-[state=active]:shadow-[0_0_20px_rgba(0,255,240,0.5)] font-semibold"
                >
                  <Icon name="StickyNote" size={18} className="mr-2" />
                  Заметки
                </TabsTrigger>
                <TabsTrigger 
                  value="tools"
                  className="data-[state=active]:bg-primary data-[state=active]:text-black data-[state=active]:shadow-[0_0_20px_rgba(0,255,240,0.5)] font-semibold"
                >
                  <Icon name="Sparkles" size={18} className="mr-2" />
                  Функции
                </TabsTrigger>
              </TabsList>

              <TabsContent value="home" className="space-y-6">
                <Card className="bg-card/80 border-2 border-primary/40 neon-box p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Icon name="Search" size={32} className="text-primary pulse-glow" />
                    <h2 className="text-3xl font-bold text-primary">Быстрый Поиск</h2>
                  </div>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Введите запрос для поиска..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-input border-2 border-primary/50 text-foreground text-lg py-6 pl-12 pr-4 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50"
                    />
                    <Icon name="Search" size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                  </div>
                  {searchQuery && (
                    <div className="mt-4 p-4 bg-muted rounded-lg border border-primary/30">
                      <p className="text-sm text-muted-foreground">
                        Результаты для: <span className="text-primary font-semibold">{searchQuery}</span>
                      </p>
                    </div>
                  )}
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-card/80 border-2 border-secondary/40 neon-box p-6 hover:scale-105 transition-transform cursor-pointer">
                    <Icon name="Cloud" size={40} className="text-secondary mb-4 pulse-glow" />
                    <h3 className="text-xl font-bold text-secondary mb-2">Погода</h3>
                    <p className="text-muted-foreground text-sm">Прогноз погоды на сегодня и неделю</p>
                  </Card>

                  <Card className="bg-card/80 border-2 border-accent/40 neon-box p-6 hover:scale-105 transition-transform cursor-pointer">
                    <Icon name="Newspaper" size={40} className="text-accent mb-4 pulse-glow" />
                    <h3 className="text-xl font-bold text-accent mb-2">Новости</h3>
                    <p className="text-muted-foreground text-sm">Актуальные новости дня</p>
                  </Card>

                  <Card className="bg-card/80 border-2 border-primary/40 neon-box p-6 hover:scale-105 transition-transform cursor-pointer">
                    <Icon name="Languages" size={40} className="text-primary mb-4 pulse-glow" />
                    <h3 className="text-xl font-bold text-primary mb-2">Переводы</h3>
                    <p className="text-muted-foreground text-sm">Мгновенный перевод на любой язык</p>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-6">
                <Card className="bg-card/80 border-2 border-primary/40 neon-box p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Icon name="CheckSquare" size={32} className="text-primary pulse-glow" />
                    <h2 className="text-3xl font-bold text-primary">Управление Задачами</h2>
                  </div>
                  
                  <div className="flex gap-4 mb-6">
                    <Input
                      type="text"
                      placeholder="Новая задача..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTask()}
                      className="flex-1 bg-input border-2 border-primary/50 text-foreground py-6"
                    />
                    <Button
                      onClick={addTask}
                      className="bg-primary text-black hover:bg-primary/90 px-8 py-6 font-bold neon-box"
                    >
                      <Icon name="Plus" size={20} className="mr-2" />
                      Добавить
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {tasks.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Icon name="ListTodo" size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Нет активных задач</p>
                      </div>
                    ) : (
                      tasks.map((task) => (
                        <Card
                          key={task.id}
                          className={`p-4 border-2 transition-all ${
                            task.completed
                              ? 'bg-muted/30 border-muted/50 opacity-60'
                              : 'bg-card/80 border-primary/40 neon-box'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => toggleTask(task.id)}
                              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                                task.completed
                                  ? 'bg-primary border-primary'
                                  : 'border-primary/50 hover:border-primary'
                              }`}
                            >
                              {task.completed && <Icon name="Check" size={16} className="text-black" />}
                            </button>
                            <p className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground font-medium'}`}>
                              {task.text}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTask(task.id)}
                              className="text-secondary hover:text-secondary hover:bg-secondary/10"
                            >
                              <Icon name="Trash2" size={18} />
                            </Button>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="timer" className="space-y-6">
                <Card className="bg-card/80 border-2 border-accent/40 neon-box p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Icon name="Timer" size={32} className="text-accent pulse-glow" />
                    <h2 className="text-3xl font-bold text-accent">Таймеры</h2>
                  </div>

                  {timerSeconds > 0 && (
                    <div className="text-center mb-8">
                      <div className="inline-block relative">
                        <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary to-secondary neon-glow mb-4">
                          {formatTime(timerSeconds)}
                        </div>
                        <div className="absolute -inset-4 border-4 border-accent/30 rounded-lg animate-pulse"></div>
                      </div>
                      <Button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className="mt-6 bg-accent text-black hover:bg-accent/90 px-8 py-4 font-bold neon-box"
                      >
                        <Icon name={isTimerRunning ? "Pause" : "Play"} size={20} className="mr-2" />
                        {isTimerRunning ? 'Пауза' : 'Продолжить'}
                      </Button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[5, 10, 15, 30].map((minutes) => (
                      <Button
                        key={minutes}
                        onClick={() => startTimer(minutes)}
                        className="bg-card border-2 border-accent/50 hover:border-accent hover:bg-accent/10 text-foreground py-8 text-lg font-bold neon-box"
                      >
                        {minutes} мин
                      </Button>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="space-y-6">
                <Card className="bg-card/80 border-2 border-secondary/40 neon-box p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Icon name="StickyNote" size={32} className="text-secondary pulse-glow" />
                    <h2 className="text-3xl font-bold text-secondary">Быстрые Заметки</h2>
                  </div>

                  <div className="flex gap-4 mb-6">
                    <Input
                      type="text"
                      placeholder="Новая заметка..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addNote()}
                      className="flex-1 bg-input border-2 border-secondary/50 text-foreground py-6"
                    />
                    <Button
                      onClick={addNote}
                      className="bg-secondary text-black hover:bg-secondary/90 px-8 py-6 font-bold neon-box"
                    >
                      <Icon name="Plus" size={20} className="mr-2" />
                      Сохранить
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {notes.length === 0 ? (
                      <div className="col-span-2 text-center py-12 text-muted-foreground">
                        <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Нет сохранённых заметок</p>
                      </div>
                    ) : (
                      notes.map((note) => (
                        <Card
                          key={note.id}
                          className="bg-card/80 border-2 border-secondary/40 neon-box p-6 hover:scale-105 transition-transform"
                        >
                          <p className="text-foreground mb-3 font-medium">{note.text}</p>
                          <Badge variant="outline" className="text-xs border-secondary/50 text-secondary">
                            {note.timestamp}
                          </Badge>
                        </Card>
                      ))
                    )}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="tools" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-card/80 border-2 border-primary/40 neon-box p-6 hover:scale-105 transition-transform cursor-pointer">
                    <Icon name="Calculator" size={48} className="text-primary mb-4 pulse-glow" />
                    <h3 className="text-2xl font-bold text-primary mb-2">Калькулятор</h3>
                    <p className="text-muted-foreground">Сложные расчёты и конвертация единиц</p>
                  </Card>

                  <Card className="bg-card/80 border-2 border-secondary/40 neon-box p-6 hover:scale-105 transition-transform cursor-pointer">
                    <Icon name="Home" size={48} className="text-secondary mb-4 pulse-glow" />
                    <h3 className="text-2xl font-bold text-secondary mb-2">Умный Дом</h3>
                    <p className="text-muted-foreground">Управление освещением и климатом</p>
                  </Card>

                  <Card className="bg-card/80 border-2 border-accent/40 neon-box p-6 hover:scale-105 transition-transform cursor-pointer">
                    <Icon name="Music" size={48} className="text-accent mb-4 pulse-glow" />
                    <h3 className="text-2xl font-bold text-accent mb-2">Музыка</h3>
                    <p className="text-muted-foreground">Управление плейлистами и треками</p>
                  </Card>

                  <Card className="bg-card/80 border-2 border-primary/40 neon-box p-6 hover:scale-105 transition-transform cursor-pointer">
                    <Icon name="Gamepad2" size={48} className="text-primary mb-4 pulse-glow" />
                    <h3 className="text-2xl font-bold text-primary mb-2">Игровой Режим</h3>
                    <p className="text-muted-foreground">Оптимизация системы для игр</p>
                  </Card>

                  <Card className="bg-card/80 border-2 border-secondary/40 neon-box p-6 hover:scale-105 transition-transform cursor-pointer">
                    <Icon name="Lightbulb" size={48} className="text-secondary mb-4 pulse-glow" />
                    <h3 className="text-2xl font-bold text-secondary mb-2">Креативность</h3>
                    <p className="text-muted-foreground">Генерация идей и мозговой штурм</p>
                  </Card>

                  <Card className="bg-card/80 border-2 border-accent/40 neon-box p-6 hover:scale-105 transition-transform cursor-pointer">
                    <Icon name="TrendingUp" size={48} className="text-accent mb-4 pulse-glow" />
                    <h3 className="text-2xl font-bold text-accent mb-2">Продуктивность</h3>
                    <p className="text-muted-foreground">Статистика и аналитика работы</p>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      <footer className="relative z-10 text-center py-8 mt-16">
        <p className="text-muted-foreground text-sm tracking-wide">
          ANOMALY VOICE ASSISTANT v2.0 • SYSTEM STATUS: <span className="text-primary font-bold">ONLINE</span>
        </p>
      </footer>
    </div>
  );
};

export default Index;
