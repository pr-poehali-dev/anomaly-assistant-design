import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { WeatherData } from './types';

interface AnomalyHeaderProps {
  weatherData: WeatherData;
  voiceEnabled: boolean;
  isListening: boolean;
  isActive: boolean;
  toggleVoiceResponses: () => void;
  toggleVoiceListening: () => void;
  handleActivate: () => void;
}

export const AnomalyHeader = ({
  weatherData,
  voiceEnabled,
  isListening,
  isActive,
  toggleVoiceResponses,
  toggleVoiceListening,
  handleActivate,
}: AnomalyHeaderProps) => {
  return (
    <header className="border-b border-primary/20 bg-card/30 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary neon-box flex items-center justify-center animate-pulse">
            <Icon name="Cpu" size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent tracking-wider">
              АНОМАЛИЯ
            </h1>
            <p className="text-xs text-muted-foreground">Desktop OS v2.0</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Thermometer" size={16} className="text-secondary" />
            <span className="text-foreground">{weatherData.temp}°C</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Icon name="Clock" size={16} className="text-accent" />
            <span className="text-foreground">{new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <Button
            onClick={toggleVoiceResponses}
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            title="Вкл/выкл голосовые ответы"
          >
            <Icon name={voiceEnabled ? "Volume2" : "VolumeX"} size={20} />
          </Button>
          <Button
            onClick={toggleVoiceListening}
            size="sm"
            className={`px-6 font-bold border-2 transition-all ${
              isListening
                ? 'bg-secondary text-black border-secondary shadow-[0_0_20px_rgba(255,0,110,0.6)] animate-pulse' 
                : 'bg-transparent text-secondary border-secondary/50 hover:border-secondary'
            }`}
          >
            <Icon name="Mic" size={16} className="mr-2" />
            {isListening ? 'СЛУШАЮ' : 'ГОЛОС'}
          </Button>
          <Button
            onClick={handleActivate}
            size="sm"
            className={`px-6 font-bold border-2 transition-all ${
              isActive 
                ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(0,255,240,0.6)]' 
                : 'bg-transparent text-primary border-primary/50 hover:border-primary'
            }`}
          >
            {isActive ? (
              <>
                <Icon name="Zap" size={16} className="mr-2" />
                АКТИВНА
              </>
            ) : (
              <>
                <Icon name="Power" size={16} className="mr-2" />
                АКТИВИРОВАТЬ
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
