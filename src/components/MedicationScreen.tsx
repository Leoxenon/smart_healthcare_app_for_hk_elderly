import { ArrowLeft, Plus, Check, Clock } from 'lucide-react';
import { VoiceButton } from './VoiceButton';
import { EmergencyButton } from './EmergencyButton';
import { useState } from 'react';

interface MedicationScreenProps {
  onNavigate: (screen: string) => void;
  onEmergency: () => void;
}

export function MedicationScreen({ onNavigate, onEmergency }: MedicationScreenProps) {
  const [medications, setMedications] = useState([
    {
      id: 1,
      time: '08:00',
      name: '降血壓藥',
      dosage: '1粒',
      taken: true,
      image: '💊',
      instructions: '飯後服用，配溫水',
      voiceText: '早上八點：降血壓藥，一粒，飯後服用，配溫水。',
    },
    {
      id: 2,
      time: '12:00',
      name: '降血糖藥',
      dosage: '2粒',
      taken: false,
      image: '💊',
      instructions: '午餐前30分鐘服用',
      voiceText: '中午十二點：降血糖藥，兩粒，午餐前三十分鐘服用。',
    },
    {
      id: 3,
      time: '18:00',
      name: '心臟藥',
      dosage: '1粒',
      taken: false,
      image: '💊',
      instructions: '晚餐後服用',
      voiceText: '晚上六點：心臟藥，一粒，晚餐後服用。',
    },
    {
      id: 4,
      time: '21:00',
      name: '安眠藥',
      dosage: '半粒',
      taken: false,
      image: '💊',
      instructions: '睡前服用',
      voiceText: '晚上九點：安眠藥，半粒，睡前服用。',
    },
  ]);

  const handleTaken = (id: number) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, taken: true } : med
    ));
  };

  const handleRemindLater = (id: number) => {
    // Mock remind later functionality
    alert('將在15分鐘後再次提醒您');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-4 hover:bg-gray-100 rounded-2xl transition-all"
              aria-label="返回"
            >
              <ArrowLeft className="w-8 h-8 text-gray-700" />
            </button>
            <h1 className="text-green-700">今天的用藥</h1>
          </div>
          <VoiceButton 
            text="今天的用藥頁面。以下顯示您今天需要服用的所有藥物，包括時間、藥名和用量。請按時服用。"
            size="large"
          />
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          {medications.map((med) => (
            <div
              key={med.id}
              className={`bg-white rounded-3xl shadow-lg p-8 border-4 ${
                med.taken ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="text-6xl">{med.image}</div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-8 h-8 text-blue-600" />
                      <span className="text-blue-600">{med.time}</span>
                    </div>
                    <h2 className="mb-2">{med.name}</h2>
                    <p className="text-gray-600">用量：{med.dosage}</p>
                    <p className="text-gray-600">{med.instructions}</p>
                  </div>
                </div>
                <VoiceButton text={med.voiceText} />
              </div>

              {med.taken ? (
                <div className="bg-green-100 border-2 border-green-400 rounded-2xl px-8 py-6 flex items-center justify-center gap-3">
                  <Check className="w-8 h-8 text-green-700" />
                  <span className="text-green-700">已服用</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleTaken(med.id)}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-2xl px-8 py-6 transition-all hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <Check className="w-8 h-8" />
                    <span>已服用</span>
                  </button>
                  <button
                    onClick={() => handleRemindLater(med.id)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-2xl px-8 py-6 transition-all hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <Clock className="w-8 h-8" />
                    <span>稍後提醒</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => alert('添加新用藥')}
          className="w-full mt-8 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-8 py-8 transition-all hover:scale-105 flex items-center justify-center gap-4 shadow-lg"
        >
          <Plus className="w-10 h-10" />
          <span>添加用藥</span>
        </button>
      </div>

      <EmergencyButton onClick={onEmergency} />
    </div>
  );
}
