import React, { useState } from 'react';

interface Server {
  id: string;
  name: string;
  url: string;
  apiKey: string;
  maxFileSize: number;
  type: 'free' | 'paid' | 'private';
}

interface ServerSettingsProps {
  onServerAdd: (server: Server) => void;
  onServerRemove: (id: string) => void;
  servers: Server[];
}

export const ServerSettings: React.FC<ServerSettingsProps> = ({
  onServerAdd,
  onServerRemove,
  servers
}) => {
  const [serverName, setServerName] = useState('');
  const [serverUrl, setServerUrl] = useState('');
  const [serverApiKey, setServerApiKey] = useState('');
  const [serverType, setServerType] = useState<'free' | 'paid' | 'private'>('paid');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddServer = () => {
    if (!serverName.trim() || !serverUrl.trim()) {
      alert('יש למלא לפחות שם וכתובת שרת');
      return;
    }

    const newServer: Server = {
      id: Date.now().toString(),
      name: serverName.trim(),
      url: serverUrl.trim(),
      apiKey: serverApiKey.trim(),
      maxFileSize: serverType === 'free' ? 2 * 1024 * 1024 * 1024 : 50 * 1024 * 1024 * 1024, // 2GB או 50GB
      type: serverType
    };

    onServerAdd(newServer);
    setServerName('');
    setServerUrl('');
    setServerApiKey('');
    setServerType('paid');
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-cyan-400 mb-4">שרתי עיבוד חיצוניים</h3>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            שם השרת
          </label>
          <input
            type="text"
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
            placeholder="למשל: שרת AWS שלי"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-100 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            כתובת API
          </label>
          <input
            type="url"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            placeholder="https://my-api.example.com/process"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-100 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            API Key
          </label>
          <input
            type="password"
            value={serverApiKey}
            onChange={(e) => setServerApiKey(e.target.value)}
            placeholder="המפתח שלך מהשרת"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-100 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            סוג שרת
          </label>
          <select
            value={serverType}
            onChange={(e) => setServerType(e.target.value as 'free' | 'paid' | 'private')}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-100 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="paid">שרת מזומן (יכול עצום)</option>
            <option value="free">שרת חינמי (מגבלות)</option>
            <option value="private">שרת פרטי שלי</option>
          </select>
        </div>

        <button
          onClick={handleAddServer}
          disabled={!serverName.trim() || !serverUrl.trim()}
          className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          הוסף שרת
        </button>
      </div>

      {/* Server List */}
      {servers.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-medium text-gray-300">שרתי מערכה:</h4>
          {servers.map((server) => (
            <div key={server.id} className="bg-gray-700 rounded-lg p-3 flex justify-between items-center">
              <div>
                <h5 className="font-medium text-white">{server.name}</h5>
                <p className="text-sm text-gray-400">{server.type === 'free' ? 'חינמי' : 'מזומן'}</p>
                <p className="text-xs text-gray-500">
                  מקסימום: {(server.maxFileSize / (1024 * 1024 * 1024)).toFixed(1)}GB
                </p>
              </div>
              <button
                onClick={() => onServerRemove(server.id)}
                className="text-red-400 hover:text-red-300 p-2"
              >
                מחק
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-900/30 rounded-lg">
        <h4 className="text-lg font-medium text-blue-400 mb-2">שרתי מומלצים:</h4>
        <div className="space-y-2">
          <p className="text-gray-300">• <strong>Linode:</strong> שרת דיגיטלי לינוקס מאוד יעיל</p>
          <p className="text-gray-300">• <strong>Railway.app:</strong> דיפלואימנט מהיר עם דוקר</p>
          <p className="text-gray-300">• <strong>Vercel:</strong> עיבוד וידאו עם Edge Functions</p>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          כל שרת דורש כתובת API ו-API Key משלו. ודא שהשרת תומך בעיבוד וידאו גדול.
        </p>
      </div>
    </div>
  );
};
